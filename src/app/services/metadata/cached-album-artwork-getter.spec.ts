import { IMock, Mock } from 'typemoq';
import { CachedAlbumArtworkGetter } from './cached-album-artwork-getter';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { AlbumData } from '../../data/entities/album-data';
import { ApplicationPaths } from '../../common/application/application-paths';
import { SettingsMock } from '../../testing/settings-mock';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';

describe('CachedAlbumArtworkGetter', () => {
    let trackRepositoryMock: IMock<TrackRepositoryBase>;
    let applicationPathsMock: IMock<ApplicationPaths>;
    let settingsMock: any;

    beforeEach(() => {
        trackRepositoryMock = Mock.ofType<TrackRepositoryBase>();
        applicationPathsMock = Mock.ofType<ApplicationPaths>();
        settingsMock = new SettingsMock();
    });

    function createInstance(): CachedAlbumArtworkGetter {
        return new CachedAlbumArtworkGetter(trackRepositoryMock.object, applicationPathsMock.object, settingsMock);
    }

    function createAlbumData(artworkId: string): AlbumData {
        const albumData: AlbumData = new AlbumData();
        albumData.artworkId = artworkId;

        return albumData;
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const instance: CachedAlbumArtworkGetter = createInstance();

            // Assert
            expect(instance).toBeDefined();
        });
    });

    describe('getCachedAlbumArtworkPath', () => {
        it('should return empty string if nothing found for given albumKey', () => {
            // Arrange
            const instance: CachedAlbumArtworkGetter = createInstance();
            const albumKey: string = 'my-album-key';
            trackRepositoryMock.setup((x) => x.getAlbumDataForAlbumKey('', albumKey)).returns(() => []);

            // Act
            const cachedAlbumArtworkPath: string = instance.getCachedAlbumArtworkPath(albumKey);

            // Assert
            expect(cachedAlbumArtworkPath).toEqual('');
        });

        it('should return cached album artwork path if something found for given albumKey', () => {
            // Arrange
            const instance: CachedAlbumArtworkGetter = createInstance();
            const albumKey: string = 'my-album-key';

            const albumData1: AlbumData = createAlbumData('id1');
            const albumData2: AlbumData = createAlbumData('id2');
            trackRepositoryMock.setup((x) => x.getAlbumDataForAlbumKey('', albumKey)).returns(() => [albumData1, albumData2]);
            applicationPathsMock.setup((x) => x.coverArtFullPath('id1')).returns(() => '/my/path/id1');

            // Act
            const cachedAlbumArtworkPath: string = instance.getCachedAlbumArtworkPath(albumKey);

            // Assert
            expect(cachedAlbumArtworkPath).toEqual('/my/path/id1');
        });
    });
});
