import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Logger } from '../../common/logger';
import { PromiseUtils } from '../../common/utils/promise-utils';
import { TrackModel } from '../track/track-model';
import { TrackModelFactory } from '../track/track-model-factory';
import { FileServiceBase } from './file.service.base';
import { PlaybackServiceBase } from '../playback/playback.service.base';
import { EventListenerServiceBase } from '../event-listener/event-listener.service.base';
import { ApplicationBase } from '../../common/io/application.base';
import { FileValidator } from '../../common/validation/file-validator';

@Injectable()
export class FileService implements FileServiceBase {
    private subscription: Subscription = new Subscription();

    public constructor(
        private playbackService: PlaybackServiceBase,
        private eventListenerService: EventListenerServiceBase,
        private trackModelFactory: TrackModelFactory,
        private application: ApplicationBase,
        private fileValidator: FileValidator,
        private logger: Logger,
    ) {
        this.subscription.add(
            this.eventListenerService.argumentsReceived$.subscribe((argv: string[]) => {
                if (this.hasPlayableFilesAsGivenParameters(argv)) {
                    PromiseUtils.noAwait(this.enqueueGivenParameterFilesAsync(argv));
                }
            }),
        );

        this.subscription.add(
            this.eventListenerService.filesDropped$.subscribe((filePaths: string[]) => {
                PromiseUtils.noAwait(this.enqueueGivenParameterFilesAsync(filePaths));
            }),
        );
    }

    public hasPlayableFilesAsParameters(): boolean {
        const parameters: string[] = this.application.getParameters();

        return this.hasPlayableFilesAsGivenParameters(parameters);
    }

    public async enqueueParameterFilesAsync(): Promise<void> {
        const parameters: string[] = this.application.getParameters();
        await this.enqueueGivenParameterFilesAsync(parameters);
    }

    private getSafeParameters(parameters: string[]): string[] {
        if (parameters != undefined && parameters.length > 0) {
            return parameters;
        }

        return [];
    }

    private hasPlayableFilesAsGivenParameters(parameters: string[]): boolean {
        const safeParameters: string[] = this.getSafeParameters(parameters);
        this.logger.info(`Found parameters: ${safeParameters.join(', ')}`, 'FileService', 'hasPlayableFilesAsParameters');

        for (const safeParameter of safeParameters) {
            if (this.fileValidator.isPlayableAudioFile(safeParameter)) {
                return true;
            }
        }

        return false;
    }

    private async enqueueGivenParameterFilesAsync(parameters: string[]): Promise<void> {
        const safeParameters: string[] = this.getSafeParameters(parameters);
        this.logger.info(`Found parameters: ${safeParameters.join(', ')}`, 'FileService', 'enqueueGivenParameterFilesAsync');

        try {
            const trackModels: TrackModel[] = [];

            for (const safeParameter of safeParameters) {
                if (this.fileValidator.isPlayableAudioFile(safeParameter)) {
                    const trackModel: TrackModel = await this.trackModelFactory.createFromFileAsync(safeParameter);
                    trackModels.push(trackModel);
                }
            }

            if (trackModels.length > 0) {
                this.playbackService.enqueueAndPlayTracks(trackModels);
            }
        } catch (e: unknown) {
            this.logger.error(e, 'Could not enqueue given parameter files', 'FileService', 'enqueueGivenParameterFilesAsync');
        }
    }
}
