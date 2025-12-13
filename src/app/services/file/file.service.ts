import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Logger } from '../../common/logger';
import { PromiseUtils } from '../../common/utils/promise-utils';
import { TrackModel } from '../track/track-model';
import { TrackModelFactory } from '../track/track-model-factory';
import { FileServiceBase } from './file.service.base';
import { PlaybackService } from '../playback/playback.service';
import { EventListenerServiceBase } from '../event-listener/event-listener.service.base';
import { ApplicationBase } from '../../common/io/application.base';
import { FileValidator } from '../../common/validation/file-validator';
import { SettingsBase } from '../../common/settings/settings.base';
import { IpcProxyBase } from '../../common/io/ipc-proxy.base';
import { FileAccessBase } from '../../common/io/file-access.base';

@Injectable()
export class FileService implements FileServiceBase {
    private subscription: Subscription = new Subscription();

    public constructor(
        private playbackService: PlaybackService,
        private eventListenerService: EventListenerServiceBase,
        private trackModelFactory: TrackModelFactory,
        private application: ApplicationBase,
        private fileValidator: FileValidator,
        private fileAccess: FileAccessBase,
        private ipcProxy: IpcProxyBase,
        private settings: SettingsBase,
        private logger: Logger,
    ) {
        this.subscription.add(
            this.eventListenerService.argumentsReceived$.subscribe((argv: string[]) => {
                this.ipcProxy.sendToMainProcess('clear-file-queue', undefined);
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
        const parameters: string[] = this.getAllParameters();

        return this.hasPlayableFilesAsGivenParameters(parameters);
    }

    public async enqueueParameterFilesAsync(): Promise<void> {
        const parameters: string[] = this.getAllParameters();
        this.ipcProxy.sendToMainProcess('clear-file-queue', undefined);
        await this.enqueueGivenParameterFilesAsync(parameters);
    }

    private hasPlayableFilesAsGivenParameters(parameters: string[]): boolean {
        this.logger.info(`Found parameters: ${parameters.join(', ')}`, 'FileService', 'hasPlayableFilesAsGivenParameters');

        for (const parameter of parameters) {
            if (this.fileValidator.isPlayableAudioFile(parameter)) {
                return true;
            }
        }

        return false;
    }

    private async enqueueGivenParameterFilesAsync(parameters: string[]): Promise<void> {
        this.logger.info(`Found parameters: ${parameters.join(', ')}`, 'FileService', 'enqueueGivenParameterFilesAsync');

        try {
            const trackModels: TrackModel[] = [];

            const albumKeyIndex = this.settings.albumKeyIndex;

            const playableAudioFilesInDirectoryOrder = this.getPlayableAudioFilesInDirectoryOrder(parameters);

            for (const file of playableAudioFilesInDirectoryOrder) {
                if (this.fileValidator.isPlayableAudioFile(file)) {
                    const trackModel: TrackModel = await this.trackModelFactory.createFromFileAsync(file, albumKeyIndex);
                    trackModels.push(trackModel);
                }
            }

            if (trackModels.length > 0) {
                await this.playbackService.enqueueAndPlayTracksAsync(trackModels);
            }
        } catch (e: unknown) {
            this.logger.error(e, 'Could not enqueue given parameter files', 'FileService', 'enqueueGivenParameterFilesAsync');
        }
    }

    private getAllParameters(): string[] {
        const parameters: string[] = this.application.getParameters();
        this.logger.info(`Parameters: ${parameters.join(', ')}`, 'FileService', 'getAllParameters');
        const fileQueue: string[] = this.application.getGlobal('fileQueue') as string[];
        this.logger.info(`File queue: ${fileQueue.join(', ')}`, 'FileService', 'getAllParameters');
        parameters.push(...fileQueue);

        return parameters;
    }

    private getPlayableAudioFiles(files: string[]): string[] {
        const playableAudioFiles: string[] = [];

        for (const file of files) {
            if (this.fileValidator.isPlayableAudioFile(file)) {
                playableAudioFiles.push(file);
            }
        }

        return playableAudioFiles;
    }

    private getPlayableAudioFilesInDirectoryOrder(files: string[]): string[] {
        const playableAudioFiles: string[] = this.getPlayableAudioFiles(files);

        // Assume all files are in the same directory
        const directory: string = this.fileAccess.getDirectoryPath(playableAudioFiles[0]);
        const directoryFiles: string[] = this.fileAccess.getFilesInDirectory(directory);

        // Sort the files to match the order in the directory
        playableAudioFiles.sort((a, b) => {
            return directoryFiles.indexOf(a) - directoryFiles.indexOf(b);
        });

        return playableAudioFiles;
    }
}
