import { Injectable } from '@angular/core';
import { FileFormats } from '../../common/application/file-formats';
import { Track } from '../../common/data/entities/track';
import { BaseRemoteProxy } from '../../common/io/base-remote-proxy';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { TrackFiller } from '../indexing/track-filler';
import { BasePlaybackService } from '../playback/base-playback.service';
import { TrackModel } from '../track/track-model';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseFileService } from './base-file.service';

@Injectable()
export class FileService implements BaseFileService {
    // private subscription: Subscription = new Subscription();

    constructor(
        private playbackService: BasePlaybackService,
        private translatorService: BaseTranslatorService,
        private trackFiller: TrackFiller,
        private fileSystem: FileSystem,
        private remoteProxy: BaseRemoteProxy,
        private logger: Logger
    ) {
        // this.subscription.add(
        //     this.remoteProxy.argumentsReceived$.subscribe((argv: string[]) => {
        //         if (this.hasPlayableFilesAsGivenParameters(argv)) {
        //             this.enqueueGivenParameterFilesAsync(argv);
        //         }
        //     })
        // );
    }

    public hasPlayableFilesAsParameters(): boolean {
        const parameters: string[] = this.remoteProxy.getParameters();

        return this.hasPlayableFilesAsGivenParameters(parameters);
    }

    public async enqueueParameterFilesAsync(): Promise<void> {
        const parameters: string[] = this.remoteProxy.getParameters();
        await this.enqueueGivenParameterFilesAsync(parameters);
    }

    private isSupportedAudioFile(filePath: string): boolean {
        const fileExtension: string = this.fileSystem.getFileExtension(filePath);

        if (FileFormats.supportedAudioExtensions.includes(fileExtension.toLowerCase())) {
            return true;
        }

        return false;
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
            if (this.isSupportedAudioFile(safeParameter)) {
                return true;
            }
        }

        return false;
    }

    private async enqueueGivenParameterFilesAsync(parameters: string[]): Promise<void> {
        const safeParameters: string[] = this.getSafeParameters(parameters);
        this.logger.info(`Found parameters: ${safeParameters.join(', ')}`, 'FileService', 'enqueueParameterFilesAsync');

        const trackModels: TrackModel[] = [];

        for (const safeParameter of safeParameters) {
            if (this.isSupportedAudioFile(safeParameter)) {
                const track: Track = new Track(safeParameter);
                await this.trackFiller.addFileMetadataToTrackAsync(track);
                trackModels.push(new TrackModel(track, this.translatorService));
            }
        }

        if (trackModels.length > 0) {
            this.playbackService.enqueueAndPlayTracks(trackModels, trackModels[0]);
        }
    }
}
