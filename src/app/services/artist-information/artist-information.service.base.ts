import { TrackModel } from '../track/track-model';
import { ArtistInformation } from './artist-information';

export abstract class ArtistInformationServiceBase {
    public abstract getQuickArtistInformation(track: TrackModel | undefined): ArtistInformation;
    public abstract getArtistInformationAsync(track: TrackModel | undefined): Promise<ArtistInformation>;
}
