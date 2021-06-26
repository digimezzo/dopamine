import { Injectable } from '@angular/core';
import { DataDelimiter } from '../../common/data/data-delimiter';
import { ArtistData } from '../../common/data/entities/artist-data';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { ArtistModel } from './artist-model';
import { BaseArtistService } from './base-artist.service';

@Injectable()
export class ArtistService implements BaseArtistService {
    constructor(private translatorService: BaseTranslatorService, private trackRepository: BaseTrackRepository) {}

    public getArtists(): ArtistModel[] {
        const artistDatas: ArtistData[] = this.trackRepository.getArtistData();
        const artistModels: ArtistModel[] = [];

        for (const artistData of artistDatas) {
            const artists: string[] = DataDelimiter.fromDelimitedString(artistData.artists);

            for (const artist of artists) {
                artistModels.push(new ArtistModel(artist, this.translatorService));
            }
        }

        return artistModels;
    }
}
