import { Injectable } from '@angular/core';
import { DataDelimiter } from '../../common/data/data-delimiter';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { BaseGenreService } from './base-genre.service';
import { GenreModel } from './genre-model';

@Injectable()
export class GenreService implements BaseGenreService {
    constructor(private trackRepository: BaseTrackRepository) {}

    public getGenres(): GenreModel[] {
        const rawGenres: string[] = this.trackRepository.getGenres();
        const genres: string[] = rawGenres.flatMap((x) => DataDelimiter.fromDelimitedString(x));
        const genreModels: GenreModel[] = [];

        for (const genre of genres) {
            genreModels.push(new GenreModel(genre));
        }

        return genreModels;
    }
}
