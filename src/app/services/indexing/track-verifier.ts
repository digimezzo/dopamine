import { Injectable } from '@angular/core';
import { FileSystem } from '../../core/io/file-system';
import { Track } from '../../data/entities/track';

@Injectable()
export class TrackVerifier {
    constructor(private fileSystem: FileSystem) {}

    public async isTrackOutOfDateAsync(track: Track): Promise<boolean> {
        if (track.fileSize === 0) {
            return true;
        }

        if (track.fileSize !== (await this.fileSystem.getFilesizeInBytesAsync(track.path))) {
            return true;
        }

        if (track.dateFileModified !== (await this.fileSystem.getDateModifiedInTicksAsync(track.path))) {
            return true;
        }

        return false;
    }

    public doesTrackNeedIndexing(track: Track): boolean {
        if (track.needsIndexing == undefined) {
            return true;
        }

        if (Number.isNaN(track.needsIndexing)) {
            return true;
        }

        if (track.needsIndexing === 1) {
            return true;
        }

        return false;
    }
}
