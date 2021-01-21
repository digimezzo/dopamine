import { Injectable } from '@angular/core';
import { FileFormats } from '../../core/base/file-formats';
import { FileSystem } from '../../core/io/file-system';
import { StringCompare } from '../../core/string-compare';
import { Track } from '../../data/entities/track';
import { TrackModel } from '../playback/track-model';
import { BaseTrackService } from './base-track.service';

@Injectable({
    providedIn: 'root',
})
export class TrackService implements BaseTrackService {
    constructor(private fileSystem: FileSystem) {}

    public async getTracksInDirectoryAsync(directoryPath: string): Promise<TrackModel[]> {
        if (StringCompare.isNullOrWhiteSpace(directoryPath)) {
            return [];
        }

        const directoryPathExists: boolean = this.fileSystem.pathExists(directoryPath);

        if (!directoryPathExists) {
            return [];
        }

        const filesInDirectory: string[] = await this.fileSystem.getFilesInDirectoryAsync(directoryPath);

        const trackModels: TrackModel[] = [];

        for (const file of filesInDirectory) {
            const fileExtension: string = this.fileSystem.getFileExtension(file);
            const fileExtensionIsSupported: boolean = FileFormats.supportedAudioExtensions
                .map((x) => x.toLowerCase())
                .includes(fileExtension.toLowerCase());

            if (fileExtensionIsSupported) {
                const track: Track = new Track(file);
                // await this.trackFiller.addFileMetadataToTrackAsync(newTrack);
                const trackModel: TrackModel = new TrackModel(track);
                trackModels.push(trackModel);
            }
        }

        return trackModels;
    }
}
