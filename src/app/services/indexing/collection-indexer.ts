import { Injectable } from '@angular/core';
import { TrackAdder } from './track-adder';
import { TrackRemover } from './track-remover';
import { TrackUpdater } from './track-updater';

@Injectable({
    providedIn: 'root'
})
export class CollectionIndexer {
    constructor(
        private trackRemover: TrackRemover,
        private trackUpdater: TrackUpdater,
        private trackAdder: TrackAdder
    ) { }

    public async indexCollectionAsync(): Promise<void> {
        this.trackRemover.removeTracksThatDoNoNotBelongToFolders();
        this.trackRemover.removeTracksThatAreNotFoundOnDisk();
        this.trackRemover.removeOrphanedFolderTracks();
        await this.trackUpdater.updateTracksThatAreOutOfDateAsync();
        await this.trackAdder.addTracksThatAreNotInTheDatabaseAsync();
    }
}
