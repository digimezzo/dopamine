import { SnackbarServiceBase as SnackbarServiceBase } from './snack-bar-service-base';
import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslatorServiceBase } from '../translator/translator-service-base';

@Injectable({
    providedIn: 'root'
})
export class SnackBarService implements SnackbarServiceBase {
    constructor(private zone: NgZone, private matSnackBar: MatSnackBar, private translator: TranslatorServiceBase) {
    }

    public async notifyOfNewVersionAsync(version: string): Promise<void> {
        const message: string = await this.translator.getAsync('SnackBarMessages.NewVersionAvailable', { version: version });
        const action: string = await this.translator.getAsync('SnackBarActions.Ok');
        this.showActionSnackBar(message, action);
    }

    public showActionSnackBar(message: string, action: string): void {
        this.zone.run(() => {
            this.matSnackBar.open(message, action, { panelClass: ['dark-snackbar'] });
        });
    }
}
