import { Injectable } from '@angular/core';
import { IStylable } from '../../common/i-stylable';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';

@Injectable()
export class ListItemStyler {
    constructor(private appearanceService: BaseAppearanceService) {}

    public getTextColorClass(stylable: IStylable, isAccentText: boolean, isSecondaryText: boolean): string {
        if (stylable == undefined) {
            return '';
        }

        if (stylable.isSelected && this.appearanceService.shouldOverrideSelectedItemText) {
            return 'selected-item-color';
        } else if (isAccentText || stylable.isPlaying) {
            return 'accent-color';
        } else if (isSecondaryText) {
            return 'secondary-color';
        }

        return '';
    }
}
