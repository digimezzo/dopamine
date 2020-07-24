export abstract class BaseTrackRepository {
    public abstract getNumberOfTracksThatNeedIndexing(): number;
    public abstract getNumberOfTracks(): number;
    public abstract getMaximumDateFileModified(): number;
}
