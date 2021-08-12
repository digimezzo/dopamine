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
    constructor(
        private playbackService: BasePlaybackService,
        private translatorService: BaseTranslatorService,
        private trackFiller: TrackFiller,
        private fileSystem: FileSystem,
        private remoteProxy: BaseRemoteProxy,
        private logger: Logger
    ) {}

    public hasPlayableFilesAsParameters(): boolean {
        const parameters: string[] = this.remoteProxy.getParameters();
        this.logger.info(`Found parameters: ${parameters.join(', ')}`, 'FileService', 'hasPlayableFilesAsParameters');

        for (const parameter of parameters) {
            if (this.isSupportedAudioFile(parameter)) {
                return true;
            }
        }

        return false;
    }

    public async enqueueParameterFilesAsync(): Promise<void> {
        const parameters: string[] = this.remoteProxy.getParameters();
        this.logger.info(`Found parameters: ${parameters.join(', ')}`, 'FileService', 'enqueueParameterFilesAsync');

        const trackModels: TrackModel[] = [];

        for (const parameter of parameters) {
            if (this.isSupportedAudioFile(parameter)) {
                const track: Track = new Track(parameter);
                await this.trackFiller.addFileMetadataToTrackAsync(track);
                trackModels.push(new TrackModel(track, this.translatorService));
            }
        }

        if (trackModels.length > 0) {
            this.playbackService.enqueueAndPlayTracks(trackModels, trackModels[0]);
        }
    }

    private isSupportedAudioFile(filePath: string): boolean {
        const fileExtension: string = this.fileSystem.getFileExtension(filePath);

        if (FileFormats.supportedAudioExtensions.includes(fileExtension.toLowerCase())) {
            return true;
        }

        return false;
    }
}
