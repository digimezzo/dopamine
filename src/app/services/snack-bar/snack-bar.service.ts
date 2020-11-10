import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SnackBarComponent } from '../../components/snack-bar/snack-bar.component';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseSnackbarService as SnackBarServiceBase } from './base-snack-bar.service';

@Injectable({
    providedIn: 'root'
})
export class SnackBarService implements SnackBarServiceBase {
    constructor(private zone: NgZone, private matSnackBar: MatSnackBar, private translator: BaseTranslatorService) {
    }

    public async notifyFolderAlreadyAddedAsync(): Promise<void> {
        const message: string = await this.translator.getAsync('SnackBarMessages.FolderAlreadyAdded');
        this.showActionLessSnackBar(message);
    }

    private showActionLessSnackBar(message: string): void {
        this.zone.run(() => {
            this.matSnackBar.openFromComponent(SnackBarComponent, {
                data: { icon: 'las la-folder', message: message },
                panelClass: ['accent-snackbar'],
                duration: this.calculateDuration(message)
            });
        });
    }

    // private showActionSnackBar(message: string, action: string, keepOpen: boolean): void {
    //     let config: any = { panelClass: ['accent-snackbar'], duration: this.calculateDuration(message) };

    //     if (keepOpen) {
    //         config = { panelClass: ['accent-snackbar'] };
    //     }

    //     this.matSnackBar.open(message, action, config);
    // }

    private calculateDuration(message: string): number {
        // See: https://ux.stackexchange.com/questions/11203/how-long-should-a-temporary-notification-toast-appear
        // We assume a safe reading speed of 150 words per minute and an average of 5.8 characters per word in the English language.
        // Then, approx. 1 character is read every 70 milliseconds. Adding a margin of 30 milliseconds, gives us 100 ms.
        return Math.min(Math.max(message.length * 100, 2000), 7000);
    }
}
