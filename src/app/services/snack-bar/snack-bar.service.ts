import { SnackBar } from './snack-bar';
import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Translator } from '../translator/translator';

@Injectable({
    providedIn: 'root'
})
export class SnackBarService implements SnackBar {
    constructor(private zone: NgZone, private matSnackBar: MatSnackBar, private translator: Translator) {
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
