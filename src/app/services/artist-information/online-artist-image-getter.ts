import { Injectable } from '@angular/core';
import { FanartApi } from '../../common/api/fanart/fanart.api';
import { ImageProcessor } from '../../common/image-processor';

@Injectable()
export class OnlineArtistImageGetter {
    public constructor(
        private imageProcessor: ImageProcessor,
        private fanartApi: FanartApi,
    ) {}

    public async getArtistImageAsync(musicBrainzId: string): Promise<string> {
        // Last.fm was so nice to break their artist image API. So we need to get images from elsewhere.
        return await this.fanartApi.getArtistThumbnailAsync(musicBrainzId);
    }

    public async getResizedArtistImageAsync(musicBrainzId: string, maximumSize: number): Promise<string> {
        const artistImageUrl: string = await this.fanartApi.getArtistThumbnailAsync(musicBrainzId);

        return await this.resizeArtistImageAsync(artistImageUrl, maximumSize);
    }

    private async resizeArtistImageAsync(artistImageUrl: string, maximumSize: number): Promise<string> {
        const artistImageAsBuffer: Buffer = await this.imageProcessor.convertOnlineImageToBufferAsync(artistImageUrl);
        const resizedArtistImageAsBuffer: Buffer = await this.imageProcessor.toResizedJpegBufferAsync(
            artistImageAsBuffer,
            maximumSize,
            maximumSize,
            80,
        );

        return this.imageProcessor.convertBufferToImageUrl(resizedArtistImageAsBuffer);
    }
}
