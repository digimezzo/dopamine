import { Injectable } from '@angular/core';
import { Track } from '../../common/data/entities/track';
import { BaseFileAccess } from '../../common/io/base-file-access';

@Injectable()
export class TrackVerifier {
    public constructor(private fileAccess: BaseFileAccess) {}

    public isTrackOutOfDate(track: Track): boolean {
        if (track.fileSize === 0) {
            return true;
        }

        if (track.fileSize !== this.fileAccess.getFileSizeInBytes(track.path)) {
            return true;
        }

        if (track.dateFileModified !== this.fileAccess.getDateModifiedInTicks(track.path)) {
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
