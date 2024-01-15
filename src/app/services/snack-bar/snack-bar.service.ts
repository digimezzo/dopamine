import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../ui/components/snack-bar/snack-bar.component';
import { SnackBarData } from './snack-bar-data';
import { SnackBarServiceBase } from './snack-bar.service.base';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { SchedulerBase } from '../../common/scheduling/scheduler.base';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SnackBarService implements SnackBarServiceBase {
    private _mustShowNotification: boolean;

    private currentDismissibleSnackBar: MatSnackBarRef<SnackBarComponent> | undefined;
    private currentSelfClosingSnackBar: MatSnackBarRef<SnackBarComponent> | undefined;
    private isDismissRequested: boolean = false;

    private showNotification: Subject<void> = new Subject();
    private dismissNotification: Subject<void> = new Subject();

    public constructor(
        private zone: NgZone,
        private matSnackBar: MatSnackBar,
        private translatorService: TranslatorServiceBase,
        private scheduler: SchedulerBase,
    ) {}

    public get mustShowNotification(): boolean {
        return this._mustShowNotification;
    }

    public showNotification$: Observable<void> = this.showNotification.asObservable();
    public dismissNotification$: Observable<void> = this.dismissNotification.asObservable();

    public async folderAlreadyAddedAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('folder-already-added');
        this.showSelfClosingSnackBar('las la-folder', message, false);
    }

    public async refreshing(): Promise<void> {
        const message: string = await this.translatorService.getAsync('refreshing');
        this.showDismissibleSnackBar('las la-sync', message, true, false);
    }

    public async removingTracksAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('removing-tracks');
        this.showDismissibleSnackBar('las la-sync', message, true, false);
    }

    public async updatingTracksAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('updating-tracks');
        this.showDismissibleSnackBar('las la-sync', message, true, false);
    }

    public async addedTracksAsync(numberOfAddedTracks: number, percentageOfAddedTracks: number): Promise<void> {
        const message: string = await this.translatorService.getAsync('added-tracks', {
            numberOfAddedTracks: numberOfAddedTracks,
            percentageOfAddedTracks: percentageOfAddedTracks,
        });

        this.showDismissibleSnackBar('las la-sync', message, true, false);
    }

    public async updatingAlbumArtworkAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('updating-album-artwork');
        this.showDismissibleSnackBar('las la-sync', message, true, false);
    }

    public async singleTrackAddedToPlaylistAsync(playlistName: string): Promise<void> {
        const message: string = await this.translatorService.getAsync('single-track-added-to-playlist', {
            playlistName: playlistName,
        });

        this.showSelfClosingSnackBar('las la-check', message, false);
    }

    public async multipleTracksAddedToPlaylistAsync(playlistName: string, numberOfAddedTracks: number): Promise<void> {
        const message: string = await this.translatorService.getAsync('multiple-tracks-added-to-playlist', {
            playlistName: playlistName,
            numberOfAddedTracks: numberOfAddedTracks,
        });

        this.showSelfClosingSnackBar('las la-check', message, false);
    }

    public async singleTrackAddedToPlaybackQueueAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('single-track-added-to-playback-queue');
        this.showSelfClosingSnackBar('las la-check', message, false);
    }

    public async multipleTracksAddedToPlaybackQueueAsync(numberOfAddedTracks: number): Promise<void> {
        const message: string = await this.translatorService.getAsync('multiple-tracks-added-to-playback-queue', {
            numberOfAddedTracks: numberOfAddedTracks,
        });
        this.showSelfClosingSnackBar('las la-check', message, false);
    }

    public async lastFmLoginFailedAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('last-fm-login-failed');
        this.showSelfClosingSnackBar('las la-frown', message, false);
    }

    public dismiss(): void {
        // if (this.currentDismissibleSnackBar != undefined) {
        //     this.isDismissRequested = true;
        //     this.currentDismissibleSnackBar.dismiss();
        //     this.currentDismissibleSnackBar = undefined;
        // }

        this._mustShowNotification = false;
        this.dismissNotification.next();
    }

    public async dismissDelayedAsync(): Promise<void> {
        await this.scheduler.sleepAsync(1000);
        this.dismiss();
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
                    data: this.currentDismissibleSnackBar.instance.data,
                    panelClass: ['accent-snack-bar'],
                    verticalPosition: 'top',
                });
            }
        }
    }

    private showSelfClosingSnackBar(icon: string, message: string, animateIcon: boolean): void {
        this.zone.run(() => {
            this.currentSelfClosingSnackBar = this.matSnackBar.openFromComponent(SnackBarComponent, {
                data: new SnackBarData(icon, message, animateIcon, false),
                panelClass: ['accent-snack-bar'],
                verticalPosition: 'top',
                duration: this.calculateDuration(message),
            });

            this.currentSelfClosingSnackBar.afterDismissed().subscribe(() => {
                this.checkIfDismissWasRequested();
            });
        });
    }

    private showDismissibleSnackBar(icon: string, message: string, animateIcon: boolean, showCloseButton: boolean): void {
        // this.zone.run(() => {
        //     if (this.currentDismissibleSnackBar == undefined) {
        //         this.currentDismissibleSnackBar = this.matSnackBar.openFromComponent(SnackBarComponent, {
        //             data: new SnackBarData(icon, message, animateIcon, showCloseButton),
        //             panelClass: ['accent-snack-bar'],
        //             verticalPosition: 'top',
        //         });
        //     } else {
        //         this.currentDismissibleSnackBar.instance.data = new SnackBarData(icon, message, animateIcon, showCloseButton);
        //     }
        // });
        this._mustShowNotification = true;
        this.showNotification.next();
    }

    private calculateDuration(message: string): number {
        // See: https://ux.stackexchange.com/questions/11203/how-long-should-a-temporary-notification-toast-appear
        // We assume a safe reading speed of 150 words per minute and an average of 5.8 characters per word in the English language.
        // Then, approx. 1 character is read every 70 milliseconds. Adding a margin of 30 milliseconds, gives us 100 ms.
        return Math.min(Math.max(message.length * 100, 2000), 7000);
    }
}
