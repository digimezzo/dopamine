import { Injectable } from '@angular/core';
import { DataDelimiter } from '../../data/data-delimiter';
import { ArtistData } from '../../data/entities/artist-data';
import { ArtistModel } from './artist-model';
import { ArtistType } from './artist-type';
import { ArtistServiceBase } from './artist.service.base';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { ArtistSplitter } from './artist-splitter';

@Injectable()
export class ArtistService implements ArtistServiceBase {
    public constructor(
        private artistSplitter: ArtistSplitter,
        private trackRepository: TrackRepositoryBase,
    ) {}

    public getArtists(artistType: ArtistType): ArtistModel[] {
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

        return this.artistSplitter.splitArtists(artists);
    }
}
