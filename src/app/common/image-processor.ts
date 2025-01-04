import { Injectable } from '@angular/core';
import fetch from 'node-fetch';
import { FileAccessBase } from './io/file-access.base';
import { nativeImage, NativeImage, Size } from 'electron';
import * as fs from 'fs-extra';
import { Jimp } from 'jimp';

@Injectable()
export class ImageProcessor {
    public constructor(private fileAccess: FileAccessBase) {}

    public async convertImageBufferToFileAsync(imageBuffer: Buffer, imagePath: string): Promise<void> {
        await fs.writeFile(imagePath, imageBuffer);
    }

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
        return 'data:image/jpg;base64,' + imageBuffer.toString('base64');
    }

    public async toResizedJpegBufferAsync(imageBuffer: Buffer, maxWidth: number, maxHeight: number, jpegQuality: number): Promise<Buffer> {
        let image: NativeImage = nativeImage.createFromBuffer(imageBuffer);

        // NativeImage is very fast, but only supports PNG and JPG. For other formats, it returns an empty image.
        if (!image.isEmpty()) {
            const imageSize: Size = image.getSize();

            if (imageSize.width > maxWidth || imageSize.height > maxHeight) {
                image = image.resize({ width: maxWidth, height: maxHeight, quality: 'best' });
            }

            return image.toJPEG(jpegQuality);
        }

        // Fallback using Jimp, which is much slower than NativeImage.
        let fallbackImage = await Jimp.read(imageBuffer);
        if (fallbackImage.bitmap.width > maxWidth || fallbackImage.bitmap.height > maxHeight) {
            fallbackImage.resize({ w: maxWidth, h: maxHeight });
        }

        return await fallbackImage.getBuffer('image/jpeg', { quality: jpegQuality });
    }

    public async toJpegBufferAsync(imageBuffer: Buffer, jpegQuality: number): Promise<Buffer> {
        let image: NativeImage = nativeImage.createFromBuffer(imageBuffer);

        // NativeImage is very fast, but only supports PNG and JPG. For other formats, it returns an empty image.
        if (!image.isEmpty()) {
            return image.toJPEG(jpegQuality);
        }

        let fallbackImage = await Jimp.read(imageBuffer);

        return await fallbackImage.getBuffer('image/jpeg', { quality: jpegQuality });
    }
}
