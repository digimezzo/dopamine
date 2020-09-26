import { IMock, Mock } from 'typemoq';
import { ImageProcessor } from '../../app/core/image-processor';
import { FileSystem } from '../../app/core/io/file-system';
import { Logger } from '../../app/core/logger';
import { AlbumArtworkCacheIdFactory } from '../../app/services/album-artwork-cache/album-artwork-cache-id-factory';
import { AlbumArtworkCacheService } from '../../app/services/album-artwork-cache/album-artwork-cache.service';

export class AlbumArtworkCacheServiceMocker {
    constructor() {
        this.albumArtworkCacheService = new AlbumArtworkCacheService(
            this.albumArtworkCacheIdFactoryMock.object,
            this.imageProcessorMock.object,
            this.fileSystemMock.object,
            this.loggerMock.object);
    }

    public albumArtworkCacheIdFactoryMock: IMock<AlbumArtworkCacheIdFactory> = Mock.ofType<AlbumArtworkCacheIdFactory>();
    public imageProcessorMock: IMock<ImageProcessor> = Mock.ofType<ImageProcessor>();
    public fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
    public loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    public albumArtworkCacheService: AlbumArtworkCacheService;

    public callAlbumArtworkCacheServiceConstructor(): void {
        this.albumArtworkCacheService = new AlbumArtworkCacheService(
            this.albumArtworkCacheIdFactoryMock.object,
            this.imageProcessorMock.object,
            this.fileSystemMock.object,
            this.loggerMock.object);
    }
}
