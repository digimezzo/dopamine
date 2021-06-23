import { IMock, Mock } from 'typemoq';
import { AlbumData } from '../../common/data/entities/album-data';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { BaseAlbumArtworkCacheService } from '../album-artwork-cache/base-album-artwork-cache.service';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { AlbumModel } from './album-model';
import { AlbumService } from './album-service';

describe('AlbumService', () => {
    let trackRepositoryMock: IMock<BaseTrackRepository>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService>;
    let service: AlbumService;

    beforeEach(() => {
        trackRepositoryMock = Mock.ofType<BaseTrackRepository>();
        albumArtworkCacheServiceMock = Mock.ofType<BaseAlbumArtworkCacheService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        service = new AlbumService(trackRepositoryMock.object, translatorServiceMock.object, albumArtworkCacheServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('getAllAlbums', () => {
        it('should return an empty collection if no albumData is found in the database', () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAllAlbumData()).returns(() => undefined);

            // Act
            const albums: AlbumModel[] = service.getAllAlbums();

            // Assert
            expect(albums.length).toEqual(0);
        });

        it('should return albums with artwork if albumData is found in the database and artwork is found', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumTitle = 'Album title 1';
            albumData1.albumKey = 'Album key 1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumTitle = 'Album title 2';
            albumData2.albumKey = 'Album key 2';

            trackRepositoryMock.setup((x) => x.getAllAlbumData()).returns(() => [albumData1, albumData2]);
            albumArtworkCacheServiceMock.setup((x) => x.getCachedArtworkFilePathAsync('Album key 1')).returns(() => 'Path 1');
            albumArtworkCacheServiceMock.setup((x) => x.getCachedArtworkFilePathAsync('Album key 2')).returns(() => 'Path 2');

            // Act
            const albums: AlbumModel[] = service.getAllAlbums();

            // Assert
            expect(albums.length).toEqual(2);
            expect(albums[0].albumTitle).toEqual('Album title 1');
            expect(albums[0].artworkPath).toEqual('Path 1');
            expect(albums[1].albumTitle).toEqual('Album title 2');
            expect(albums[1].artworkPath).toEqual('Path 2');
        });

        it('should return albums without artwork if albumData is found in the database but no artwork is found', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumTitle = 'Album title 1';
            albumData1.albumKey = 'Album key 1';

            const albumData2: AlbumData = new AlbumData();
            albumData2.albumTitle = 'Album title 2';
            albumData2.albumKey = 'Album key 2';

            trackRepositoryMock.setup((x) => x.getAllAlbumData()).returns(() => [albumData1, albumData2]);
            albumArtworkCacheServiceMock.setup((x) => x.getCachedArtworkFilePathAsync('Album key 1')).returns(() => '');
            albumArtworkCacheServiceMock.setup((x) => x.getCachedArtworkFilePathAsync('Album key 2')).returns(() => '');

            // Act
            const albums: AlbumModel[] = service.getAllAlbums();

            // Assert
            expect(albums.length).toEqual(2);
            expect(albums[0].albumTitle).toEqual('Album title 1');
            expect(albums[0].artworkPath).toEqual('');
            expect(albums[1].albumTitle).toEqual('Album title 2');
            expect(albums[1].artworkPath).toEqual('');
        });
    });
});
