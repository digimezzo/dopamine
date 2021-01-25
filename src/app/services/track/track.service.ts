import { Injectable } from '@angular/core';
import { FileFormats } from '../../core/base/file-formats';
import { FileSystem } from '../../core/io/file-system';
import { StringCompare } from '../../core/string-compare';
import { Track } from '../../data/entities/track';
import { SubfolderModel } from '../folder/subfolder-model';
import { TrackFiller } from '../indexing/track-filler';
import { BaseTrackService } from './base-track.service';
import { TrackModel } from './track-model';

@Injectable({
    providedIn: 'root',
})
export class TrackService implements BaseTrackService {
    constructor(private fileSystem: FileSystem, private trackFiller: TrackFiller) {}

    public async getTracksInSubfolderAsync(subfolder: SubfolderModel): Promise<TrackModel[]> {
        if (subfolder == undefined) {
            return [];
        }

        if (StringCompare.isNullOrWhiteSpace(subfolder.path)) {
            return [];
        }

        const subfolderPathExists: boolean = this.fileSystem.pathExists(subfolder.path);

        if (!subfolderPathExists) {
            return [];
        }

        const filesInDirectory: string[] = await this.fileSystem.getFilesInDirectoryAsync(subfolder.path);

        const trackModels: TrackModel[] = [];

        for (const file of filesInDirectory) {
            const fileExtension: string = this.fileSystem.getFileExtension(file);
            const fileExtensionIsSupported: boolean = FileFormats.supportedAudioExtensions
                .map((x) => x.toLowerCase())
                .includes(fileExtension.toLowerCase());

            if (fileExtensionIsSupported) {
                const track: Track = new Track(file);
                const filledTrack: Track = await this.trackFiller.addFileMetadataToTrackAsync(track);
                const trackModel: TrackModel = new TrackModel(filledTrack);
                trackModels.push(trackModel);
            }
        }

        return trackModels;
    }
}
