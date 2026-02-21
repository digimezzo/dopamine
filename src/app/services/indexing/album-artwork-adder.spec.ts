import { IMock, It, Mock, Times } from 'typemoq';
import { GuidFactory } from '../../common/guid.factory';
import { Logger } from '../../common/logger';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';
import { AlbumArtworkCacheId } from '../album-artwork-cache/album-artwork-cache-id';
import { AlbumArtworkAdder } from './album-artwork-adder';
import { AlbumArtworkGetter } from './album-artwork-getter';
import { AlbumArtworkCacheServiceBase } from '../album-artwork-cache/album-artwork-cache.service.base';
import { AlbumArtworkRepositoryBase } from '../../data/repositories/album-artwork-repository.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { FileMetadataFactory } from '../../common/metadata/file-metadata.factory';
import { AlbumData } from '../../data/entities/album-data';
import { Track } from '../../data/entities/track';
import { AlbumArtwork } from '../../data/entities/album-artwork';
import { NotificationServiceBase } from '../notification/notification.service.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { SettingsMock } from '../../testing/settings-mock';

class FileMetadataImplementation implements IFileMetadata {
    public path: string;
    public bitRate: number;
    public sampleRate: number;
    public durationInMilliseconds: number;
    public title: string;
    public album: string;
    public albumArtists: string[];
    public artists: string[];
    public genres: string[];
    public comment: string;
    public grouping: string;
    public year: number;
    public trackNumber: number;
    public trackCount: number;
    public discNumber: number;
    public discCount: number;
    public lyrics: string;
    public picture: Buffer;
    public rating: number;
    public composers: string[];
    public conductor: string;
    public beatsPerMinute: number;
    public save(): void {}
    public async loadAsync(): Promise<void> {}
}

