import { SubfolderModel } from '../folder/subfolder-model';
import { TrackModel } from '../track/track-model';

export abstract class BasePlaybackIndicationService {
    public abstract setPlayingSubfolder(subfolders: SubfolderModel[], playingTrack: TrackModel): void;
    public abstract clearPlayingSubfolder(subfolders: SubfolderModel[]): void;
    public abstract setPlayingTrack(tracks: TrackModel[], playingTrack: TrackModel): void;
    public abstract clearPlayingTrack(tracks: TrackModel[]): void;
}
