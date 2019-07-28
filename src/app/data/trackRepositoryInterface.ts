import { Track } from './track';

export interface TrackRepositoryInterface {
    getTracksAsync(): Promise<Track[]>;
}