import { GenreModel } from './genre-model';

export abstract class BaseGenreService {
    public abstract getGenres(): GenreModel[];
}
