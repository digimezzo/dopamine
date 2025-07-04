import { Injectable } from '@angular/core';
import { DataDelimiter } from '../../data/data-delimiter';
import { GenreData } from '../../data/entities/genre-data';
import { GenreModel } from './genre-model';
import { GenreServiceBase } from './genre.service.base';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { Timer } from '../../common/scheduling/timer';
import { Logger } from '../../common/logger';

@Injectable()
export class GenreService implements GenreServiceBase {
    public constructor(
        private translatorService: TranslatorServiceBase,
        private trackRepository: TrackRepositoryBase,
        private logger: Logger,
    ) {}

    public getGenres(): GenreModel[] {
        const timer = new Timer();
        timer.start();

        const addedGenres: string[] = [];
        const genreDatas: GenreData[] = this.trackRepository.getGenreData() ?? [];
        const genreModels: GenreModel[] = [];

        for (const genreData of genreDatas) {
            const genres: string[] = DataDelimiter.fromDelimitedString(genreData.genres);

            for (const genre of genres) {
                const processedGenre: string = genre.toLowerCase().trim();

                if (!addedGenres.includes(processedGenre)) {
                    addedGenres.push(processedGenre);
                    genreModels.push(new GenreModel(genre, this.translatorService));
                }
            }
        }

        timer.stop();

        this.logger.info(`Finished getting genres. Time required: ${timer.elapsedMilliseconds} ms`, 'GenreService', 'getGenres');

        return genreModels;
    }
}
