import { IMock, Mock } from 'typemoq';
import { GenreModel } from '../../services/genre/genre-model';
import { TranslatorServiceBase } from '../../services/translator/translator.service.base';
import { GenreSorter } from './genre-sorter';

describe('GenreSorter', () => {
    let genreModel1: GenreModel;
    let genreModel2: GenreModel;
    let genreModel3: GenreModel;
    let genreModel4: GenreModel;
    let genreModel5: GenreModel;
    let genreModel6: GenreModel;
    let genreModel7: GenreModel;
    let genreModel8: GenreModel;
    let genreModel9: GenreModel;
    let genreModel10: GenreModel;

    let translatorServiceMock: IMock<TranslatorServiceBase>;

    let genreSorter: GenreSorter;
    let genres: GenreModel[];

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();

        genreModel1 = new GenreModel('Genre1', translatorServiceMock.object);
        genreModel2 = new GenreModel('Genre2', translatorServiceMock.object);
        genreModel3 = new GenreModel('Genre3', translatorServiceMock.object);
        genreModel4 = new GenreModel('Genre4', translatorServiceMock.object);
        genreModel5 = new GenreModel('Genre5', translatorServiceMock.object);
        genreModel6 = new GenreModel('Genre6', translatorServiceMock.object);
        genreModel7 = new GenreModel('Genre7', translatorServiceMock.object);
        genreModel8 = new GenreModel('Genre8', translatorServiceMock.object);
        genreModel9 = new GenreModel('Genre9', translatorServiceMock.object);
        genreModel10 = new GenreModel('Genre10', translatorServiceMock.object);

        genres = [
            genreModel2,
            genreModel10,
            genreModel6,
            genreModel4,
            genreModel9,
            genreModel8,
            genreModel1,
            genreModel7,
            genreModel5,
            genreModel3,
        ];

        genreSorter = new GenreSorter();
    });

    describe('sortAscending', () => {
        it('should return an empty collection if undefined is provided', () => {
            // Arrange

            // Act
            const sortedGenres: GenreModel[] = genreSorter.sortAscending(undefined);

            // Assert
            expect(sortedGenres.length).toEqual(0);
        });

        it('should return an empty collection if empty is provided', () => {
            // Arrange

            // Act
            const sortedGenres: GenreModel[] = genreSorter.sortAscending([]);

            // Assert
            expect(sortedGenres.length).toEqual(0);
        });

        it('should sort ascending', () => {
            // Arrange

            // Act
            const sortedGenres: GenreModel[] = genreSorter.sortAscending(genres);

            // Assert
            expect(sortedGenres[0]).toBe(genreModel1);
            expect(sortedGenres[1]).toBe(genreModel2);
            expect(sortedGenres[2]).toBe(genreModel3);
            expect(sortedGenres[3]).toBe(genreModel4);
            expect(sortedGenres[4]).toBe(genreModel5);
            expect(sortedGenres[5]).toBe(genreModel6);
            expect(sortedGenres[6]).toBe(genreModel7);
            expect(sortedGenres[7]).toBe(genreModel8);
            expect(sortedGenres[8]).toBe(genreModel9);
            expect(sortedGenres[9]).toBe(genreModel10);
        });
    });

    describe('sortDescending', () => {
        it('should return an empty collection if undefined is provided', () => {
            // Arrange

            // Act
            const sortedGenres: GenreModel[] = genreSorter.sortDescending(undefined);

            // Assert
            expect(sortedGenres.length).toEqual(0);
        });

        it('should return an empty collection if empty is provided', () => {
            // Arrange

            // Act
            const sortedGenres: GenreModel[] = genreSorter.sortDescending([]);

            // Assert
            expect(sortedGenres.length).toEqual(0);
        });

        it('should sort descending', () => {
            // Arrange

            // Act
            const sortedGenres: GenreModel[] = genreSorter.sortDescending(genres);

            // Assert
            expect(sortedGenres[0]).toBe(genreModel10);
            expect(sortedGenres[1]).toBe(genreModel9);
            expect(sortedGenres[2]).toBe(genreModel8);
            expect(sortedGenres[3]).toBe(genreModel7);
            expect(sortedGenres[4]).toBe(genreModel6);
            expect(sortedGenres[5]).toBe(genreModel5);
            expect(sortedGenres[6]).toBe(genreModel4);
            expect(sortedGenres[7]).toBe(genreModel3);
            expect(sortedGenres[8]).toBe(genreModel2);
            expect(sortedGenres[9]).toBe(genreModel1);
        });
    });
});
