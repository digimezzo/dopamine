import { IMock, Mock, Times } from 'typemoq';
import { AlbumData } from '../../common/data/entities/album-data';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { BaseAlbumArtworkCacheService } from '../album-artwork-cache/base-album-artwork-cache.service';
import { ArtistType } from '../artist/artist-type';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { AlbumModel } from './album-model';
import { AlbumService } from './album-service';

describe('AlbumService', () => {
    let trackRepositoryMock: IMock<BaseTrackRepository>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let fileAccessMock: IMock<BaseFileAccess>;
    let albumArtworkCacheServiceMock: IMock<BaseAlbumArtworkCacheService>;
    let service: AlbumService;

    beforeEach(() => {
        trackRepositoryMock = Mock.ofType<BaseTrackRepository>();
        albumArtworkCacheServiceMock = Mock.ofType<BaseAlbumArtworkCacheService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        fileAccessMock = Mock.ofType<BaseFileAccess>();
        service = new AlbumService(trackRepositoryMock.object, translatorServiceMock.object, fileAccessMock.object);
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

        it('should return all albums if albumData is found in the database', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'Album key 1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'Album key 2';
            const albumDatas: AlbumData[] = [albumData1, albumData2];

            trackRepositoryMock.setup((x) => x.getAllAlbumData()).returns(() => albumDatas);

            // Act
            const returnedAlbums: AlbumModel[] = service.getAllAlbums();

            // Assert
            trackRepositoryMock.verify((x) => x.getAllAlbumData(), Times.exactly(1));
            expect(returnedAlbums.length).toEqual(2);
            expect(returnedAlbums[0].albumKey).toEqual('Album key 1');
            expect(returnedAlbums[1].albumKey).toEqual('Album key 2');
        });
    });

    describe('getAlbumsForArtists', () => {
        it('should return albums for track artists if albumData is found in the database', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'Album key 1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'Album key 2';
            const albumDatas: AlbumData[] = [albumData1, albumData2];

            trackRepositoryMock.setup((x) => x.getAlbumDataForTrackArtists(['Artist 1', 'Artist 2'])).returns(() => albumDatas);

            // Act
            const returnedAlbums: AlbumModel[] = service.getAlbumsForArtists(['Artist 1', 'Artist 2'], ArtistType.trackArtists);

            // Assert
            trackRepositoryMock.verify((x) => x.getAlbumDataForTrackArtists(['Artist 1', 'Artist 2']), Times.exactly(1));
            expect(returnedAlbums.length).toEqual(2);
            expect(returnedAlbums[0].albumKey).toEqual('Album key 1');
            expect(returnedAlbums[1].albumKey).toEqual('Album key 2');
        });

        it('should return albums for album artists if albumData is found in the database', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'Album key 1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'Album key 2';
            const albumDatas: AlbumData[] = [albumData1, albumData2];

            trackRepositoryMock.setup((x) => x.getAlbumDataForAlbumArtists(['Artist 1', 'Artist 2'])).returns(() => albumDatas);

            // Act
            const returnedAlbums: AlbumModel[] = service.getAlbumsForArtists(['Artist 1', 'Artist 2'], ArtistType.albumArtists);

            // Assert
            trackRepositoryMock.verify((x) => x.getAlbumDataForAlbumArtists(['Artist 1', 'Artist 2']), Times.exactly(1));
            expect(returnedAlbums.length).toEqual(2);
            expect(returnedAlbums[0].albumKey).toEqual('Album key 1');
            expect(returnedAlbums[1].albumKey).toEqual('Album key 2');
        });

        it('should return albums for all artists if albumData is found in the database', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'Album key 1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'Album key 2';

            trackRepositoryMock.setup((x) => x.getAlbumDataForTrackArtists(['Artist 1', 'Artist 2'])).returns(() => [albumData1]);
            trackRepositoryMock.setup((x) => x.getAlbumDataForAlbumArtists(['Artist 1', 'Artist 2'])).returns(() => [albumData2]);

            // Act
            const returnedAlbums: AlbumModel[] = service.getAlbumsForArtists(['Artist 1', 'Artist 2'], ArtistType.allArtists);

            // Assert
            trackRepositoryMock.verify((x) => x.getAlbumDataForTrackArtists(['Artist 1', 'Artist 2']), Times.exactly(1));
            trackRepositoryMock.verify((x) => x.getAlbumDataForAlbumArtists(['Artist 1', 'Artist 2']), Times.exactly(1));
            expect(returnedAlbums.length).toEqual(2);
            expect(returnedAlbums[0].albumKey).toEqual('Album key 1');
            expect(returnedAlbums[1].albumKey).toEqual('Album key 2');
        });
    });

    describe('getAlbumsForGenres', () => {
        it('should return albums for genres if albumData is found in the database', () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'Album key 1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'Album key 2';
            const albumDatas: AlbumData[] = [albumData1, albumData2];

            trackRepositoryMock.setup((x) => x.getAlbumDataForGenres(['Genre 1', 'Genre 2'])).returns(() => albumDatas);

            // Act
            const returnedAlbums: AlbumModel[] = service.getAlbumsForGenres(['Genre 1', 'Genre 2']);

            // Assert
            trackRepositoryMock.verify((x) => x.getAlbumDataForGenres(['Genre 1', 'Genre 2']), Times.exactly(1));
            expect(returnedAlbums.length).toEqual(2);
            expect(returnedAlbums[0].albumKey).toEqual('Album key 1');
            expect(returnedAlbums[1].albumKey).toEqual('Album key 2');
        });
    });
});
