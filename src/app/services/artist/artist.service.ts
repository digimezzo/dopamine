import { Injectable } from '@angular/core';
import { DataDelimiter } from '../../data/data-delimiter';
import { ArtistData } from '../../data/entities/artist-data';
import { ArtistModel } from './artist-model';
import { ArtistType } from './artist-type';
import { ArtistServiceBase } from './artist.service.base';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { ArtistSplitter } from './artist-splitter';
import { Timer } from '../../common/scheduling/timer';
import { Logger } from '../../common/logger';
import { CollectionUtils } from '../../common/utils/collections-utils';
import { SettingsBase } from '../../common/settings/settings.base';

@Injectable()
export class ArtistService implements ArtistServiceBase {
    private sourceArtists: string[] = [];
    public constructor(
        private artistSplitter: ArtistSplitter,
        private trackRepository: TrackRepositoryBase,
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    public getArtists(artistType: ArtistType): ArtistModel[] {
        const timer = new Timer();
        timer.start();

        const artistDatas: ArtistData[] = [];

        if (artistType === ArtistType.trackArtists || artistType === ArtistType.allArtists) {
            const trackArtistDatas: ArtistData[] = this.trackRepository.getTrackArtistData() ?? [];
            artistDatas.push(...trackArtistDatas);
        }

        if (artistType === ArtistType.albumArtists || artistType === ArtistType.allArtists) {
            const albumArtistDatas: ArtistData[] = this.trackRepository.getAlbumArtistData() ?? [];
            artistDatas.push(...albumArtistDatas);
        }

        const artists: string[] = [];

        for (const artistData of artistDatas) {
            artists.push(...DataDelimiter.fromDelimitedString(artistData.artists));
        }

        timer.stop();

        this.logger.info(`Finished getting artists. Time required: ${timer.elapsedMilliseconds} ms`, 'ArtistService', 'getArtists');

        timer.start();

        this.sourceArtists = artists;
        const splitArtists: ArtistModel[] = this.artistSplitter.splitArtists(artists);

        timer.stop();

        this.logger.info(`Finished splitting artists. Time required: ${timer.elapsedMilliseconds} ms`, 'ArtistService', 'getArtists');

        return splitArtists;
    }

    public getSourceArtists(artists: ArtistModel[]): string[] {
        const separators: string[] = CollectionUtils.fromString(this.settings.artistSplitSeparators);
        const filteredSourceArtists: string[] = [];
        const lowerCaseArtistNames = new Set(artists.map((artist) => artist.name.toLowerCase()));

        const sourceArtistsSurroundedBySpaces = this.sourceArtists.map((artist) => ` ${artist} `);
        for (const sourceArtist of sourceArtistsSurroundedBySpaces) {
            if (
                [...lowerCaseArtistNames].some((name) =>
                    separators.some(
                        (separator) =>
                            sourceArtist.toLowerCase() === ` ${name} ` ||
                            sourceArtist.toLowerCase().includes(` ${separator} ${name} `) ||
                            sourceArtist.toLowerCase().includes(` ${name} ${separator} `),
                    ),
                )
            ) {
                filteredSourceArtists.push(sourceArtist.trim());
            }
        }

        return filteredSourceArtists;
    }
}
