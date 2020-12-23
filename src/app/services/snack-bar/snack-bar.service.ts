import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';
import { SnackBarComponent } from '../../components/snack-bar/snack-bar.component';
import { ProductInformation } from '../../core/base/product-information';
import { Scheduler } from '../../core/scheduler/scheduler';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseSnackBarService } from './base-snack-bar.service';

@Injectable({
    providedIn: 'root'
})
export class SnackBarService implements BaseSnackBarService {
    private currentDismissibleSnackBar: MatSnackBarRef<SnackBarComponent> = undefined;

    constructor(
        private zone: NgZone,
        private matSnackBar: MatSnackBar,
        private translatorService: BaseTranslatorService,
        private scheduler: Scheduler) {
    }

    public async folderAlreadyAddedAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('SnackBarMessages.FolderAlreadyAdded');
        this.showSelfClosingSnackBar('las la-folder', message);
    }

    public async newVersionAvailable(version: string): Promise<void> {
        const message: string = await this.translatorService.getAsync(
            'SnackBarMessages.ClickHereToDownloadNewVersion',
            { version: version }
        );

        this.showDismissibleSnackBar('las la-download', false, message, true, ProductInformation.releasesDownloadUrl);
    }

    public async refreshing(): Promise<void> {
        const message: string = await this.translatorService.getAsync('SnackBarMessages.Refreshing');
        this.showDismissibleSnackBar('las la-sync', true, message, false, '');
    }

    public async removingTracksAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('SnackBarMessages.RemovingTracks');
        this.showDismissibleSnackBar('las la-sync', true, message, false, '');
    }

    public async updatingTracksAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('SnackBarMessages.UpdatingTracks');
        this.showDismissibleSnackBar('las la-sync', true, message, false, '');
    }

    public async addedTracksAsync(numberOfAddedTracks: number, percentageOfAddedTracks: number): Promise<void> {
        const message: string = await this.translatorService.getAsync(
            'SnackBarMessages.AddedTracks',
            {
                numberOfAddedTracks: numberOfAddedTracks,
                percentageOfAddedTracks: percentageOfAddedTracks
            });

        this.showDismissibleSnackBar('las la-sync', true, message, false, '');
    }


    public async updatingAlbumArtworkAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('SnackBarMessages.UpdatingAlbumArtwork');
        this.showDismissibleSnackBar('las la-sync', true, message, false, '');
    }

    private showSelfClosingSnackBar(icon: string, message: string): void {
        this.zone.run(() => {
            this.matSnackBar.openFromComponent(SnackBarComponent, {
                data: { icon: icon, message: message, showCloseButton: false },
                panelClass: ['accent-snack-bar'],
                duration: this.calculateDuration(message)
            });
        });
    }

    public async dismissAsync(): Promise<void> {
        if (this.currentDismissibleSnackBar != undefined) {
            this.currentDismissibleSnackBar.dismiss();
            this.currentDismissibleSnackBar = undefined;
        }
    }

    public async dismissDelayedAsync(): Promise<void> {
        await this.scheduler.sleepAsync(1000);
        await this.dismissAsync();
    }

    private showDismissibleSnackBar(icon: string, animateIcon: boolean, message: string, showCloseButton: boolean, url: string): void {
        this.zone.run(() => {
            if (this.currentDismissibleSnackBar == undefined) {
                this.currentDismissibleSnackBar = this.matSnackBar.openFromComponent(SnackBarComponent, {
                    data: { icon: icon, animateIcon: animateIcon, message: message, showCloseButton: showCloseButton, url: url },
                    panelClass: ['accent-snack-bar']
                });
            } else {
                this.currentDismissibleSnackBar.instance.data.icon = icon;
                this.currentDismissibleSnackBar.instance.data.animateIcon = animateIcon;
                this.currentDismissibleSnackBar.instance.data.message = message;
                this.currentDismissibleSnackBar.instance.data.showCloseButton = showCloseButton;
                this.currentDismissibleSnackBar.instance.data.url = url;
            }
        });
    }

    private calculateDuration(message: string): number {
        // See: https://ux.stackexchange.com/questions/11203/how-long-should-a-temporary-notification-toast-appear
        // We assume a safe reading speed of 150 words per minute and an average of 5.8 characters per word in the English language.
        // Then, approx. 1 character is read every 70 milliseconds. Adding a margin of 30 milliseconds, gives us 100 ms.
        return Math.min(Math.max(message.length * 100, 2000), 7000);
    }
}
