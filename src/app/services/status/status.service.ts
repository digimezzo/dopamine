import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Scheduler } from '../../core/scheduler/scheduler';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseStatusService } from './base-status.service';
import { StatusMessage } from './status-message';
import { StatusMessageFactory } from './status-message-factory';

@Injectable({
    providedIn: 'root'
})
export class StatusService implements BaseStatusService {
    constructor(
        private translatorService: BaseTranslatorService,
        private scheduler: Scheduler,
        private statusMessageFactory: StatusMessageFactory) {
    }

    private nonDismissibleStatusMessage: StatusMessage;
    private dismissibleStatusMessages: StatusMessage[] = [];

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

    public async dismissStatusMessageAsync(): Promise<void> {
        await this.scheduler.sleepAsync(1000);
        this.nonDismissibleStatusMessage = undefined;

        this.sendCurrentStatusMessage();
    }

    public dismissGivenStatusMessage(statusMessageToDismiss: StatusMessage): void {
        if (this.dismissibleStatusMessages.includes(statusMessageToDismiss)) {
            this.dismissibleStatusMessages.splice(this.dismissibleStatusMessages.indexOf(statusMessageToDismiss), 1);
        }

        this.sendCurrentStatusMessage();
    }

    private createStatusMessage(message: string, isDismissible: boolean): void {
        if (isDismissible) {
            const dismissibleStatusMessage: StatusMessage = this.statusMessageFactory.createDismissible(message);
            this.dismissibleStatusMessages.unshift(dismissibleStatusMessage);
        } else {
            const nonDismissibleStatusMessage: StatusMessage = this.statusMessageFactory.createNonDismissible(message);
            this.nonDismissibleStatusMessage = nonDismissibleStatusMessage;
        }

        this.sendCurrentStatusMessage();
    }

    private sendCurrentStatusMessage(): void {
        this.statusMessage.next(this.getCurrentStatusMessage());
    }

    public getCurrentStatusMessage(): StatusMessage {
        if (this.nonDismissibleStatusMessage != undefined) {
            return this.nonDismissibleStatusMessage;
        } else if (this.dismissibleStatusMessages.length > 0) {
            return this.dismissibleStatusMessages[0];
        }

        return undefined;
    }
}
