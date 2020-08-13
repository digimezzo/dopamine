import { Injectable } from '@angular/core';
import * as sharp from 'sharp';

@Injectable()
export class ImageProcessor {
    public async saveDataToFile(data: Buffer, imagePath: string): Promise<void> {
        await sharp(data).toFile(imagePath);
    }
}
