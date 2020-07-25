import { Injectable } from '@angular/core';
import { TrackRemover } from './track-remover';

@Injectable({
    providedIn: 'root'
})
export class CollectionIndexer {
    constructor(
        private trackRemover: TrackRemover) { }

    public async indexCollectionAsync(): Promise<void> {
        this.trackRemover.removeTracksThatDoNoNotBelongToFolders();
        this.trackRemover.removeTracksThatAreNotFoundOnDisk();
    }
}
