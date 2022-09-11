import { IMock, Mock, Times } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { ImageProcessor } from '../../common/image-processor';
import { Logger } from '../../common/logger';
import { FileMetadataFactory } from '../../common/metadata/file-metadata-factory';
import { Metadata } from '../../common/metadata/metadata';
import { MetadataMock } from '../../common/metadata/metadata-mock';
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
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let service: BaseMetadataService;

    beforeEach(() => {
        fileMetadataFactoryMock = Mock.ofType<FileMetadataFactory>();
        trackRepositoryMock = Mock.ofType<BaseTrackRepository>();
        albumArtworkGetterMock = Mock.ofType<AlbumArtworkGetter>();
        imageProcessorMock = Mock.ofType<ImageProcessor>();
        loggerMock = Mock.ofType<Logger>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        service = new MetadataService(
            fileMetadataFactoryMock.object,
            trackRepositoryMock.object,
            albumArtworkGetterMock.object,
            imageProcessorMock.object,
            loggerMock.object
        );
    });

    describe('constructor', () => {
        it('should create', async () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('createImageUrlAsync', () => {
        it('should create an empty image url if trackModel is undefined', async () => {
            // Arrange

            // Act
            const imageUrl: string = await service.createImageUrlAsync(undefined);

            // Assert
            expect(imageUrl).toEqual('');
        });

        it('should create an empty image url if no file metadata was found', async () => {
            // Arrange
            const track: TrackModel = new TrackModel(new Track('path1'), translatorServiceMock.object);
            fileMetadataFactoryMock.setup((x) => x.create(track.path)).returns(() => undefined);

            service = new MetadataService(
                fileMetadataFactoryMock.object,
                trackRepositoryMock.object,
                albumArtworkGetterMock.object,
                imageProcessorMock.object,
                loggerMock.object
            );

            // Act
            const imageUrl: string = await service.createImageUrlAsync(track);

            // Assert
            expect(imageUrl).toEqual('');
        });

        it('should create an empty image url if no cover art was found', async () => {
            // Arrange
            const track: TrackModel = new TrackModel(new Track('path1'), translatorServiceMock.object);
            const fileMetadata1: Metadata = new MetadataMock();
            fileMetadataFactoryMock.setup((x) => x.create(track.path)).returns(() => fileMetadata1);
            albumArtworkGetterMock.setup((x) => x.getAlbumArtworkAsync(fileMetadata1, false)).returns(async () => undefined);

            service = new MetadataService(
                fileMetadataFactoryMock.object,
                trackRepositoryMock.object,
                albumArtworkGetterMock.object,
                imageProcessorMock.object,
                loggerMock.object
            );

            // Act
            const imageUrl: string = await service.createImageUrlAsync(track);

            // Assert
            expect(imageUrl).toEqual('');
        });

        it('should create an image url if cover art was found', async () => {
            // Arrange
            const track: TrackModel = new TrackModel(new Track('path1'), translatorServiceMock.object);
            const fileMetadata1: Metadata = new MetadataMock();
            const albumArtworkData1: Buffer = Buffer.from([1, 2, 3]);
            fileMetadataFactoryMock.setup((x) => x.create(track.path)).returns(() => fileMetadata1);
            albumArtworkGetterMock.setup((x) => x.getAlbumArtworkAsync(fileMetadata1, false)).returns(async () => albumArtworkData1);
            imageProcessorMock.setup((x) => x.convertBufferToImageUrl(albumArtworkData1)).returns(() => 'image-url');

            service = new MetadataService(
                fileMetadataFactoryMock.object,
                trackRepositoryMock.object,
                albumArtworkGetterMock.object,
                imageProcessorMock.object,
                loggerMock.object
            );

            // Act
            const imageUrl: string = await service.createImageUrlAsync(track);

            // Assert
            expect(imageUrl).toEqual('image-url');
        });
    });

    describe('saveTrackRating', () => {
        it('should update the track rating', async () => {
            // Arrange
            const track: TrackModel = new TrackModel(new Track('path1'), translatorServiceMock.object);

            service = new MetadataService(
                fileMetadataFactoryMock.object,
                trackRepositoryMock.object,
                albumArtworkGetterMock.object,
                imageProcessorMock.object,
                loggerMock.object
            );

            // Act
            await service.saveTrackRating(track);

            // Assert
            trackRepositoryMock.verify((x) => x.updateRating(track.id, track.rating), Times.once());
        });
    });
});
