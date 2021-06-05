import { Injectable } from '@angular/core';

@Injectable()
export class Hacks {
    /**
     * Removes all visible tooltips
     */
    public removeTooltips(): void {
        while (document.getElementsByTagName('mat-tooltip-component').length > 0) {
            document.getElementsByTagName('mat-tooltip-component')[0].remove();
        }
    }
}
