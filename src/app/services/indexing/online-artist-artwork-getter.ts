import { Injectable } from '@angular/core';
import { StringUtils } from '../../common/utils/string-utils';
import { LastfmArtist } from '../../common/api/lastfm/lastfm-artist';
import { Logger } from '../../common/logger';
import { ImageProcessor } from '../../common/image-processor';
import { LastfmApi } from '../../common/api/lastfm/lastfm.api';
import { OnlineArtistImageGetter } from '../artist-information/online-artist-image-getter';
import { Constants } from '../../common/application/constants';
import { MusicBrainzApi } from '../../common/api/musicbrainz/musicbrainz.api';

@Injectable()
export class OnlineArtistArtworkGetter {
    public constructor(
        private onlineArtistImageGetter: OnlineArtistImageGetter,
        private imageProcessor: ImageProcessor,
        private lastfmApi: LastfmApi,
        private musicBrainzApi: MusicBrainzApi,
        private logger: Logger,
    ) {}

    public async getOnlineArtworkAsync(artistName: string): Promise<Buffer | undefined> {
        try {
            let artistImageUrl: string;
            const lastfmArtist: LastfmArtist = await this.getLastFmArtistAsync(artistName);
            artistImageUrl = await this.getImageUrlByMusicBrainzIdAsync(artistName, lastfmArtist.musicBrainzId);
            if (!StringUtils.isNullOrWhiteSpace(artistImageUrl)) {
                return await this.downloadImageAsync(artistName, artistImageUrl);
            }

            // fallback to MusicBrainz API
            const musicBrainzId: string = await this.musicBrainzApi.getMusicBrainzIdAsync(artistName);
            artistImageUrl = await this.getImageUrlByMusicBrainzIdAsync(artistName, musicBrainzId);
            if (!StringUtils.isNullOrWhiteSpace(artistImageUrl)) {
                return await this.downloadImageAsync(artistName, artistImageUrl);
            }

            this.logger.info(`Could not find online artwork for '${artistName}'`, 'OnlineArtistArtworkGetter', 'getOnlineArtworkAsync');
            return Constants.emptyImageBuffer;
        } catch (error) {
            this.logger.error(error, `Could not get artist image for '${artistName}'`, 'OnlineArtistArtworkGetter', 'getOnlineArtworkAsync');
            return undefined;
        }
    }

    private async getLastFmArtistAsync(artistName: string): Promise<LastfmArtist> {
        try {
            return await this.lastfmApi.getArtistInfoAsync(artistName, false, 'EN');
        } catch (error: unknown) {
            this.logger.error(error, `Could not get artist info for '${artistName}'`, 'OnlineArtistArtworkGetter', 'getLastFmArtistAsync');
            throw error;
        }
    }

    private async getImageUrlByMusicBrainzIdAsync(artistName: string, musicBrainzId: string): Promise<string> {
        if (!StringUtils.isNullOrWhiteSpace(musicBrainzId)) {
            try {
                return await this.onlineArtistImageGetter.getArtistImageAsync(musicBrainzId);
            } catch (error: unknown) {
                this.logger.error(
                    error,
                    `Could not get artist image URL for '${artistName}'`,
                    'OnlineArtistArtworkGetter',
                    'getImageUrlByMusicBrainzIdAsync',
                );
                throw error;
            }
        }

        return '';
    }

    private async downloadImageAsync(artistName: string, imageUrl: string): Promise<Buffer | undefined> {
        try {
            const artworkData: Buffer = await this.imageProcessor.convertOnlineImageToBufferAsync(imageUrl);
            this.logger.info(`Downloaded online artwork for '${artistName}'`, 'ArtistArtworkGetter', 'downloadImageAsync');
            return artworkData;
        } catch (error: unknown) {
            this.logger.error(error, `Could not convert file '${imageUrl}' to data`, 'OnlineArtistArtworkGetter', 'downloadImageAsync');
            throw error;
        }
    }
}
