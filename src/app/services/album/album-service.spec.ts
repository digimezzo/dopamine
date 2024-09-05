import { IMock, Mock, Times } from 'typemoq';
import { ArtistType } from '../artist/artist-type';
import { AlbumModel } from './album-model';
import { AlbumService } from './album-service';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { AlbumData } from '../../data/entities/album-data';
import { ApplicationPaths } from '../../common/application/application-paths';
import { SettingsBase } from '../../common/settings/settings.base';
import { SettingsMock } from '../../testing/settings-mock';
import { ArtistModel } from '../artist/artist-model';
import { Logger } from '../../common/logger';

describe('AlbumService', () => {
    let trackRepositoryMock: IMock<TrackRepositoryBase>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let applicationPathsMock: IMock<ApplicationPaths>;
    let settingsMock: SettingsMock;
    let loggerMock: IMock<Logger>;
    let service: AlbumService;

    beforeEach(() => {
        trackRepositoryMock = Mock.ofType<TrackRepositoryBase>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        applicationPathsMock = Mock.ofType<ApplicationPaths>();
        settingsMock = new SettingsMock();
        loggerMock = Mock.ofType<Logger>();
        service = new AlbumService(
            trackRepositoryMock.object,
            translatorServiceMock.object,
            applicationPathsMock.object,
            settingsMock,
            loggerMock.object,
        );
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
            trackRepositoryMock.setup((x) => x.getAllAlbumData('')).returns(() => undefined);

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

            trackRepositoryMock.setup((x) => x.getAllAlbumData('')).returns(() => albumDatas);

            // Act
            const returnedAlbums: AlbumModel[] = service.getAllAlbums();

            // Assert
            trackRepositoryMock.verify((x) => x.getAllAlbumData(''), Times.exactly(1));
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

            trackRepositoryMock
                .setup((x) => x.getAlbumDataForTrackArtists('', ['Source artist 1', 'Source artist 2']))
                .returns(() => albumDatas);

            const artist1: ArtistModel = new ArtistModel('Source artist 1', 'Artist 1', translatorServiceMock.object);
            const artist2: ArtistModel = new ArtistModel('Source artist 2', 'Artist 2', translatorServiceMock.object);

            // Act
            const returnedAlbums: AlbumModel[] = service.getAlbumsForArtists([artist1, artist2], ArtistType.trackArtists);

            // Assert
            trackRepositoryMock.verify((x) => x.getAlbumDataForTrackArtists('', ['Source artist 1', 'Source artist 2']), Times.exactly(1));
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

            trackRepositoryMock
                .setup((x) => x.getAlbumDataForAlbumArtists('', ['Source artist 1', 'Source artist 2']))
                .returns(() => albumDatas);

            const artist1: ArtistModel = new ArtistModel('Source artist 1', 'Artist 1', translatorServiceMock.object);
            const artist2: ArtistModel = new ArtistModel('Source artist 2', 'Artist 2', translatorServiceMock.object);

            // Act
            const returnedAlbums: AlbumModel[] = service.getAlbumsForArtists([artist1, artist2], ArtistType.albumArtists);

            // Assert
            trackRepositoryMock.verify((x) => x.getAlbumDataForAlbumArtists('', ['Source artist 1', 'Source artist 2']), Times.exactly(1));
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

            trackRepositoryMock
                .setup((x) => x.getAlbumDataForTrackArtists('', ['Source artist 1', 'Source artist 2']))
                .returns(() => [albumData1]);
            trackRepositoryMock
                .setup((x) => x.getAlbumDataForAlbumArtists('', ['Source artist 1', 'Source artist 2']))
                .returns(() => [albumData2]);

            const artist1: ArtistModel = new ArtistModel('Source artist 1', 'Artist 1', translatorServiceMock.object);
            const artist2: ArtistModel = new ArtistModel('Source artist 2', 'Artist 2', translatorServiceMock.object);

            // Act
            const returnedAlbums: AlbumModel[] = service.getAlbumsForArtists([artist1, artist2], ArtistType.allArtists);

            // Assert
            trackRepositoryMock.verify((x) => x.getAlbumDataForTrackArtists('', ['Source artist 1', 'Source artist 2']), Times.exactly(1));
            trackRepositoryMock.verify((x) => x.getAlbumDataForAlbumArtists('', ['Source artist 1', 'Source artist 2']), Times.exactly(1));
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

            trackRepositoryMock.setup((x) => x.getAlbumDataForGenres('', ['Genre 1', 'Genre 2'])).returns(() => albumDatas);

            // Act
            const returnedAlbums: AlbumModel[] = service.getAlbumsForGenres(['Genre 1', 'Genre 2']);

            // Assert
            trackRepositoryMock.verify((x) => x.getAlbumDataForGenres('', ['Genre 1', 'Genre 2']), Times.exactly(1));
            expect(returnedAlbums.length).toEqual(2);
            expect(returnedAlbums[0].albumKey).toEqual('Album key 1');
            expect(returnedAlbums[1].albumKey).toEqual('Album key 2');
        });
    });
});
