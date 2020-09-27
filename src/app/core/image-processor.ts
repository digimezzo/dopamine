import { Injectable } from '@angular/core';
import * as sharp from 'sharp';

@Injectable()
export class ImageProcessor {
    public async convertDataToFileAsync(data: Buffer, imagePath: string): Promise<void> {
        await sharp(data).toFile(imagePath);
    }

    public async convertFileToDataAsync(imagePath: string): Promise<Buffer> {
        const data: Buffer = await sharp(imagePath).toBuffer();

        return data;
    }
}
