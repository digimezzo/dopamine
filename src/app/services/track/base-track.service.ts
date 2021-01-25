import { SubfolderModel } from '../folder/subfolder-model';
import { TrackModel } from './track-model';

export abstract class BaseTrackService {
    public abstract getTracksInSubfolderAsync(subfolder: SubfolderModel): Promise<TrackModel[]>;
}
