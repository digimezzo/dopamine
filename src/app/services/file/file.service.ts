import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { FileValidator } from '../../common/file-validator';
import { BaseApplication } from '../../common/io/base-application';
import { Logger } from '../../common/logger';
import { BasePlaybackService } from '../playback/base-playback.service';
import { TrackModel } from '../track/track-model';
import { TrackModelFactory } from '../track/track-model-factory';
import { BaseFileService } from './base-file.service';

@Injectable()
export class FileService implements BaseFileService {
    private subscription: Subscription = new Subscription();

    constructor(
        private playbackService: BasePlaybackService,
        private trackModelFactory: TrackModelFactory,
        private application: BaseApplication,
        private fileValidator: FileValidator,
        private logger: Logger
    ) {
        this.subscription.add(
            this.application.argumentsReceived$.subscribe((argv: string[]) => {
                if (this.hasPlayableFilesAsGivenParameters(argv)) {
                    this.enqueueGivenParameterFilesAsync(argv);
                }
            })
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
        this.logger.info(`Found parameters: ${safeParameters.join(', ')}`, 'FileService', 'enqueueParameterFilesAsync');

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
        } catch (e) {
            this.logger.error(
                `Could not enqueue given parameter files. Error: ${e.message}`,
                'FileService',
                'enqueueGivenParameterFilesAsync'
            );
        }
    }
}
