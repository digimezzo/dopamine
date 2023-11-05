import { SubfolderModel } from '../folder/subfolder-model';
import { TrackModel } from '../track/track-model';

export abstract class PlaybackIndicationServiceBase {
    public abstract setPlayingSubfolder(subfolders: SubfolderModel[] | undefined, playingTrack: TrackModel | undefined): void;
    public abstract clearPlayingSubfolder(subfolders: SubfolderModel[]): void;
    public abstract setPlayingTrack(tracks: TrackModel[] | undefined, playingTrack: TrackModel | undefined): void;
    public abstract clearPlayingTrack(tracks: TrackModel[]): void;
}
