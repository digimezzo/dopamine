import { ArtistType } from '../artist/artist-type';
import { TrackModel } from './track-model';
import { TrackModels } from './track-models';
import { ArtistModel } from '../artist/artist-model';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

export abstract class TrackServiceBase {
    public abstract getTracksInSubfolderAsync(subfolderPath: string): Promise<TrackModels>;
    public abstract getVisibleTracksAsync(): Promise<TrackModels>;
    public abstract getTracksForAlbumsAsync(albumKeys: string[]): Promise<TrackModels>;
    public abstract getTracksForArtistsAsync(artists: ArtistModel[], artistType: ArtistType): Promise<TrackModels>;
    public abstract getTracksForGenresAsync(genres: string[]): Promise<TrackModels>;
    public abstract savePlayCountAndDateLastPlayedAsync(track: TrackModel): Promise<void>;
    public abstract saveSkipCountAsync(track: TrackModel): Promise<void>;
    public abstract scrollToPlayingTrack(tracks: TrackModel[], viewPort: CdkVirtualScrollViewport): void;
}
