import { IMock, It, Mock, Times } from 'typemoq';
import { AlbumModel } from './album-model';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { AlbumData } from '../../data/entities/album-data';
import { ApplicationPaths } from '../../common/application/application-paths';

describe('AlbumModel', () => {
    let albumData: AlbumData;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let applicationPathsMock: IMock<ApplicationPaths>;
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
        albumData.genres = ';Foo;;Bar/Baz;';

        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        applicationPathsMock = Mock.ofType<ApplicationPaths>();

        translatorServiceMock.setup((x) => x.get('unknown-artist')).returns(() => 'Unknown artist');
        translatorServiceMock.setup((x) => x.get('unknown-title')).returns(() => 'Unknown title');
        translatorServiceMock.setup((x) => x.get('unknown-genre')).returns(() => 'Unknown genre');
        albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);
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
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

            // Act
            const artworkPath: string = albumModel.artworkPath;

            // Assert
            expect(artworkPath).toEqual('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
        });

        it('should return empty Gif if albumData.artworkId is empty', () => {
            // Arrange
            albumData.artworkId = '';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

            // Act
            const artworkPath: string = albumModel.artworkPath;

            // Assert
            expect(artworkPath).toEqual('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
        });

        it('should return empty gif if albumData.artworkId is space', () => {
            // Arrange
            albumData.artworkId = ' ';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

            // Act
            const artworkPath: string = albumModel.artworkPath;

            // Assert
            expect(artworkPath).toEqual('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
        });

        it('should return full artwork path if albumData.artworkId is not undefined, empty or space.', () => {
            // Arrange
            albumData.artworkId = 'dummy';
            applicationPathsMock.setup((x) => x.coverArtFullPath('dummy')).returns(() => '/root/directory/dummy');
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

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
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

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
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

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
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

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
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

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
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

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
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

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
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

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
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

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
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

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
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

            // Act
            const albumTitle: string = albumModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual(expectedAlbumTitle);
        });

        it('should return "Unknown title" if albumData albumTitle is empty', () => {
            // Arrange
            const expectedAlbumTitle: string = 'Unknown title';

            albumData.albumTitle = '';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

            // Act
            const albumTitle: string = albumModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual(expectedAlbumTitle);
        });

        it('should return "Unknown title" if albumData albumTitle is white space', () => {
            // Arrange
            const expectedAlbumTitle: string = 'Unknown title';

            albumData.albumTitle = ' ';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

            // Act
            const albumTitle: string = albumModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual(expectedAlbumTitle);
        });

        it('should return albumData albumTitle if albumData albumTitle is not undefined, empty or white space.', () => {
            // Arrange
            const expectedAlbumTitle: string = 'Album title';

            albumData.albumTitle = 'Album title';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

            // Act
            const albumTitle: string = albumModel.albumTitle;

            // Assert
            expect(albumTitle).toEqual(expectedAlbumTitle);
        });
    });

    describe('genres', () => {
        it('should return "Unknown genre" if albumData genres is undefined', () => {
            // Arrange
            albumData.genres = undefined;
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

            // Act
            const genres: string[] = albumModel.genres;

            // Assert
            expect(genres).toEqual(['Unknown genre']);
            translatorServiceMock.verify((x) => x.get('unknown-genre'), Times.once());
        });

        it('should return "Unknown genre" if albumData genres is empty', () => {
            // Arrange
            albumData.genres = '';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

            // Act
            const genres: string[] = albumModel.genres;

            // Assert
            expect(genres).toEqual(['Unknown genre']);
            translatorServiceMock.verify((x) => x.get('unknown-genre'), Times.once());
        });

        it('should return "Unknown genre" if albumData genres is white space', () => {
            // Arrange
            albumData.genres = ' ';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

            // Act
            const genres: string[] = albumModel.genres;

            // Assert
            expect(genres).toEqual(['Unknown genre']);
            translatorServiceMock.verify((x) => x.get('unknown-genre'), Times.once());
        });

        it('should return albumData genres when there is one genre', () => {
            // Arrange
            albumData.genres = ';Foo;';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

            // Act
            const genres: string[] = albumModel.genres;

            // Assert
            expect(genres).toEqual(['Foo']);
            translatorServiceMock.verify((x) => x.get(It.isAny()), Times.never());
        });

        it('should return albumData genres when there are several genres', () => {
            // Arrange
            albumData.genres = ';Foo;;Bar/Baz;';
            albumModel = new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);

            // Act
            const genres: string[] = albumModel.genres;

            // Assert
            expect(genres).toEqual(['Foo', 'Bar/Baz']);
            translatorServiceMock.verify((x) => x.get(It.isAny()), Times.never());
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
