import { Injectable } from '@angular/core';
import fetch from 'node-fetch';
import { FileAccessBase } from './io/file-access.base';
import sharp from 'sharp';

@Injectable()
export class ImageProcessor {
    public constructor(private fileAccess: FileAccessBase) {}

    public async convertLocalImageToBufferAsync(imagePath: string): Promise<Buffer> {
        return await this.fileAccess.getFileContentAsBufferAsync(imagePath);
    }

    public async convertOnlineImageToBufferAsync(imageUrl: string): Promise<Buffer> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const response: Response = (await fetch(imageUrl)) as Response;
        const imageArrayBuffer: ArrayBuffer = await response.arrayBuffer();
        return Buffer.from(imageArrayBuffer);
    }

    public convertBufferToImageUrl(imageBuffer: Buffer): string {
        return 'data:image/png;base64,' + imageBuffer.toString('base64');
    }

    public async resizeImageAsync(imageBuffer: Buffer, maxWidth: number, maxHeight: number, jpegQuality: number): Promise<Buffer> {
        return await sharp(imageBuffer)
            .resize(maxWidth, maxHeight)
            .jpeg({
                quality: jpegQuality,
            })
            .toBuffer();
    }
}
