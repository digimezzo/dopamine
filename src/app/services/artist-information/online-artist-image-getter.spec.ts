import { OnlineArtistImageGetter } from './online-artist-image-getter';
import { IMock, Mock, Times } from 'typemoq';
import { ImageProcessor } from '../../common/image-processor';
import { FanartApi } from '../../common/api/fanart/fanart.api';

describe('OnlineArtistImageGetter', () => {
    let imageProcessorMock: IMock<ImageProcessor>;
    let fanartApiMock: IMock<FanartApi>;

    beforeEach(() => {
        imageProcessorMock = Mock.ofType<ImageProcessor>();
        fanartApiMock = Mock.ofType<FanartApi>();
    });

    function createSut(): OnlineArtistImageGetter {
        return new OnlineArtistImageGetter(imageProcessorMock.object, fanartApiMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const service: OnlineArtistImageGetter = createSut();

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('getArtistImageAsync', () => {
        it('should get artist image from fanart', async () => {
            // Arrange
            fanartApiMock.setup((x) => x.getArtistThumbnailAsync('musicBrainzId')).returns(() => Promise.resolve('thumbnailLink'));
            const service: OnlineArtistImageGetter = createSut();

            // Act
            const artistImage: string = await service.getArtistImageAsync('musicBrainzId');

            // Assert
            fanartApiMock.verify((x) => x.getArtistThumbnailAsync('musicBrainzId'), Times.once());
            expect(artistImage).toEqual('thumbnailLink');
        });
    });

    describe('resizeArtistImageAsync', () => {
        it('should get resized artist image from fanart', async () => {
            // Arrange
            fanartApiMock.setup((x) => x.getArtistThumbnailAsync('musicBrainzId')).returns(() => Promise.resolve('thumbnailLink'));
            const artistImageAsBuffer: Buffer = Buffer.from([1, 2, 3]);
            const resizedArtistImageAsBuffer: Buffer = Buffer.from([1, 2, 3]);
            imageProcessorMock
                .setup((x) => x.convertOnlineImageToBufferAsync('thumbnailLink'))
                .returns(() => Promise.resolve(artistImageAsBuffer));
            imageProcessorMock
                .setup((x) => x.toResizedJpegBufferAsync(artistImageAsBuffer, 300, 300, 80))
                .returns(() => Promise.resolve(resizedArtistImageAsBuffer));
            imageProcessorMock.setup((x) => x.convertBufferToImageUrl(resizedArtistImageAsBuffer)).returns(() => 'imageUrl');

            const service: OnlineArtistImageGetter = createSut();

            // Act
            const artistImage: string = await service.getResizedArtistImageAsync('musicBrainzId', 300);

            // Assert
            fanartApiMock.verify((x) => x.getArtistThumbnailAsync('musicBrainzId'), Times.once());
            imageProcessorMock.verify((x) => x.convertOnlineImageToBufferAsync('thumbnailLink'), Times.once());
            imageProcessorMock.verify((x) => x.toResizedJpegBufferAsync(artistImageAsBuffer, 300, 300, 80), Times.once());
            imageProcessorMock.verify((x) => x.convertBufferToImageUrl(resizedArtistImageAsBuffer), Times.once());
            expect(artistImage).toEqual('imageUrl');
        });
    });
});
