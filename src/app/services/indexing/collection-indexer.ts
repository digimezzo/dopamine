import { Injectable } from '@angular/core';
import { TrackRemover } from './track-remover';
import { TrackUpdater } from './track-updater';

@Injectable({
    providedIn: 'root'
})
export class CollectionIndexer {
    constructor(
        private trackRemover: TrackRemover,
        private trackUpdater: TrackUpdater
        ) { }

    public async indexCollectionAsync(): Promise<void> {
        this.trackRemover.removeTracksThatDoNoNotBelongToFolders();
        this.trackRemover.removeTracksThatAreNotFoundOnDisk();
        this.trackUpdater.updateTracksThatAreOutOfDate();
    }
}
