import { IMock, Mock } from 'typemoq';
import { AlbumData } from '../../common/data/entities/album-data';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { AlbumModel } from './album-model';

describe('AlbumModel', () => {
    let albumData: AlbumData;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let fileAccessMock: IMock<BaseFileAccess>;
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

        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        fileAccessMock = Mock.ofType<BaseFileAccess>();

        translatorServiceMock.setup((x) => x.get('unknown-artist')).returns(() => 'Unknown artist');
        translatorServiceMock.setup((x) => x.get('unknown-title')).returns(() => 'Unknown title');
        albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(albumModel).toBeDefined();
        });

        it('should define artworkPath', () => {
            // Arrange

            // Act

            // Assert
            expect(albumModel.artworkPath).toBeDefined();
        });

        it('should initialize isSelected as false', () => {
            // Arrange

            // Act

            // Assert
            expect(albumModel.isSelected).toBeFalsy();
        });
    });

    describe('artworkPath', () => {
        it('should return empty Gif if albumData.artworkId is undefined', () => {
            // Arrange
            albumData.artworkId = undefined;
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

            // Act
            const artworkPath: string = albumModel.artworkPath;

            // Assert
            expect(artworkPath).toEqual('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
        });

        it('should return empty Gif if albumData.artworkId is empty', () => {
            // Arrange
            albumData.artworkId = '';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

            // Act
            const artworkPath: string = albumModel.artworkPath;

            // Assert
            expect(artworkPath).toEqual('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
        });

        it('should return empty gif if albumData.artworkId is space', () => {
            // Arrange
            albumData.artworkId = ' ';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

            // Act
            const artworkPath: string = albumModel.artworkPath;

            // Assert
            expect(artworkPath).toEqual('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
        });

        it('should return full artwork path if albumData.artworkId is not undefined, empty or space.', () => {
            // Arrange
            albumData.artworkId = 'dummy';
            fileAccessMock.setup((x) => x.coverArtFullPath('dummy')).returns(() => '/root/directory/dummy');
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

            // Act
            const artworkPath: string = albumModel.artworkPath;

            // Assert
            expect(artworkPath).toEqual('file:////root/directory/dummy');
        });
    });

    describe('albumArtist', () => {
        it('should return "Unknown artist" if albumData albumArtists and artists are undefined', () => {
            // Arrange
            const expectedAlbumArtist: string = 'Unknown artist';

            albumData.albumArtists = undefined;
            albumData.artists = undefined;
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

            // Act
            const albumArtist: string = albumModel.albumArtist;

            // Assert
            expect(albumArtist).toEqual(expectedAlbumArtist);
        });

        it('should return "Unknown artist" if albumData albumArtists and artists are empty', () => {
            // Arrange
            const expectedAlbumArtist: string = 'Unknown artist';

            albumData.albumArtists = '';
            albumData.artists = '';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

            // Act
            const albumArtist: string = albumModel.albumArtist;

            // Assert
            expect(albumArtist).toEqual(expectedAlbumArtist);
        });

        it('should return "Unknown artist" if albumData albumArtists is undefined and artists is empty', () => {
            // Arrange
            const expectedAlbumArtist: string = 'Unknown artist';

            albumData.albumArtists = undefined;
            albumData.artists = '';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

            // Act
            const albumArtist: string = albumModel.albumArtist;

            // Assert
            expect(albumArtist).toEqual(expectedAlbumArtist);
        });

        it('should return "Unknown artist" if albumData albumArtists is empty and artists is undefined', () => {
            // Arrange
            const expectedAlbumArtist: string = 'Unknown artist';

            albumData.albumArtists = '';
            albumData.artists = undefined;
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

            // Act
            const albumArtist: string = albumModel.albumArtist;

            // Assert
            expect(albumArtist).toEqual(expectedAlbumArtist);
        });

        it('should return the first album artist if albumData albumArtists is not undefined and not empty, and artists is undefined.', () => {
            // Arrange
            const expectedAlbumArtist: string = 'Album artist 1';

            albumData.albumArtists = ';Album artist 1;;Album artist 2;';
            albumData.artists = undefined;
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

            // Act
            const albumArtist: string = albumModel.albumArtist;

            // Assert
            expect(albumArtist).toEqual(expectedAlbumArtist);
        });

        it('should return the first album artist if albumData albumArtists is not undefined and not empty, and artists is empty.', () => {
            // Arrange
            const expectedAlbumArtist: string = 'Album artist 1';

            albumData.albumArtists = ';Album artist 1;;Album artist 2;';
            albumData.artists = '';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

            // Act
            const albumArtist: string = albumModel.albumArtist;

            // Assert
            expect(albumArtist).toEqual(expectedAlbumArtist);
        });

        it('should return the first album artist if album albumArtists is not undefined and not empty, and artists is not undefined and not empty.', () => {
            // Arrange
            const expectedAlbumArtist: string = 'Album artist 1';

            albumData.albumArtists = ';Album artist 1;;Album artist 2;';
            albumData.artists = ';Artist 1;;Artist 2;';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

            // Act
            const albumArtist: string = albumModel.albumArtist;

            // Assert
            expect(albumArtist).toEqual(expectedAlbumArtist);
        });

        it('should return the first artist if album albumArtists is undefined, and artists is not undefined and not empty.', () => {
            // Arrange
            const expectedAlbumArtist: string = 'Artist 1';

            albumData.albumArtists = undefined;
            albumData.artists = ';Artist 1;;Artist 2;';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

            // Act
            const albumArtist: string = albumModel.albumArtist;

            // Assert
            expect(albumArtist).toEqual(expectedAlbumArtist);
        });

        it('should return the first artist if album albumArtists is empty, and artists is not undefined and not empty.', () => {
            // Arrange
            const expectedAlbumArtist: string = 'Artist 1';

            albumData.albumArtists = '';
            albumData.artists = ';Artist 1;;Artist 2;';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

            // Act
            const albumArtist: string = albumModel.albumArtist;

            // Assert
            expect(albumArtist).toEqual(expectedAlbumArtist);
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
        it('should return "Unknown title" if albumData albumTitle is undefined', () => {
            // Arrange
            const expectedAlbumTitle: string = 'Unknown title';

            albumData.albumTitle = undefined;
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

            // Act
            const albumTitle: string = albumModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual(expectedAlbumTitle);
        });

        it('should return "Unknown title" if albumData albumTitle is empty', () => {
            // Arrange
            const expectedAlbumTitle: string = 'Unknown title';

            albumData.albumTitle = '';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

            // Act
            const albumTitle: string = albumModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual(expectedAlbumTitle);
        });

        it('should return "Unknown title" if albumData albumTitle is white space', () => {
            // Arrange
            const expectedAlbumTitle: string = 'Unknown title';

            albumData.albumTitle = ' ';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

            // Act
            const albumTitle: string = albumModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual(expectedAlbumTitle);
        });

        it('should return albumData albumTitle if albumData albumTitle is not undefined, empty or white space.', () => {
            // Arrange
            const expectedAlbumTitle: string = 'Album title';

            albumData.albumTitle = 'Album title';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, fileAccessMock.object);

            // Act
            const albumTitle: string = albumModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual(expectedAlbumTitle);
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
