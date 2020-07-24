import { Track } from '../entities/track';

export abstract class BaseTrackRepository {
    public abstract getNumberOfTracksThatNeedIndexing(): number;
    public abstract getNumberOfTracks(): number;
    public abstract getMaximumDateFileModified(): number;
    public abstract deleteTracksThatDoNotBelongFolders(): number;
    public abstract deleteTrack(trackId: number): void;
    public abstract getTracks(): Track[];
}
