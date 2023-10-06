import { Injectable } from '@angular/core';
import { Constants } from '../../common/application/constants';

@Injectable()
export class ItemSpaceCalculator {
    public calculateNumberOfItemsPerRow(itemWidth: number | undefined, availableWidth: number | undefined): number {
        if (itemWidth == undefined) {
            return 0;
        }

        if (itemWidth === 0) {
            return 0;
        }

        if (availableWidth == undefined) {
            return 0;
        }

        if (availableWidth === 0) {
            return 0;
        }

        const numberOfItemsPerRow: number = Math.floor((availableWidth - 20) / (itemWidth + Constants.itemMarginInPixels * 2));

        return numberOfItemsPerRow;
    }
}
