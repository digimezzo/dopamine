import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Scheduler } from '../../core/scheduler/scheduler';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseStatusService } from './base-status.service';
import { StatusMessage } from './status-message';

@Injectable({
    providedIn: 'root'
})
export class StatusService implements BaseStatusService {
    constructor(private translatorService: BaseTranslatorService, private scheduler: Scheduler) {
    }

    private nonDismissableStatusMessage: StatusMessage;
    private dismissableStatusMessages: StatusMessage[] = [];

    private statusMessage: Subject<StatusMessage> = new Subject<StatusMessage>();
    public statusMessage$: Observable<StatusMessage> = this.statusMessage.asObservable();

    public async removingSongsAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('Status.RemovingSongs');
        this.createStatusMessage(message, false);
    }

    public async updatingSongsAsync(): Promise<void> {
        const message: string = await this.translatorService.getAsync('Status.UpdatingSongs');
        this.createStatusMessage(message, false);
    }

    public async addedSongsAsync(numberOfAddedTracks: number, percentageOfAddedTracks: number): Promise<void> {
        const message: string = await this.translatorService.getAsync(
            'Status.AddedSongs',
            {
                numberOfAddedTracks: numberOfAddedTracks,
                percentageOfAddedTracks: percentageOfAddedTracks
            });

        this.createStatusMessage(message, false);
    }

    public async newVersionAvailableAsync(version: string): Promise<void> {
        const message: string = await this.translatorService.getAsync('Status.NewVersionAvailable', { version: version });
        this.createStatusMessage(message, true);
    }

    public async dismissNonDismissableStatusMessageAsync(): Promise<void> {
        await this.scheduler.sleepAsync(1000);
        this.nonDismissableStatusMessage = undefined;

        this.sendNextStatusMessage();
    }

    public dismissDismissableStatusMessage(statusMessageToDismiss: StatusMessage): void {
        if (this.dismissableStatusMessages.includes(statusMessageToDismiss)) {
            this.dismissableStatusMessages.splice(this.dismissableStatusMessages.indexOf(statusMessageToDismiss), 1);
        }

        this.sendNextStatusMessage();
    }

    private createStatusMessage(message: string, isDismissable: boolean): void {
        const newStatusMessage: StatusMessage = new StatusMessage(message, isDismissable);

        if (newStatusMessage.isDismissable) {
            this.dismissableStatusMessages.unshift(newStatusMessage);
        } else {
            this.nonDismissableStatusMessage = newStatusMessage;
        }

        this.sendNextStatusMessage();
    }

    private sendNextStatusMessage(): void {
        if (this.nonDismissableStatusMessage != undefined) {
            this.statusMessage.next(this.nonDismissableStatusMessage);
        } else if (this.dismissableStatusMessages.length > 0) {
            this.statusMessage.next(this.dismissableStatusMessages[0]);
        } else {
            this.statusMessage.next(undefined);
        }
    }
}
