import { IMock, Mock } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { ImageProcessor } from '../../common/image-processor';
import { Logger } from '../../common/logger';
import { FileMetadata } from '../../common/metadata/file-metadata';
import { FileMetadataFactory } from '../../common/metadata/file-metadata-factory';
import { FileMetadataMock } from '../../common/metadata/file-metadata-mock';
import { AlbumArtworkGetter } from '../indexing/album-artwork-getter';
import { TrackModel } from '../track/track-model';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseMetadataService } from './base-metadata.service';
import { MetadataService } from './metadata.service';

describe('MetadataService', () => {
    let fileMetadataFactoryMock: IMock<FileMetadataFactory>;
    let albumArtworkGetterMock: IMock<AlbumArtworkGetter>;
    let imageProcessorMock: IMock<ImageProcessor>;
    let loggerMock: IMock<Logger>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let service: BaseMetadataService;

    beforeEach(() => {
        fileMetadataFactoryMock = Mock.ofType<FileMetadataFactory>();
        albumArtworkGetterMock = Mock.ofType<AlbumArtworkGetter>();
        imageProcessorMock = Mock.ofType<ImageProcessor>();
        loggerMock = Mock.ofType<Logger>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        service = new MetadataService(
            fileMetadataFactoryMock.object,
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
            fileMetadataFactoryMock.setup((x) => x.createReadOnlyAsync(track.path)).returns(() => undefined);

            service = new MetadataService(
                fileMetadataFactoryMock.object,
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
            const fileMetadata1: FileMetadata = new FileMetadataMock();
            fileMetadataFactoryMock.setup((x) => x.createReadOnlyAsync(track.path)).returns(async () => fileMetadata1);
            albumArtworkGetterMock.setup((x) => x.getAlbumArtworkAsync(fileMetadata1, false)).returns(async () => undefined);

            service = new MetadataService(
                fileMetadataFactoryMock.object,
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
            const fileMetadata1: FileMetadata = new FileMetadataMock();
            const albumArtworkData1: Buffer = Buffer.from([1, 2, 3]);
            fileMetadataFactoryMock.setup((x) => x.createReadOnlyAsync(track.path)).returns(async () => fileMetadata1);
            albumArtworkGetterMock.setup((x) => x.getAlbumArtworkAsync(fileMetadata1, false)).returns(async () => albumArtworkData1);
            imageProcessorMock.setup((x) => x.convertBufferToImageUrl(albumArtworkData1)).returns(() => 'image-url');

            service = new MetadataService(
                fileMetadataFactoryMock.object,
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
});
