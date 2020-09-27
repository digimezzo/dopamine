import { IMock, Mock } from 'typemoq';
import { ImageProcessor } from '../../app/core/image-processor';
import { Logger } from '../../app/core/logger';
import { AlbumArtworkGetter } from '../../app/services/indexing/album-artwork-getter';
import { ExternalArtworkPathGetter } from '../../app/services/indexing/external-artwork-path-getter';

export class AlbumArtworkGetterMocker {
    constructor() {
        this.albumArtworkGetter = new AlbumArtworkGetter(
            this.externalArtworkPathGetterMock.object,
            this.imageProcessorMock.object,
            this.loggerMock.object
        );
    }

    public externalArtworkPathGetterMock: IMock<ExternalArtworkPathGetter> = Mock.ofType<ExternalArtworkPathGetter>();
    public imageProcessorMock: IMock<ImageProcessor> = Mock.ofType<ImageProcessor>();
    public loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    public albumArtworkGetter: AlbumArtworkGetter;
}