describe('AlbumArtworkAdder', () => {
    let albumArtworkCacheServiceMock: IMock<AlbumArtworkCacheServiceBase>;
    let albumArtworkRepositoryMock: IMock<AlbumArtworkRepositoryBase>;
    let trackRepositoryMock: IMock<TrackRepositoryBase>;
    let fileMetadataFactoryMock: IMock<FileMetadataFactory>;
    let notificationServiceMock: IMock<NotificationServiceBase>;
    let loggerMock: IMock<Logger>;
    let albumArtworkGetterMock: IMock<AlbumArtworkGetter>;
    let guidFactoryMock: IMock<GuidFactory>;
    let settingsMock: SettingsBase;

    let albumArtworkAdder: AlbumArtworkAdder;

    beforeEach(() => {
        albumArtworkCacheServiceMock = Mock.ofType<AlbumArtworkCacheServiceBase>();
        albumArtworkRepositoryMock = Mock.ofType<AlbumArtworkRepositoryBase>();
        trackRepositoryMock = Mock.ofType<TrackRepositoryBase>();
        fileMetadataFactoryMock = Mock.ofType<FileMetadataFactory>();
        notificationServiceMock = Mock.ofType<NotificationServiceBase>();
        loggerMock = Mock.ofType<Logger>();
        albumArtworkGetterMock = Mock.ofType<AlbumArtworkGetter>();
        guidFactoryMock = Mock.ofType<GuidFactory>();
        settingsMock = new SettingsMock();

        albumArtworkAdder = new AlbumArtworkAdder(
            albumArtworkCacheServiceMock.object,
            albumArtworkRepositoryMock.object,
            trackRepositoryMock.object,
            fileMetadataFactoryMock.object,
            notificationServiceMock.object,
            loggerMock.object,
            albumArtworkGetterMock.object,
            settingsMock,
        );
    });

    describe('addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync', () => {
        it('should get album data that needs indexing', async () => {
            // Arrange

            // Act
            await albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            trackRepositoryMock.verify((x) => x.getAlbumDataThatNeedsIndexing(''), Times.exactly(1));
        });

        it('should notify that album artwork is being updated if it is the first time that indexing runs', async () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing('')).returns(() => [albumData1]);
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtwork()).returns(() => 0);

            // Act
            await albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            notificationServiceMock.verify((x) => x.updatingAlbumArtworkAsync(), Times.exactly(1));
        });

        it('should not notify that album artwork is being updated if it is not the first time that indexing runs', async () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing('')).returns(() => [albumData1]);
            albumArtworkRepositoryMock.setup((x) => x.getNumberOfAlbumArtwork()).returns(() => 10);

            // Act
            await albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            notificationServiceMock.verify((x) => x.updatingAlbumArtworkAsync(), Times.never());
        });

        it('should not get the last modified track for an album key if there is no album data that needs indexing', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing('')).returns(() => []);

            // Act
            await albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            trackRepositoryMock.verify((x) => x.getLastModifiedTrackForAlbumKeyAsync('', It.isAny()), Times.never());
        });

        it('should get the last modified track for an album key if there is album data that needs indexing', async () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing('')).returns(() => [albumData1]);

            // Act
            await albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            trackRepositoryMock.verify((x) => x.getLastModifiedTrackForAlbumKeyAsync('', 'AlbumKey1'), Times.exactly(1));
        });

        it('should not create a read-only file metadata if there is no last modified track for the given album key', async () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing('')).returns(() => [albumData1]);
            trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('', 'AlbumKey1')).returns(() => undefined);

            // Act
            await albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            fileMetadataFactoryMock.verify((x) => x.createAsync(It.isAny()), Times.never());
        });

        it('should create a read-only file metadata if there is a last modified track for the given album key', async () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const track1: Track = new Track('/home/user/Music/track1.mp3');

            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing('')).returns(() => [albumData1]);
            trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('', 'AlbumKey1')).returns(() => track1);

            // Act
            await albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            fileMetadataFactoryMock.verify((x) => x.createAsync('/home/user/Music/track1.mp3'), Times.exactly(1));
        });

        it('should get album artwork if a read-only file metadata was created', async () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const track1: Track = new Track('/home/user/Music/track1.mp3');
            const fileMetadataStub = new FileMetadataImplementation();

            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing('')).returns(() => [albumData1]);
            trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('', 'AlbumKey1')).returns(() => track1);
            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/track1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));

            // Act
            await albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            albumArtworkGetterMock.verify((x) => x.getAlbumArtworkAsync(It.isAny(), true), Times.exactly(1));
        });

        it('should not add album artwork to the cache if no album artwork data was found', async () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const track1: Track = new Track('/home/user/Music/track1.mp3');
            const fileMetadataStub = new FileMetadataImplementation();

            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing('')).returns(() => [albumData1]);
            trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('', 'AlbumKey1')).returns(() => track1);
            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/track1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            albumArtworkGetterMock.setup((x) => x.getAlbumArtworkAsync(fileMetadataStub, true)).returns(() => Promise.resolve(undefined));

            // Act
            await albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            albumArtworkCacheServiceMock.verify((x) => x.addArtworkDataToCacheAsync(It.isAny()), Times.never());
        });

        it('should add album artwork to the cache if album artwork data was found', async () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const track1: Track = new Track('/home/user/Music/track1.mp3');
            const fileMetadataStub = new FileMetadataImplementation();
            const albumArtworkData1: Buffer = Buffer.from([1, 2, 3]);

            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing('')).returns(() => [albumData1]);
            trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('', 'AlbumKey1')).returns(() => track1);
            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/track1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            albumArtworkGetterMock
                .setup((x) => x.getAlbumArtworkAsync(fileMetadataStub, true))
                .returns(() => Promise.resolve(albumArtworkData1));

            // Act
            await albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            albumArtworkCacheServiceMock.verify((x) => x.addArtworkDataToCacheAsync(albumArtworkData1), Times.exactly(1));
        });

        it('should not disable album artwork indexing for the given album key if the artwork was not added to the cache', async () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const track1: Track = new Track('/home/user/Music/track1.mp3');
            const fileMetadataStub = new FileMetadataImplementation();
            const albumArtworkData1: Buffer = Buffer.from([1, 2, 3]);

            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing('')).returns(() => [albumData1]);
            trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('', 'AlbumKey1')).returns(() => track1);
            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/track1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            albumArtworkGetterMock
                .setup((x) => x.getAlbumArtworkAsync(fileMetadataStub, true))
                .returns(() => Promise.resolve(albumArtworkData1));
            albumArtworkCacheServiceMock
                .setup((x) => x.addArtworkDataToCacheAsync(albumArtworkData1))
                .returns(() => Promise.resolve(undefined));

            // Act
            await albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            trackRepositoryMock.verify((x) => x.disableNeedsAlbumArtworkIndexing('AlbumKey1'), Times.never());
        });

        it('should disable album artwork indexing for the given album key if the artwork was added to the cache', async () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const track1: Track = new Track('/home/user/Music/track1.mp3');
            const fileMetadataStub = new FileMetadataImplementation();
            const albumArtworkData1: Buffer = Buffer.from([1, 2, 3]);
            const albumArtworkCacheId1: AlbumArtworkCacheId = new AlbumArtworkCacheId(guidFactoryMock.object);

            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing('')).returns(() => [albumData1]);
            trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('', 'AlbumKey1')).returns(() => track1);
            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/track1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            albumArtworkGetterMock
                .setup((x) => x.getAlbumArtworkAsync(fileMetadataStub, true))
                .returns(() => Promise.resolve(albumArtworkData1));
            albumArtworkCacheServiceMock
                .setup((x) => x.addArtworkDataToCacheAsync(albumArtworkData1))
                .returns(() => Promise.resolve(albumArtworkCacheId1));

            // Act
            await albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            trackRepositoryMock.verify((x) => x.disableNeedsAlbumArtworkIndexing('AlbumKey1'), Times.exactly(1));
        });

        it('should not add album artwork to the database if the artwork was not added to the cache', async () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const track1: Track = new Track('/home/user/Music/track1.mp3');
            const fileMetadataStub = new FileMetadataImplementation();
            const albumArtworkData1: Buffer = Buffer.from([1, 2, 3]);

            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing('')).returns(() => [albumData1]);
            trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('', 'AlbumKey1')).returns(() => track1);
            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/track1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            albumArtworkGetterMock
                .setup((x) => x.getAlbumArtworkAsync(fileMetadataStub, true))
                .returns(() => Promise.resolve(albumArtworkData1));
            albumArtworkCacheServiceMock
                .setup((x) => x.addArtworkDataToCacheAsync(albumArtworkData1))
                .returns(() => Promise.resolve(undefined));

            // Act
            await albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            albumArtworkRepositoryMock.verify((x) => x.addAlbumArtwork(It.isAny()), Times.never());
        });

        it('should add album artwork to the database if the artwork was added to the cache', async () => {
            // Arrange
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'AlbumKey1';

            const track1: Track = new Track('/home/user/Music/track1.mp3');
            const fileMetadataStub = new FileMetadataImplementation();
            const albumArtworkData1: Buffer = Buffer.from([1, 2, 3]);
            const albumArtworkCacheId1: AlbumArtworkCacheId = new AlbumArtworkCacheId(guidFactoryMock.object);

            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing('')).returns(() => [albumData1]);
            trackRepositoryMock.setup((x) => x.getLastModifiedTrackForAlbumKeyAsync('', 'AlbumKey1')).returns(() => track1);
            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/track1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            albumArtworkGetterMock
                .setup((x) => x.getAlbumArtworkAsync(fileMetadataStub, true))
                .returns(() => Promise.resolve(albumArtworkData1));
            albumArtworkCacheServiceMock
                .setup((x) => x.addArtworkDataToCacheAsync(albumArtworkData1))
                .returns(() => Promise.resolve(albumArtworkCacheId1));

            const newAlbumArtwork1: AlbumArtwork = new AlbumArtwork('AlbumKey1', albumArtworkCacheId1.id);

            // Act
            await albumArtworkAdder.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync();

            // Assert
            albumArtworkRepositoryMock.verify((x) => x.addAlbumArtwork(newAlbumArtwork1), Times.exactly(1));
        });
    });
});
