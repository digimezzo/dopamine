import { Track } from './track';
import { CollectionLoader as CollectionLoader } from './collectionLoader';
import { TrackRepositoryInterface } from './trackRepositoryInterface';

export class TrackRepository implements TrackRepositoryInterface {
    private tracksCollectionName: string = "tracks";
    private tracksCollectionLoader: CollectionLoader = new CollectionLoader("tracks.db", [this.tracksCollectionName]);

    constructor() {
    }

    public async getTracksAsync(): Promise<Track[]> {
        let tracksCollection: any = await this.tracksCollectionLoader.getCollectionAsync(this.tracksCollectionName);

        let tracks: Track[] = [];

        return tracks;
    }
}