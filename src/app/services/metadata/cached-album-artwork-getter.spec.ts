import { IMock, Mock } from 'typemoq';
import { AlbumData } from '../../common/data/entities/album-data';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { CachedAlbumArtworkGetter } from './cached-album-artwork-getter';

describe('CachedAlbumArtworkGetter', () => {
    let trackRepositoryMock: IMock<BaseTrackRepository>;
    let fileAccessMock: IMock<BaseFileAccess>;

    beforeEach(() => {
        trackRepositoryMock = Mock.ofType<BaseTrackRepository>();
        fileAccessMock = Mock.ofType<BaseFileAccess>();
    });

    function createInstance(): CachedAlbumArtworkGetter {
        return new CachedAlbumArtworkGetter(trackRepositoryMock.object, fileAccessMock.object);
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
            trackRepositoryMock.setup((x) => x.getAlbumDataForAlbumKey(albumKey)).returns(() => []);

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
            trackRepositoryMock.setup((x) => x.getAlbumDataForAlbumKey(albumKey)).returns(() => [albumData1, albumData2]);
            fileAccessMock.setup((x) => x.coverArtFullPath('id1')).returns(() => '/my/path/id1');

            // Act
            const cachedAlbumArtworkPath: string = instance.getCachedAlbumArtworkPath(albumKey);

            // Assert
            expect(cachedAlbumArtworkPath).toEqual('/my/path/id1');
        });
    });
});
