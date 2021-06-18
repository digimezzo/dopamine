import { Injectable } from '@angular/core';
import { TrackRepository } from '../../common/data/repositories/track-repository';
import { BaseGenreService } from './base-genre.service';
import { GenreModel } from './genre-model';

@Injectable()
export class GenreService implements BaseGenreService {
    constructor(private trackRepository: TrackRepository) {}

    public getGenres(): GenreModel[] {
        const genres: string[] = this.trackRepository.getGenres();

        return undefined;
    }
}
