import { GenreModel } from './genre-model';

export abstract class GenreServiceBase {
    public abstract getGenresAsync(): Promise<GenreModel[]>;
}
