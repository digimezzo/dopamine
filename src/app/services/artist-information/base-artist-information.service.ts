import { TrackModel } from '../track/track-model';
import { ArtistInformation } from './artist-information';

export abstract class BaseArtistInformationService {
    public abstract getArtistInformationAsync(track: TrackModel): Promise<ArtistInformation>;
}
