import { Injectable } from '@angular/core';
import { Track } from '../../common/data/entities/track';
import { BaseFileAccess } from '../../common/io/base-file-access';

@Injectable()
export class TrackVerifier {
    constructor(private fileAccess: BaseFileAccess) {}

    public async isTrackOutOfDateAsync(track: Track): Promise<boolean> {
        if (track.fileSize === 0) {
            return true;
        }

        if (track.fileSize !== (await this.fileAccess.getFileSizeInBytesAsync(track.path))) {
            return true;
        }

        if (track.dateFileModified !== (await this.fileAccess.getDateModifiedInTicksAsync(track.path))) {
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
