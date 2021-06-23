import { Injectable } from '@angular/core';
import { DataDelimiter } from '../../common/data/data-delimiter';
import { GenreData } from '../../common/data/entities/genre-data';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseGenreService } from './base-genre.service';
import { GenreModel } from './genre-model';

@Injectable()
export class GenreService implements BaseGenreService {
    constructor(private translatorService: BaseTranslatorService, private trackRepository: BaseTrackRepository) {}

    public getGenres(): GenreModel[] {
        const genreData: GenreData[] = this.trackRepository.getGenreData();
        const genreModels: GenreModel[] = [];

        for (const genreDataItem of genreData) {
            const genres: string[] = DataDelimiter.fromDelimitedString(genreDataItem.genres);

            for (const genre of genres) {
                genreModels.push(new GenreModel(genre, this.translatorService));
            }
        }

        return genreModels;
    }
}
