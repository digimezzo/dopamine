import { IMock, Mock } from 'typemoq';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { ArtistModel } from './artist-model';

describe('ArtistModel', () => {
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let artistModel: ArtistModel;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        translatorServiceMock.setup((x) => x.get('Artist.UnknownArtist')).returns(() => 'Unknown artist');
        artistModel = new ArtistModel('My artist', translatorServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(artistModel).toBeDefined();
        });

        it('should define isSelected', () => {
            // Arrange

            // Act

            // Assert
            expect(artistModel.isSelected).toBeDefined();
        });

        it('should define showHeader', () => {
            // Arrange

            // Act

            // Assert
            expect(artistModel.showHeader).toBeDefined();
        });

        it('should define name', () => {
            // Arrange

            // Act

            // Assert
            expect(artistModel.name).toBeDefined();
        });

        it('should define sortableName', () => {
            // Arrange

            // Act

            // Assert
            expect(artistModel.sortableName).toBeDefined();
        });

        it('should define alphabeticalHeader', () => {
            // Arrange

            // Act

            // Assert
            expect(artistModel.alphabeticalHeader).toBeDefined();
        });
    });

    describe('name', () => {
        it('should return "Unknown artist" if artist is undefined', () => {
            // Arrange
            const artist: string = undefined;
            artistModel = new ArtistModel(artist, translatorServiceMock.object);

            // Act
            const name: string = artistModel.name;

            // Assert
            expect(name).toEqual('Unknown artist');
        });

        it('should return "Unknown artist" if artist is empty', () => {
            // Arrange
            const artist: string = '';
            artistModel = new ArtistModel(artist, translatorServiceMock.object);

            // Act
            const name: string = artistModel.name;

            // Assert
            expect(name).toEqual('Unknown artist');
        });

        it('should return "Unknown artist" if artist is space', () => {
            // Arrange
            const artist: string = ' ';
            artistModel = new ArtistModel(artist, translatorServiceMock.object);

            // Act
            const name: string = artistModel.name;

            // Assert
            expect(name).toEqual('Unknown artist');
        });

        it('should return the atrist name if artist is not undefined, empty or space.', () => {
            // Arrange
            const artist: string = 'My artist';
            artistModel = new ArtistModel(artist, translatorServiceMock.object);

            // Act
            const name: string = artistModel.name;

            // Assert
            expect(name).toEqual('My artist');
        });
    });

    describe('sortableName', () => {
        it('should return a sortable name', () => {
            // Arrange
            const artist: string = 'The Artist';
            artistModel = new ArtistModel(artist, translatorServiceMock.object);

            // Act
            const sortableName: string = artistModel.sortableName;

            // Assert
            expect(sortableName).toEqual('artist');
        });
    });

    describe('alphabeticalHeader', () => {
        it('should return an alphabetical header containing a letter if the first letter is known as alphabetical header', () => {
            // Arrange
            const artist: string = 'The Artist';
            artistModel = new ArtistModel(artist, translatorServiceMock.object);

            // Act
            const alphabeticalHeader: string = artistModel.alphabeticalHeader;

            // Assert
            expect(alphabeticalHeader).toEqual('a');
        });

        it('should return an alphabetical header containing a letter if the first letter is not known as alphabetical header', () => {
            // Arrange
            const artist: string = '1 Artist';
            artistModel = new ArtistModel(artist, translatorServiceMock.object);

            // Act
            const alphabeticalHeader: string = artistModel.alphabeticalHeader;

            // Assert
            expect(alphabeticalHeader).toEqual('#');
        });
    });
});
