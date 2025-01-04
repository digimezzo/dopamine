import { Injectable } from '@angular/core';
import { LastfmApi } from '../../common/api/lastfm/lastfm.api';
import { LastfmArtist } from '../../common/api/lastfm/lastfm-artist';
import { Logger } from '../../common/logger';
import { StringUtils } from '../../common/utils/string-utils';
import { TrackModel } from '../track/track-model';
import { ArtistInformation } from './artist-information';
import { ArtistInformationFactory } from './artist-information-factory';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { ArtistInformationServiceBase } from './artist-information.service.base';
import { OnlineArtistImageGetter } from './online-artist-image-getter';

@Injectable()
export class ArtistInformationService implements ArtistInformationServiceBase {
    public constructor(
        private translatorService: TranslatorServiceBase,
        private artistInformationFactory: ArtistInformationFactory,
        private onlineArtistImageGetter: OnlineArtistImageGetter,
        private lastfmApi: LastfmApi,

        private logger: Logger,
    ) {}

    private cachedArtistInformation: ArtistInformation = ArtistInformation.empty();

    public getQuickArtistInformation(track: TrackModel | undefined): ArtistInformation {
        if (track == undefined) {
            return ArtistInformation.empty();
        }

        return this.artistInformationFactory.create(track.rawFirstArtist, '', '', '');
    }

    public async getArtistInformationAsync(track: TrackModel | undefined): Promise<ArtistInformation> {
        let artistInformation: ArtistInformation = ArtistInformation.empty();

        if (track == undefined) {
            return artistInformation;
        }

        if (StringUtils.isNullOrWhiteSpace(track.rawFirstArtist)) {
            return artistInformation;
        }

        if (this.cachedArtistInformation != ArtistInformation.empty() && this.cachedArtistInformation.name === track.rawFirstArtist) {
            return this.cachedArtistInformation;
        }

        let lastfmArtist: LastfmArtist | undefined;

        try {
            lastfmArtist = await this.lastfmApi.getArtistInfoAsync(track.rawFirstArtist, true, this.translatorService.get('language-code'));

            if (
                lastfmArtist == undefined ||
                lastfmArtist.biography == undefined ||
                StringUtils.isNullOrWhiteSpace(lastfmArtist.biography.content)
            ) {
                // In case there is no localized Biography, get the English one.
                lastfmArtist = await this.lastfmApi.getArtistInfoAsync(track.rawFirstArtist, true, 'EN');
            }
        } catch (e: unknown) {
            this.logger.error(e, 'Could not get lastfmArtist', 'ArtistInformationService', 'getArtistInformationAsync');
        }

        if (lastfmArtist == undefined) {
            return artistInformation;
        }

        let artistImageUrl: string = '';

        try {
            artistImageUrl = await this.onlineArtistImageGetter.getResizedArtistImageAsync(lastfmArtist.musicBrainzId, 300);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not get artistImageUrl', 'ArtistInformationService', 'getArtistInformationAsync');
        }

        let biography: string = '';

        if (lastfmArtist.biography != undefined && !StringUtils.isNullOrWhiteSpace(lastfmArtist.biography.content)) {
            biography = this.removeUrlAndConvertLineBreaks(lastfmArtist.biography.content);
        }

        artistInformation = this.artistInformationFactory.create(lastfmArtist.name, lastfmArtist.url, artistImageUrl, biography);

        // Similar artists
        if (lastfmArtist.similarArtists != undefined && lastfmArtist.similarArtists.length > 0) {
            for (const similarArtist of lastfmArtist.similarArtists) {
                try {
                    const lastfmArtist: LastfmArtist = await this.lastfmApi.getArtistInfoAsync(similarArtist.name, true, 'EN');

                    // Last.fm was so nice to break their artist image API. So we need to get images from elsewhere.
                    const artistImageUrl: string = await this.onlineArtistImageGetter.getArtistImageAsync(lastfmArtist.musicBrainzId);
                    artistInformation.addSimilarArtist(lastfmArtist.name, lastfmArtist.url, artistImageUrl);
                } catch (e: unknown) {
                    this.logger.error(
                        e,
                        `Could not get info for similar artist '${similarArtist.name}'`,
                        'ArtistInformationService',
                        'getArtistInformationAsync',
                    );
                }
            }
        }

        this.cachedArtistInformation = artistInformation;

        return artistInformation;
    }

    private removeUrlAndConvertLineBreaks(biography: string): string {
        // Removes the URL from the Biography content and converts line breaks to html breaks
        return biography
            .replace(/(<a.*$)/, '')
            .replace(/\n/g, '<br/>')
            .trim();
    }
}
