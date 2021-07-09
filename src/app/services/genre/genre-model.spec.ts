import { IMock, Mock } from 'typemoq';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { GenreModel } from './genre-model';

describe('GenreModel', () => {
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let genreModel: GenreModel;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        translatorServiceMock.setup((x) => x.get('unknown-genre')).returns(() => 'Unknown genre');
        genreModel = new GenreModel('My genre', translatorServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(genreModel).toBeDefined();
        });

        it('should define isSelected', () => {
            // Arrange

            // Act

            // Assert
            expect(genreModel.isSelected).toBeDefined();
        });

        it('should define showHeader', () => {
            // Arrange

            // Act

            // Assert
            expect(genreModel.showHeader).toBeDefined();
        });

        it('should define name', () => {
            // Arrange

            // Act

            // Assert
            expect(genreModel.name).toBeDefined();
        });

        it('should define sortableName', () => {
            // Arrange

            // Act

            // Assert
            expect(genreModel.sortableName).toBeDefined();
        });

        it('should define alphabeticalHeader', () => {
            // Arrange

            // Act

            // Assert
            expect(genreModel.alphabeticalHeader).toBeDefined();
        });
    });

    describe('name', () => {
        it('should return "Unknown genre" if genre is undefined', () => {
            // Arrange
            const genre: string = undefined;
            genreModel = new GenreModel(genre, translatorServiceMock.object);

            // Act
            const name: string = genreModel.name;

            // Assert
            expect(name).toEqual('Unknown genre');
        });

        it('should return "Unknown genre" if genre is empty', () => {
            // Arrange
            const genre: string = '';
            genreModel = new GenreModel(genre, translatorServiceMock.object);

            // Act
            const name: string = genreModel.name;

            // Assert
            expect(name).toEqual('Unknown genre');
        });

        it('should return "Unknown genre" if genre is space', () => {
            // Arrange
            const genre: string = ' ';
            genreModel = new GenreModel(genre, translatorServiceMock.object);

            // Act
            const name: string = genreModel.name;

            // Assert
            expect(name).toEqual('Unknown genre');
        });

        it('should return the genre name if genre is not undefined, empty or space.', () => {
            // Arrange
            const genre: string = 'My genre';
            genreModel = new GenreModel(genre, translatorServiceMock.object);

            // Act
            const name: string = genreModel.name;

            // Assert
            expect(name).toEqual('My genre');
        });
    });

    describe('sortableName', () => {
        it('should return a sortable name', () => {
            // Arrange
            const genre: string = 'The Genre';
            genreModel = new GenreModel(genre, translatorServiceMock.object);

            // Act
            const sortableName: string = genreModel.sortableName;

            // Assert
            expect(sortableName).toEqual('genre');
        });
    });

    describe('alphabeticalHeader', () => {
        it('should return an alphabetical header containing a letter if the first letter is known as alphabetical header', () => {
            // Arrange
            const genre: string = 'The Genre';
            genreModel = new GenreModel(genre, translatorServiceMock.object);

            // Act
            const alphabeticalHeader: string = genreModel.alphabeticalHeader;

            // Assert
            expect(alphabeticalHeader).toEqual('g');
        });

        it('should return an alphabetical header containing a letter if the first letter is not known as alphabetical header', () => {
            // Arrange
            const genre: string = '1 Genre';
            genreModel = new GenreModel(genre, translatorServiceMock.object);

            // Act
            const alphabeticalHeader: string = genreModel.alphabeticalHeader;

            // Assert
            expect(alphabeticalHeader).toEqual('#');
        });
    });
});
