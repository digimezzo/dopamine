import { Injectable } from '@angular/core';
import { FileSystem } from '../../core/io/file-system';
import { Track } from '../../data/entities/track';
import { BaseTrackRepository } from '../../data/repositories/base-track-repository';

@Injectable({
    providedIn: 'root'
})
export class TrackUpdater {
    constructor(private trackRepository: BaseTrackRepository, private fileSystem: FileSystem) { }

    public async updateTracksThatAreOutOfDateAsync(): Promise<void> {
        const tracks: Track[] = this.trackRepository.getTracks();

        for (const track of tracks) {
            if (await this.isTrackOutOfDateAsync(track)) {
                this.trackRepository.updateTrack(track);
            }
        }
    }

    private async isTrackOutOfDateAsync(track: Track): Promise<boolean> {
        if (track.fileSize === 0) {
            return true;
        }

        if (track.fileSize !== this.fileSystem.getFilesizeInBytes(track.path)) {
            return true;
        }

        if (track.dateFileModified !== await this.fileSystem.getDateModifiedInTicksAsync(track.path)) {
            return true;
        }

        return false;
    }
}
