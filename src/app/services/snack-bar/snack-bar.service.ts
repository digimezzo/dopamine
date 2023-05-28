import { Injectable, NgZone } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarRef as MatSnackBarRef } from '@angular/material/legacy-snack-bar';
import { Scheduler } from '../../common/scheduling/scheduler';
import { SnackBarComponent } from '../../components/snack-bar/snack-bar.component';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseSnackBarService } from './base-snack-bar.service';

@Injectable()
export class SnackBarService implements BaseSnackBarService {
    private currentDismissibleSnackBar: MatSnackBarRef<SnackBarComponent> = undefined;
    private currentSelfClosingSnackBar: MatSnackBarRef<SnackBarComponent> = undefined;
    private isDismissRequested: boolean = false;

    constructor(
        private zone: NgZone,
        private matSnackBar: MatSnackBar,
        private translatorService: BaseTranslatorService,
        private scheduler: Scheduler
    ) {}

    public async folderAlreadyAddedAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('folder-already-added');
        this.showSelfClosingSnackBar('las la-folder', message);
    }

    public async refreshing(): Promise<void> {
        const message: string = await this.translatorService.getAsync('refreshing');
        this.showDismissibleSnackBar('las la-sync', true, message, false, '');
    }

    public async removingTracksAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('removing-tracks');
        this.showDismissibleSnackBar('las la-sync', true, message, false, '');
    }

    public async updatingTracksAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('updating-tracks');
        this.showDismissibleSnackBar('las la-sync', true, message, false, '');
    }

    public async addedTracksAsync(numberOfAddedTracks: number, percentageOfAddedTracks: number): Promise<void> {
        const message: string = await this.translatorService.getAsync('added-tracks', {
            numberOfAddedTracks: numberOfAddedTracks,
            percentageOfAddedTracks: percentageOfAddedTracks,
        });

        this.showDismissibleSnackBar('las la-sync', true, message, false, '');
    }

    public async updatingAlbumArtworkAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('updating-album-artwork');
        this.showDismissibleSnackBar('las la-sync', true, message, false, '');
    }

    public async singleTrackAddedToPlaylistAsync(playlistName: string): Promise<void> {
        const message: string = await this.translatorService.getAsync('single-track-added-to-playlist', {
            playlistName: playlistName,
        });

        this.showSelfClosingSnackBar('las la-check', message);
    }

    public async multipleTracksAddedToPlaylistAsync(playlistName: string, numberOfAddedTracks: number): Promise<void> {
        const message: string = await this.translatorService.getAsync('multiple-tracks-added-to-playlist', {
            playlistName: playlistName,
            numberOfAddedTracks: numberOfAddedTracks,
        });

        this.showSelfClosingSnackBar('las la-check', message);
    }

    public async singleTrackAddedToPlaybackQueueAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('single-track-added-to-playback-queue');
        this.showSelfClosingSnackBar('las la-check', message);
    }

    public async multipleTracksAddedToPlaybackQueueAsync(numberOfAddedTracks: number): Promise<void> {
        const message: string = await this.translatorService.getAsync('multiple-tracks-added-to-playback-queue', {
            numberOfAddedTracks: numberOfAddedTracks,
        });
        this.showSelfClosingSnackBar('las la-check', message);
    }

    public async lastFmLoginFailedAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('last-fm-login-failed');
        this.showSelfClosingSnackBar('las la-frown', message);
    }

    public async dismissAsync(): Promise<void> {
        if (this.currentDismissibleSnackBar != undefined) {
            this.isDismissRequested = true;
            this.currentDismissibleSnackBar.dismiss();
            this.currentDismissibleSnackBar = undefined;
        }
    }

    public async dismissDelayedAsync(): Promise<void> {
        await this.scheduler.sleepAsync(1000);
        await this.dismissAsync();
    }

    private checkIfDismissWasRequested(): void {
        if (this.isDismissRequested) {
            this.isDismissRequested = false;

            if (this.currentDismissibleSnackBar != undefined) {
                this.currentDismissibleSnackBar.dismiss();
                this.currentDismissibleSnackBar = undefined;
            }
        } else {
            if (this.currentDismissibleSnackBar != undefined) {
                this.currentDismissibleSnackBar = this.matSnackBar.openFromComponent(SnackBarComponent, {
                    data: {
                        icon: this.currentDismissibleSnackBar.instance.data.icon,
                        animateIcon: this.currentDismissibleSnackBar.instance.data.animateIcon,
                        message: this.currentDismissibleSnackBar.instance.data.message,
                        showCloseButton: this.currentDismissibleSnackBar.instance.data.showCloseButton,
                        url: this.currentDismissibleSnackBar.instance.data.url,
                    },
                    panelClass: ['accent-snack-bar'],
                    verticalPosition: 'top',
                });
            }
        }
    }

    private showSelfClosingSnackBar(icon: string, message: string): void {
        this.zone.run(() => {
            this.currentSelfClosingSnackBar = this.matSnackBar.openFromComponent(SnackBarComponent, {
                data: { icon: icon, message: message, showCloseButton: false },
                panelClass: ['accent-snack-bar'],
                verticalPosition: 'top',
                duration: this.calculateDuration(message),
            });

            this.currentSelfClosingSnackBar.afterDismissed().subscribe((info) => {
                this.checkIfDismissWasRequested();
            });
        });
    }

    private showDismissibleSnackBar(icon: string, animateIcon: boolean, message: string, showCloseButton: boolean, url: string): void {
        this.zone.run(() => {
            if (this.currentDismissibleSnackBar == undefined) {
                this.currentDismissibleSnackBar = this.matSnackBar.openFromComponent(SnackBarComponent, {
                    data: { icon: icon, animateIcon: animateIcon, message: message, showCloseButton: showCloseButton, url: url },
                    panelClass: ['accent-snack-bar'],
                    verticalPosition: 'top',
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
