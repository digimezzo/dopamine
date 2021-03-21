import { Injectable } from '@angular/core';
import { Constants } from '../../core/base/constants';
import { Desktop } from '../../core/io/desktop';

@Injectable()
export class AlbumSpaceCalculator {
    constructor(private desktop: Desktop) {}

    public calculateNumberOfAlbumsPerRow(albumWidthInPixels: number, horizontalSpaceInPercent: number): number {
        if (albumWidthInPixels == undefined) {
            return 0;
        }

        if (albumWidthInPixels === 0) {
            return 0;
        }

        if (horizontalSpaceInPercent == undefined) {
            return 0;
        }

        if (horizontalSpaceInPercent === 0) {
            return 0;
        }

        const windowWidthInPixels: number = this.desktop.getWindowWidth();
        const albumsPaneWidthInPixels: number = (windowWidthInPixels * horizontalSpaceInPercent) / 100;
        const availableWidth: number = albumsPaneWidthInPixels - 50;

        const numberOfAlbumsPerRow: number = Math.floor(availableWidth / (albumWidthInPixels + Constants.albumMarginInPixels * 2));

        return numberOfAlbumsPerRow;
    }
}
