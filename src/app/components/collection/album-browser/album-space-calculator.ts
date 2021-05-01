import { Injectable } from '@angular/core';
import { Constants } from '../../../core/base/constants';

@Injectable()
export class AlbumSpaceCalculator {
    constructor() {}

    public calculateNumberOfAlbumsPerRow(albumWidth: number, availableWidth: number): number {
        if (albumWidth == undefined) {
            return 0;
        }

        if (albumWidth === 0) {
            return 0;
        }

        if (availableWidth == undefined) {
            return 0;
        }

        if (availableWidth === 0) {
            return 0;
        }

        const numberOfAlbumsPerRow: number = Math.floor((availableWidth - 20) / (albumWidth + Constants.albumMarginInPixels * 2));

        return numberOfAlbumsPerRow;
    }
}
