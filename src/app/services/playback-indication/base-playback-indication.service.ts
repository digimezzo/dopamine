import { SubfolderModel } from '../folder/subfolder-model';
import { TrackModel } from '../track/track-model';

export abstract class BasePlaybackIndicationService {
    public abstract setPlayingSubfolder(subfolders: SubfolderModel[], playingTrack: TrackModel): Promise<void>;
    public abstract setPlayingTrack(tracks: TrackModel[], playingTrack: TrackModel): Promise<void>;
}
