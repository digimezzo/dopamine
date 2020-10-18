import { IMock, It, Mock } from 'typemoq';
import { LastfmAlbum } from '../../app/core/api/lastfm/lastfm-album';
import { LastfmApi } from '../../app/core/api/lastfm/lastfm-api';
import { ImageProcessor } from '../../app/core/image-processor';
import { Logger } from '../../app/core/logger';
import { OnlineAlbumArtworkGetter } from '../../app/services/indexing/online-album-artwork-getter';

export class OnlineAlbumArtworkGetterMocker {
    constructor(
        public expectedAlbumData: Buffer,
        private lastfmApiThrowsError: boolean,
        private imageProcessorThrowsError: boolean,
        ) {
        this.onlineAlbumArtworkGetter = new OnlineAlbumArtworkGetter(
            this.imageProcessorMock.object,
            this.lastfmApiMock.object,
            this.loggerMock.object
        );

        const lastfmAlbum: LastfmAlbum = new LastfmAlbum();
        lastfmAlbum.imageMega = 'http://images.com/image.png';

        if (this.lastfmApiThrowsError) {
            this.lastfmApiMock.setup(
                x => x.getAlbumInfoAsync(It.isAnyString(), It.isAnyString(), false, 'EN')
            ).throws(new Error('An error occurred'));
        } else {
            this.lastfmApiMock.setup(
                x => x.getAlbumInfoAsync(It.isAnyString(), It.isAnyString(), false, 'EN')
            ).returns(async () => lastfmAlbum);
        }

        if (this.imageProcessorThrowsError) {
            this.imageProcessorMock.setup(x => x.convertLocalImageToBufferAsync(It.isAnyString())).throws(new Error('An error occurred'));
        } else {
            this.imageProcessorMock.setup(
                x => x.convertLocalImageToBufferAsync('http://images.com/image.png')
            ).returns(async () => this.expectedAlbumData);
        }
    }

    public imageProcessorMock: IMock<ImageProcessor> = Mock.ofType<ImageProcessor>();
    public lastfmApiMock: IMock<LastfmApi> = Mock.ofType<LastfmApi>();
    public loggerMock: IMock<Logger> = Mock.ofType<Logger>();
    public onlineAlbumArtworkGetter: OnlineAlbumArtworkGetter;
}
