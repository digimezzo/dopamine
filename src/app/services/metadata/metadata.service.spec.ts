import { IMock, Mock, Times } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { ImageProcessor } from '../../common/image-processor';
import { BaseFileSystem } from '../../common/io/base-file-system';
import { Logger } from '../../common/logger';
import { FileMetadata } from '../../common/metadata/file-metadata';
import { FileMetadataFactory } from '../../common/metadata/file-metadata-factory';
import { BaseSettings } from '../../common/settings/base-settings';
import { AlbumArtworkGetter } from '../indexing/album-artwork-getter';
import { TrackModel } from '../track/track-model';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseMetadataService } from './base-metadata.service';
import { MetadataService } from './metadata.service';

describe('MetadataService', () => {
    let fileMetadataFactoryMock: IMock<FileMetadataFactory>;
    let trackRepositoryMock: IMock<BaseTrackRepository>;
    let albumArtworkGetterMock: IMock<AlbumArtworkGetter>;
    let imageProcessorMock: IMock<ImageProcessor>;
    let loggerMock: IMock<Logger>;
    let fileSystemMock: IMock<BaseFileSystem>;
    let settingsMock: IMock<BaseSettings>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    function createService(): BaseMetadataService {
        return new MetadataService(
            fileMetadataFactoryMock.object,
            trackRepositoryMock.object,
            albumArtworkGetterMock.object,
            imageProcessorMock.object,
            fileSystemMock.object,
            settingsMock.object,
            loggerMock.object
        );
    }

    beforeEach(() => {
        fileMetadataFactoryMock = Mock.ofType<FileMetadataFactory>();
        trackRepositoryMock = Mock.ofType<BaseTrackRepository>();
        albumArtworkGetterMock = Mock.ofType<AlbumArtworkGetter>();
        imageProcessorMock = Mock.ofType<ImageProcessor>();
        loggerMock = Mock.ofType<Logger>();
        fileSystemMock = Mock.ofType<BaseFileSystem>();
        settingsMock = Mock.ofType<BaseSettings>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        fileSystemMock.setup((x) => x.getFileExtension('path1.mp3')).returns(() => '.mp3');
        fileSystemMock.setup((x) => x.getFileExtension('path2.ogg')).returns(() => '.ogg');
    });

    describe('constructor', () => {
        it('should create', async () => {
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
            expect(imageUrl).toEqual('');
        });

        it('should create an empty image url if no file metadata was found', async () => {
            // Arrange
            const track: TrackModel = new TrackModel(new Track('path1'), translatorServiceMock.object);
            fileMetadataFactoryMock.setup((x) => x.create(track.path)).returns(() => undefined);

            const service: BaseMetadataService = createService();

            // Act
            const imageUrl: string = await service.createImageUrlAsync(track);

            // Assert
            expect(imageUrl).toEqual('');
        });

        it('should create an empty image url if no cover art was found', async () => {
            // Arrange
            const track: TrackModel = new TrackModel(new Track('path1'), translatorServiceMock.object);
            const fileMetadataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetadataFactoryMock.setup((x) => x.create(track.path)).returns(() => fileMetadataMock.object);
            albumArtworkGetterMock.setup((x) => x.getAlbumArtworkAsync(fileMetadataMock.object, false)).returns(async () => undefined);

            const service: BaseMetadataService = createService();

            // Act
            const imageUrl: string = await service.createImageUrlAsync(track);

            // Assert
            expect(imageUrl).toEqual('');
        });

        it('should create an image url if cover art was found', async () => {
            // Arrange
            const track: TrackModel = new TrackModel(new Track('path1'), translatorServiceMock.object);
            const fileMetadataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            const albumArtworkData1: Buffer = Buffer.from([1, 2, 3]);
            fileMetadataFactoryMock.setup((x) => x.create(track.path)).returns(() => fileMetadataMock.object);
            albumArtworkGetterMock
                .setup((x) => x.getAlbumArtworkAsync(fileMetadataMock.object, false))
                .returns(async () => albumArtworkData1);
            imageProcessorMock.setup((x) => x.convertBufferToImageUrl(albumArtworkData1)).returns(() => 'image-url');

            const service: BaseMetadataService = createService();

            // Act
            const imageUrl: string = await service.createImageUrlAsync(track);

            // Assert
            expect(imageUrl).toEqual('image-url');
        });
    });

    describe('saveTrackRating', () => {
        it('should update the track rating in the database', async () => {
            // Arrange
            settingsMock.setup((x) => x.saveRatingToAudioFiles).returns(() => false);
            const track: TrackModel = new TrackModel(new Track('path1.mp3'), translatorServiceMock.object);

            const service: BaseMetadataService = createService();

            // Act
            await service.saveTrackRating(track);

            // Assert
            trackRepositoryMock.verify((x) => x.updateRating(track.id, track.rating), Times.once());
        });

        it('should not save the rating to the audio file if the setting saveRatingToAudioFiles is false', async () => {
            // Arrange
            settingsMock.setup((x) => x.saveRatingToAudioFiles).returns(() => false);
            const fileMetadataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetadataFactoryMock.setup((x) => x.create('path1.mp3')).returns(() => fileMetadataMock.object);
            const track: TrackModel = new TrackModel(new Track('path1.mp3'), translatorServiceMock.object);

            const service: BaseMetadataService = createService();

            // Act
            await service.saveTrackRating(track);

            // Assert
            fileMetadataMock.verify((x) => x.save(), Times.never());
        });

        it('should not save the rating to the audio file if the setting saveRatingToAudioFiles is true but the file extension is not .mp3', async () => {
            // Arrange
            settingsMock.setup((x) => x.saveRatingToAudioFiles).returns(() => true);
            const fileMetadataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetadataFactoryMock.setup((x) => x.create('path2.ogg')).returns(() => fileMetadataMock.object);
            const track: TrackModel = new TrackModel(new Track('path2.ogg'), translatorServiceMock.object);

            const service: BaseMetadataService = createService();

            // Act
            await service.saveTrackRating(track);

            // Assert
            fileMetadataMock.verify((x) => x.save(), Times.never());
        });

        it('should save the rating to the audio file if the setting saveRatingToAudioFiles is true and the file extension is .mp3', async () => {
            // Arrange
            settingsMock.setup((x) => x.saveRatingToAudioFiles).returns(() => true);
            const fileMetadataMock: IMock<FileMetadata> = Mock.ofType<FileMetadata>();
            fileMetadataFactoryMock.setup((x) => x.create('path1.mp3')).returns(() => fileMetadataMock.object);
            const track: TrackModel = new TrackModel(new Track('path1.mp3'), translatorServiceMock.object);

            const service: BaseMetadataService = createService();

            // Act
            await service.saveTrackRating(track);

            // Assert
            fileMetadataMock.verify((x) => x.save(), Times.once());
        });
    });
});
