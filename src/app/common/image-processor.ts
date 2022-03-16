import { Injectable } from '@angular/core';
import * as fs from 'fs-extra';
import fetch from 'node-fetch';
import { BaseFileSystem } from './io/base-file-system';

@Injectable()
export class ImageProcessor {
    public constructor(private fileSystem: BaseFileSystem) {}

    public async convertImageBufferToFileAsync(imageBuffer: Buffer, imagePath: string): Promise<void> {
        await fs.writeFile(imagePath, imageBuffer);
    }

    public async convertLocalImageToBufferAsync(imagePath: string): Promise<Buffer> {
        const imageBuffer: Buffer = await this.fileSystem.getFileContentAsBufferAsync(imagePath);

        return imageBuffer;
    }

    public async convertOnlineImageToBufferAsync(imageUrl: string): Promise<Buffer> {
        const response: Response = await fetch(imageUrl);
        const imageArrayBuffer: ArrayBuffer = await response.arrayBuffer();
        const imageBuffer: Buffer = Buffer.from(imageArrayBuffer);

        return imageBuffer;
    }

    public convertBufferToImageUrl(imageBuffer: Buffer): string {
        return 'data:image/png;base64,' + imageBuffer.toString('base64');
    }
}
