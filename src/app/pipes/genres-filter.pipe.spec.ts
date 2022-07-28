import { IMock, It, Mock } from 'typemoq';
import { GenreModel } from '../services/genre/genre-model';
import { BaseSearchService } from '../services/search/base-search.service';
import { BaseTranslatorService } from '../services/translator/base-translator.service';
import { GenresFilterPipe } from './genres-filter.pipe';

describe('GenresFilterPipe', () => {
    let searchServiceMock: IMock<BaseSearchService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    function createPipe(): GenresFilterPipe {
        return new GenresFilterPipe(searchServiceMock.object);
    }

    function createGenres(): GenreModel[] {
        const genre1: GenreModel = new GenreModel('genre1', translatorServiceMock.object);
        const genre2: GenreModel = new GenreModel('genre2', translatorServiceMock.object);

        return [genre1, genre2];
    }

    beforeEach(() => {
        searchServiceMock = Mock.ofType<BaseSearchService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
    });

    describe('transform', () => {
        it('should return the given genres if textToContain is undefined', () => {
            // Arrange
            const genres: GenreModel[] = createGenres();
            const pipe: GenresFilterPipe = createPipe();

            // Act
            const filteredGenres: GenreModel[] = pipe.transform(genres, undefined);

            // Assert
            expect(filteredGenres).toEqual(genres);
        });

        it('should return the given genres if textToContain is empty', () => {
            // Arrange
            const genres: GenreModel[] = createGenres();
            const pipe: GenresFilterPipe = createPipe();

            // Act
            const filteredGenres: GenreModel[] = pipe.transform(genres, '');

            // Assert
            expect(filteredGenres).toEqual(genres);
        });

        it('should return the given genres if textToContain is space', () => {
            // Arrange
            const genres: GenreModel[] = createGenres();
            const pipe: GenresFilterPipe = createPipe();

            // Act
            const filteredGenres: GenreModel[] = pipe.transform(genres, ' ');

            // Assert
            expect(filteredGenres).toEqual(genres);
        });

        it('should return only genres with a name containing the search text', () => {
            // Arrange

            const genres: GenreModel[] = createGenres();
            searchServiceMock.setup((x) => x.matchesSearchText('genre1', It.isAny())).returns(() => true);
            searchServiceMock.setup((x) => x.matchesSearchText('genre2', It.isAny())).returns(() => false);
            const pipe: GenresFilterPipe = createPipe();

            // Act
            const filteredGenres: GenreModel[] = pipe.transform(genres, 'dummy');

            // Assert
            expect(filteredGenres.length).toEqual(1);
            expect(filteredGenres[0]).toEqual(genres[0]);
        });

        it('should return no artists if none of their names contain the search text', () => {
            // Arrange

            const genres: GenreModel[] = createGenres();
            searchServiceMock.setup((x) => x.matchesSearchText('genre1', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('genre2', It.isAny())).returns(() => false);
            const pipe: GenresFilterPipe = createPipe();

            // Act
            const filteredGenres: GenreModel[] = pipe.transform(genres, 'dummy');

            // Assert
            expect(filteredGenres.length).toEqual(0);
        });
    });
});
