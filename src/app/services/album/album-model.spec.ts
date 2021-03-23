import { AlbumData } from '../../data/album-data';
import { AlbumModel } from './album-model';

describe('AlbumModel', () => {
    let albumData: AlbumData;
    let albumModel: AlbumModel;

    beforeEach(() => {
        albumData = new AlbumData();
        albumData.albumArtists = ';Album artist 1;;Album artist 2;';
        albumData.albumKey = 'my-album-key';
        albumData.albumTitle = 'Album title';
        albumData.artists = ';Artist 1;;Artist 2;';
        albumData.dateAdded = 123456789;
        albumData.dateFileCreated = 987654321;
        albumData.dateLastPlayed = 12369845;
        albumData.year = 2021;

        albumModel = new AlbumModel(albumData);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(albumModel).toBeDefined();
        });

        it('should declare but not define artworkPath', () => {
            // Arrange

            // Act

            // Assert
            expect(albumModel.artworkPath).toBeUndefined();
        });
    });

    describe('albumArtists', () => {
        it('should return the albumData albumArtists', () => {
            // Arrange
            const expectedAlbumArtists: string[] = ['Album artist 1', 'Album artist 2'];

            // Act
            const albumArtists: string[] = albumModel.albumArtists;

            // Assert
            expect(albumArtists).toEqual(expectedAlbumArtists);
        });
    });

    describe('albumKey', () => {
        it('should return the albumData albumKey', () => {
            // Arrange
            const expectedAlbumKey: string = 'my-album-key';

            // Act
            const albumKey: string = albumModel.albumKey;

            // Assert
            expect(albumKey).toEqual(expectedAlbumKey);
        });
    });

    describe('albumTitle', () => {
        it('should return the albumData albumTitle', () => {
            // Arrange
            const expectedAlbumTitle: string = 'Album title';

            // Act
            const albumTitle: string = albumModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual(expectedAlbumTitle);
        });
    });

    describe('artists', () => {
        it('should return the albumData artists', () => {
            // Arrange
            const expectedArtists: string[] = ['Artist 1', 'Artist 2'];

            // Act
            const artists: string[] = albumModel.artists;

            // Assert
            expect(artists).toEqual(expectedArtists);
        });
    });

    describe('dateAddedInTicks', () => {
        it('should return the albumData dateAdded', () => {
            // Arrange
            const expectedDateAddedInTicks: number = 123456789;

            // Act
            const dateAddedInTicks: number = albumModel.dateAddedInTicks;

            // Assert
            expect(dateAddedInTicks).toEqual(expectedDateAddedInTicks);
        });
    });

    describe('dateLastPlayedInTicks', () => {
        it('should return the albumData dateLastPlayed', () => {
            // Arrange
            const expectedDateLastPlayedInTicks: number = 12369845;

            // Act
            const dateLastPlayedInTicks: number = albumModel.dateLastPlayedInTicks;

            // Assert
            expect(dateLastPlayedInTicks).toEqual(expectedDateLastPlayedInTicks);
        });
    });

    describe('dateFileCreatedInTicks', () => {
        it('should return the albumData dateFileCreated', () => {
            // Arrange
            const expectedDateFileCreatedInTicks: number = 987654321;

            // Act
            const dateFileCreatedInTicks: number = albumModel.dateFileCreatedInTicks;

            // Assert
            expect(dateFileCreatedInTicks).toEqual(expectedDateFileCreatedInTicks);
        });
    });

    describe('year', () => {
        it('should return the albumData year', () => {
            // Arrange
            const expectedYear: number = 2021;

            // Act
            const year: number = albumModel.year;

            // Assert
            expect(year).toEqual(expectedYear);
        });
    });
});
