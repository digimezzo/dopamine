import { IMock, Mock } from 'typemoq';
import { GenreModel } from '../services/genre/genre-model';
import { BaseTranslatorService } from '../services/translator/base-translator.service';
import { GenreOrdering } from './genre-ordering';

describe('GenreOrdering', () => {
    let genreModel1: GenreModel;
    let genreModel2: GenreModel;
    let genreModel3: GenreModel;
    let genreModel4: GenreModel;

    let translatorServiceMock: IMock<BaseTranslatorService>;

    let genreOrdering: GenreOrdering;
    let genres: GenreModel[];

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        genreModel1 = new GenreModel('Genre1', translatorServiceMock.object);
        genreModel2 = new GenreModel('Genre2', translatorServiceMock.object);
        genreModel3 = new GenreModel('Genre3', translatorServiceMock.object);
        genreModel4 = new GenreModel('Genre4', translatorServiceMock.object);

        genres = [genreModel2, genreModel4, genreModel1, genreModel3];

        genreOrdering = new GenreOrdering();
    });

    describe('getTracksOrderedByTitleAscending', () => {
        it('should order tracks by title ascending', () => {
            // Arrange

            // Act
            const orderedGenres: GenreModel[] = genreOrdering.getGenresOrderedAscending(genres);

            // Assert
            expect(orderedGenres[0]).toBe(genreModel1);
            expect(orderedGenres[1]).toBe(genreModel2);
            expect(orderedGenres[2]).toBe(genreModel3);
            expect(orderedGenres[3]).toBe(genreModel4);
        });
    });

    describe('getTracksOrderedByTitleDescending', () => {
        it('should order tracks by title descending', () => {
            // Arrange

            // Act
            const orderedGenres: GenreModel[] = genreOrdering.getGenresOrderedDescending(genres);

            // Assert
            expect(orderedGenres[0]).toBe(genreModel4);
            expect(orderedGenres[1]).toBe(genreModel3);
            expect(orderedGenres[2]).toBe(genreModel2);
            expect(orderedGenres[3]).toBe(genreModel1);
        });
    });
});
