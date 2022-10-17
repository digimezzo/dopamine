import { Injectable } from '@angular/core';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { IPlayable } from './i-playable';
import { ISelectable } from './i-selectable';

@Injectable()
export class ListItemStyler {
    constructor(private appearanceService: BaseAppearanceService) {}

    public getPlayableColorClass(playable: IPlayable, isAccentText: boolean, isSecondaryText: boolean): string {
        if (playable == undefined) {
            return '';
        }

        if (playable.isSelected && this.appearanceService.shouldOverrideSelectedItemText) {
            return 'selected-item-color';
        } else if (isAccentText || playable.isPlaying) {
            return 'accent-color';
        } else if (isSecondaryText) {
            return 'secondary-color';
        }

        return '';
    }

    public getSelectableColorClass(selectable: ISelectable, isSecondaryText: boolean): string {
        if (selectable == undefined) {
            return '';
        }

        if (selectable.isSelected && this.appearanceService.shouldOverrideSelectedItemText) {
            return 'selected-item-color';
        } else if (isSecondaryText) {
            return 'secondary-color';
        }

        return '';
    }
}
