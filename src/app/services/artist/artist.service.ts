import { Injectable } from '@angular/core';
import { DataDelimiter } from '../../common/data/data-delimiter';
import { ArtistData } from '../../common/data/entities/artist-data';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { ArtistModel } from './artist-model';
import { ArtistType } from './artist-type';
import { BaseArtistService } from './base-artist.service';

@Injectable()
export class ArtistService implements BaseArtistService {
    constructor(private translatorService: BaseTranslatorService, private trackRepository: BaseTrackRepository) {}

    public getArtists(artistType: ArtistType): ArtistModel[] {
        const artistDatas: ArtistData[] = [];

        if (artistType === ArtistType.trackArtists || artistType === ArtistType.allArtists) {
            const trackArtistDatas: ArtistData[] = this.trackRepository.getTrackArtistData();
            artistDatas.push(...trackArtistDatas);
        }

        if (artistType === ArtistType.albumArtists || artistType === ArtistType.allArtists) {
            const albumArtistDatas: ArtistData[] = this.trackRepository.getAlbumArtistData();
            artistDatas.push(...albumArtistDatas);
        }

        const artistModels: ArtistModel[] = [];
        let alreadyAddedArtists: string[] = [];

        for (const artistData of artistDatas) {
            const artists: string[] = DataDelimiter.fromDelimitedString(artistData.artists);

            for (const artist of artists) {
                const processedArtist: string = artist.toLowerCase().trim();

                if (!alreadyAddedArtists.includes(processedArtist)) {
                    alreadyAddedArtists.push(processedArtist);
                    artistModels.push(new ArtistModel(artist, this.translatorService));
                }
            }
        }

        alreadyAddedArtists = [];

        return artistModels;
    }
}
