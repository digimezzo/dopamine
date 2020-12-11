import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SnackBarComponent } from '../../components/snack-bar/snack-bar.component';
import { ProductInformation } from '../../core/base/product-information';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseSnackbarService } from './base-snack-bar.service';

@Injectable({
    providedIn: 'root'
})
export class SnackBarService implements BaseSnackbarService {
    constructor(private zone: NgZone, private matSnackBar: MatSnackBar, private translator: BaseTranslatorService) {
    }

    public async folderAlreadyAddedAsync(): Promise<void> {
        const message: string = await this.translator.getAsync('SnackBarMessages.FolderAlreadyAdded');
        this.showSelfClosingSnackBar('las la-folder', message);
    }

    public async newVersionAvailable(version: string): Promise<void> {
        const message: string = await this.translator.getAsync('SnackBarMessages.ClickHereToDownloadNewVersion', { version: version });
        this.showManuallyClosableSnackBar('las la-download', message, ProductInformation.releasesDownloadUrl);
    }

    private showSelfClosingSnackBar(icon: string, message: string): void {
        this.zone.run(() => {
            this.matSnackBar.openFromComponent(SnackBarComponent, {
                data: { icon: icon, message: message, showCloseButton: false },
                panelClass: ['accent-snackbar'],
                duration: this.calculateDuration(message)
            });
        });
    }

    private showManuallyClosableSnackBar(icon: string, message: string, url: string): void {
        this.zone.run(() => {
            this.matSnackBar.openFromComponent(SnackBarComponent, {
                data: { icon: icon, message: message, showCloseButton: true, url: url },
                panelClass: ['accent-snackbar']
            });
        });
    }

    private calculateDuration(message: string): number {
        // See: https://ux.stackexchange.com/questions/11203/how-long-should-a-temporary-notification-toast-appear
        // We assume a safe reading speed of 150 words per minute and an average of 5.8 characters per word in the English language.
        // Then, approx. 1 character is read every 70 milliseconds. Adding a margin of 30 milliseconds, gives us 100 ms.
        return Math.min(Math.max(message.length * 100, 2000), 7000);
    }
}
