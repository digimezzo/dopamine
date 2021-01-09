import { Injectable } from '@angular/core';
import * as fs from 'fs-extra';
import fetch from 'node-fetch';
@Injectable()
export class ImageProcessor {
    public async convertImageBufferToFileAsync(imageBuffer: Buffer, imagePath: string): Promise<void> {
        await fs.writeFile(imagePath, imageBuffer);
    }

    public async convertLocalImageToBufferAsync(imagePath: string): Promise<Buffer> {
        const imageBuffer: Buffer = await fs.readFile(imagePath);

        return imageBuffer;
    }

    public async convertOnlineImageToBufferAsync(imageUrl: string): Promise<Buffer> {
        const response: Response = await fetch(imageUrl);
        const imageArrayBuffer: ArrayBuffer = await response.arrayBuffer();
        const imageBuffer: Buffer = Buffer.from(imageArrayBuffer);

        return imageBuffer;
    }
}
