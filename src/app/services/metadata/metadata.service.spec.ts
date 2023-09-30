import { Subscription } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { Constants } from '../../common/application/constants';
import { Track } from '../../common/data/entities/track';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { DateTime } from '../../common/date-time';
import { ImageProcessor } from '../../common/image-processor';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { Logger } from '../../common/logger';
import { FileMetadataFactory } from '../../common/metadata/file-metadata-factory';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';
import { BaseSettings } from '../../common/settings/base-settings';
import { MockCreator } from '../../testing/mock-creator';
import { AlbumArtworkGetter } from '../indexing/album-artwork-getter';
import { TrackModel } from '../track/track-model';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseMetadataService } from './base-metadata.service';
import { CachedAlbumArtworkGetter } from './cached-album-artwork-getter';
import { MetadataService } from './metadata.service';

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

    public isSaved: boolean = false;

    public save(): void {
        this.isSaved = true;
    }

    public async loadAsync(): Promise<void> {}
}

describe('MetadataService', () => {
    let fileMetadataFactoryMock: IMock<FileMetadataFactory>;
    let trackRepositoryMock: IMock<BaseTrackRepository>;
    let albumArtworkGetterMock: IMock<AlbumArtworkGetter>;
    let cachedAlbumArtworkGetterMock: IMock<CachedAlbumArtworkGetter>;
    let imageProcessorMock: IMock<ImageProcessor>;
    let loggerMock: IMock<Logger>;
    let fileAccessMock: IMock<BaseFileAccess>;
    let settingsMock: IMock<BaseSettings>;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    function createService(): BaseMetadataService {
        return new MetadataService(
            fileMetadataFactoryMock.object,
            trackRepositoryMock.object,
            albumArtworkGetterMock.object,
            cachedAlbumArtworkGetterMock.object,
            imageProcessorMock.object,
            fileAccessMock.object,
            settingsMock.object,
            loggerMock.object
        );
    }

    beforeEach(() => {
        fileMetadataFactoryMock = Mock.ofType<FileMetadataFactory>();
        trackRepositoryMock = Mock.ofType<BaseTrackRepository>();
        albumArtworkGetterMock = Mock.ofType<AlbumArtworkGetter>();
        cachedAlbumArtworkGetterMock = Mock.ofType<CachedAlbumArtworkGetter>();
        imageProcessorMock = Mock.ofType<ImageProcessor>();
        loggerMock = Mock.ofType<Logger>();
        fileAccessMock = Mock.ofType<BaseFileAccess>();
        settingsMock = Mock.ofType<BaseSettings>();
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        fileAccessMock.setup((x) => x.getFileExtension('path1.mp3')).returns(() => '.mp3');
        fileAccessMock.setup((x) => x.getFileExtension('path2.ogg')).returns(() => '.ogg');
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: BaseMetadataService = createService();

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('createImageUrlAsync', () => {
        it('should create an empty image url if trackModel is undefined', async () => {
            // Arrange
            const service: BaseMetadataService = createService();

            // Act
            const imageUrl: string = await service.createImageUrlAsync(undefined);

            // Assert
            expect(imageUrl).toEqual(Constants.emptyImage);
        });

        it('should create an empty image url if file metadata could not be created and there is no cached album artwork', async () => {
            // Arrange
            const service: BaseMetadataService = createService();
            const track: TrackModel = MockCreator.createTrackModelWithAlbumKey('path1', 'albumKey1');
            const fileMetaDataMock: any = {};
            fileMetadataFactoryMock.setup((x) => x.createAsync('path1')).returns(() => Promise.resolve(fileMetaDataMock));
            cachedAlbumArtworkGetterMock.setup((x) => x.getCachedAlbumArtworkPath('albumKey1')).returns(() => '');

            // Act
            const imageUrl: string = await service.createImageUrlAsync(track);

            // Assert
            expect(imageUrl).toEqual(Constants.emptyImage);
        });

        it('should return cached album artwork if file metadata could not be created and there is cached album artwork', async () => {
            // Arrange
            const service: BaseMetadataService = createService();
            const track: TrackModel = MockCreator.createTrackModelWithAlbumKey('path1', 'albumKey1');
            const fileMetaDataMock: any = {};
            fileMetadataFactoryMock.setup((x) => x.createAsync('path1')).returns(() => Promise.resolve(fileMetaDataMock));
            cachedAlbumArtworkGetterMock.setup((x) => x.getCachedAlbumArtworkPath('albumKey1')).returns(() => 'cachedAlbumArtworkPath1');
            fileAccessMock.setup((x) => x.pathExists('cachedAlbumArtworkPath1')).returns(() => true);

            // Act
            const imageUrl: string = await service.createImageUrlAsync(track);

            // Assert
            expect(imageUrl).toEqual('file:///cachedAlbumArtworkPath1');
        });

        it('should return cover art if album artwork was found', async () => {
            // Arrange
            const service: BaseMetadataService = createService();
            const track: TrackModel = MockCreator.createTrackModelWithAlbumKey('path1', 'albumKey1');
            const fileMetaDataMock: any = {};
            fileMetadataFactoryMock.setup((x) => x.createAsync('path1')).returns(() => Promise.resolve(fileMetaDataMock));
            const coverArt: Buffer = Buffer.from([1, 2, 3]);
            albumArtworkGetterMock.setup((x) => x.getAlbumArtworkAsync(fileMetaDataMock, false)).returns(() => Promise.resolve(coverArt));
            imageProcessorMock.setup((x) => x.convertBufferToImageUrl(coverArt)).returns(() => 'bufferAsImageUrl');

            // Act
            const imageUrl: string = await service.createImageUrlAsync(track);

            // Assert
            expect(imageUrl).toEqual('bufferAsImageUrl');
        });
    });

    describe('saveTrackRatingAsync', () => {
        it('should update the track rating in the database', async () => {
            // Arrange
            settingsMock.setup((x) => x.saveRatingToAudioFiles).returns(() => false);
            const track: TrackModel = new TrackModel(new Track('path1.mp3'), dateTimeMock.object, translatorServiceMock.object);

            const service: BaseMetadataService = createService();

            // Act
            await service.saveTrackRatingAsync(track);

            // Assert
            trackRepositoryMock.verify((x) => x.updateRating(track.id, track.rating), Times.once());
        });

        it('should not save the rating to the audio file if the setting saveRatingToAudioFiles is false', async () => {
            // Arrange
            settingsMock.setup((x) => x.saveRatingToAudioFiles).returns(() => false);
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataFactoryMock.setup((x) => x.createAsync('path1.mp3')).returns(() => Promise.resolve(fileMetadataStub));
            const track: TrackModel = new TrackModel(new Track('path1.mp3'), dateTimeMock.object, translatorServiceMock.object);

            const service: BaseMetadataService = createService();

            // Act
            await service.saveTrackRatingAsync(track);

            // Assert
            expect(fileMetadataStub.isSaved).toBeFalsy();
        });

        it('should not save the rating to the audio file if the setting saveRatingToAudioFiles is true but the file extension is not .mp3', async () => {
            // Arrange
            settingsMock.setup((x) => x.saveRatingToAudioFiles).returns(() => true);
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataFactoryMock.setup((x) => x.createAsync('path2.ogg')).returns(() => Promise.resolve(fileMetadataStub));
            const track: TrackModel = new TrackModel(new Track('path2.ogg'), dateTimeMock.object, translatorServiceMock.object);

            const service: BaseMetadataService = createService();

            // Act
            await service.saveTrackRatingAsync(track);

            // Assert
            expect(fileMetadataStub.isSaved).toBeFalsy();
        });

        it('should save the rating to the audio file if the setting saveRatingToAudioFiles is true and the file extension is .mp3', async () => {
            // Arrange
            settingsMock.setup((x) => x.saveRatingToAudioFiles).returns(() => true);
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataFactoryMock.setup((x) => x.createAsync('path1.mp3')).returns(() => Promise.resolve(fileMetadataStub));
            const track: TrackModel = new TrackModel(new Track('path1.mp3'), dateTimeMock.object, translatorServiceMock.object);

            const service: BaseMetadataService = createService();

            // Act
            await service.saveTrackRatingAsync(track);

            // Assert
            expect(fileMetadataStub.isSaved).toBeTruthy();
        });

        it('should notify that rating is saved', async () => {
            // Arrange
            settingsMock.setup((x) => x.saveRatingToAudioFiles).returns(() => false);
            const track: TrackModel = new TrackModel(new Track('path1.mp3'), dateTimeMock.object, translatorServiceMock.object);

            const service: BaseMetadataService = createService();

            const subscription: Subscription = new Subscription();
            let ratingSaved: boolean = false;

            subscription.add(
                service.ratingSaved$.subscribe(() => {
                    ratingSaved = true;
                })
            );

            // Act
            await service.saveTrackRatingAsync(track);

            // Assert
            expect(ratingSaved).toBeTruthy();
        });
    });

    describe('saveTrackLove', () => {
        it('should update the track love in the database', () => {
            // Arrange
            settingsMock.setup((x) => x.saveRatingToAudioFiles).returns(() => false);
            const track: TrackModel = new TrackModel(new Track('path1.mp3'), dateTimeMock.object, translatorServiceMock.object);

            const service: BaseMetadataService = createService();

            // Act
            service.saveTrackLove(track);

            // Assert
            trackRepositoryMock.verify((x) => x.updateLove(track.id, track.love), Times.once());
        });

        it('should notify that love is saved', () => {
            // Arrange
            settingsMock.setup((x) => x.saveRatingToAudioFiles).returns(() => false);
            const track: TrackModel = new TrackModel(new Track('path1.mp3'), dateTimeMock.object, translatorServiceMock.object);

            const service: BaseMetadataService = createService();

            const subscription: Subscription = new Subscription();
            let loveSaved: boolean = false;

            subscription.add(
                service.loveSaved$.subscribe(() => {
                    loveSaved = true;
                })
            );

            // Act
            service.saveTrackLove(track);

            // Assert
            expect(loveSaved).toBeTruthy();
        });
    });
});
