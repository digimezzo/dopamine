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

        it('should define isZoomHeader as false', () => {
            // Arrange

            // Act

            // Assert
            expect(artistModel.isZoomHeader).toBeFalsy();
        });

        it('should define name', () => {
            // Arrange

            // Act

            // Assert
            expect(artistModel.displayName).toBeDefined();
        });

        it('should define sortableName', () => {
            // Arrange

            // Act

            // Assert
            expect(artistModel.sortableName).toBeDefined();
        });

        it('should define header', () => {
            // Arrange

            // Act

            // Assert
            expect(artistModel.zoomHeader).toBeDefined();
        });
    });

    describe('name', () => {
        it('should return "Unknown artist" if artist is undefined', () => {
            // Arrange
            const artist: string = undefined;
            artistModel = new ArtistModel(artist, translatorServiceMock.object);

            // Act
            const name: string = artistModel.displayName;

            // Assert
            expect(name).toEqual('Unknown artist');
        });

        it('should return "Unknown artist" if artist is empty', () => {
            // Arrange
            const artist: string = '';
            artistModel = new ArtistModel(artist, translatorServiceMock.object);

            // Act
            const name: string = artistModel.displayName;

            // Assert
            expect(name).toEqual('Unknown artist');
        });

        it('should return "Unknown artist" if artist is space', () => {
            // Arrange
            const artist: string = ' ';
            artistModel = new ArtistModel(artist, translatorServiceMock.object);

            // Act
            const name: string = artistModel.displayName;

            // Assert
            expect(name).toEqual('Unknown artist');
        });

        it('should return the atrist name if artist is not undefined, empty or space.', () => {
            // Arrange
            const artist: string = 'My artist';
            artistModel = new ArtistModel(artist, translatorServiceMock.object);

            // Act
            const name: string = artistModel.displayName;

            // Assert
            expect(name).toEqual('My artist');
        });
    });
});
