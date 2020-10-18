import { Injectable } from '@angular/core';
import fetch from 'node-fetch';
import * as sharp from 'sharp';

@Injectable()
export class ImageProcessor {
    public async convertImageBufferToFileAsync(imageBuffer: Buffer, imagePath: string): Promise<void> {
        await sharp(imageBuffer).toFile(imagePath);
    }

    public async convertLocalImageToBufferAsync(imagePath: string): Promise<Buffer> {
        const imageBuffer: Buffer = await sharp(imagePath).toBuffer();

        return imageBuffer;
    }

    public async convertOnlineImageToBufferAsync(imageUrl: string): Promise<Buffer> {
        const response: Response = await fetch(imageUrl);
        const imageArrayBuffer: ArrayBuffer = await response.arrayBuffer();
        const imageBuffer: Buffer = Buffer.from(imageArrayBuffer);

        return imageBuffer;
    }
}
