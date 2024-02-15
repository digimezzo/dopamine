import { Injectable } from '@angular/core';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { SchedulerBase } from '../../common/scheduling/scheduler.base';
import { Observable, Subject } from 'rxjs';
import { NotificationData } from './notification-data';
import { NotificationServiceBase } from './notification.service.base';

@Injectable()
export class NotificationService implements NotificationServiceBase {
    private _notificationData: NotificationData | undefined;

    private showNotification: Subject<NotificationData> = new Subject();
    private dismissNotification: Subject<void> = new Subject();

    public constructor(
        private translatorService: TranslatorServiceBase,
        private scheduler: SchedulerBase,
    ) {}

    public get hasNotificationData(): boolean {
        return this._notificationData != undefined;
    }

    public get notificationData(): NotificationData | undefined {
        return this._notificationData;
    }

    public showNotification$: Observable<NotificationData> = this.showNotification.asObservable();
    public dismissNotification$: Observable<void> = this.dismissNotification.asObservable();

    public async folderAlreadyAddedAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('folder-already-added');
        await this.showSelfClosingNotificationAsync('las la-folder', message, false);
    }

    public async refreshing(): Promise<void> {
        const message: string = await this.translatorService.getAsync('refreshing');
        this.showDismissibleNotification('las la-sync', message, true, false);
    }

    public async removingTracksAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('removing-tracks');
        this.showDismissibleNotification('las la-sync', message, true, false);
    }

    public async updatingTracksAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('updating-tracks');
        this.showDismissibleNotification('las la-sync', message, true, false);
    }

    public async addedTracksAsync(numberOfAddedTracks: number, percentageOfAddedTracks: number): Promise<void> {
        const message: string = await this.translatorService.getAsync('added-tracks', {
            numberOfAddedTracks: numberOfAddedTracks,
            percentageOfAddedTracks: percentageOfAddedTracks,
        });

        this.showDismissibleNotification('las la-sync', message, true, false);
    }

    public async updatingAlbumArtworkAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('updating-album-artwork');
        this.showDismissibleNotification('las la-sync', message, true, false);
    }

    public async singleTrackAddedToPlaylistAsync(playlistName: string): Promise<void> {
        const message: string = await this.translatorService.getAsync('single-track-added-to-playlist', {
            playlistName: playlistName,
        });

        await this.showSelfClosingNotificationAsync('las la-check', message, false);
    }

    public async multipleTracksAddedToPlaylistAsync(playlistName: string, numberOfAddedTracks: number): Promise<void> {
        const message: string = await this.translatorService.getAsync('multiple-tracks-added-to-playlist', {
            playlistName: playlistName,
            numberOfAddedTracks: numberOfAddedTracks,
        });

        await this.showSelfClosingNotificationAsync('las la-check', message, false);
    }

    public async singleTrackAddedToPlaybackQueueAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('single-track-added-to-playback-queue');
        await this.showSelfClosingNotificationAsync('las la-check', message, false);
    }

    public async multipleTracksAddedToPlaybackQueueAsync(numberOfAddedTracks: number): Promise<void> {
        const message: string = await this.translatorService.getAsync('multiple-tracks-added-to-playback-queue', {
            numberOfAddedTracks: numberOfAddedTracks,
        });
        await this.showSelfClosingNotificationAsync('las la-check', message, false);
    }

    public async lastFmLoginFailedAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('last-fm-login-failed');
        await this.showSelfClosingNotificationAsync('las la-frown', message, false);
    }

    public dismiss(): void {
        this._notificationData = undefined;
        this.dismissNotification.next();
    }

    public async dismissDelayedAsync(): Promise<void> {
        await this.scheduler.sleepAsync(1000);
        this.dismiss();
    }

    private showDismissibleNotification(icon: string, message: string, animateIcon: boolean, showCloseButton: boolean): void {
        this._notificationData = new NotificationData(icon, message, animateIcon, showCloseButton);
        this.showNotification.next(this._notificationData);
    }

    private async showSelfClosingNotificationAsync(icon: string, message: string, animateIcon: boolean): Promise<void> {
        this._notificationData = new NotificationData(icon, message, animateIcon, false);
        this.showNotification.next(this._notificationData);
        await this.scheduler.sleepAsync(this.calculateDuration(message));
        this.dismiss();
    }

    private calculateDuration(message: string): number {
        // See: https://ux.stackexchange.com/questions/11203/how-long-should-a-temporary-notification-toast-appear
        // We assume a safe reading speed of 150 words per minute and an average of 5.8 characters per word in the English language.
        // Then, approx. 1 character is read every 70 milliseconds. Adding a margin of 30 milliseconds, gives us 100 ms.
        return Math.min(Math.max(message.length * 100, 2000), 7000);
    }
}
