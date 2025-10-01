import { ArtistType } from '../artist/artist-type';
import { TrackModel } from './track-model';
import { TrackModels } from './track-models';
import { ArtistModel } from '../artist/artist-model';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

export abstract class TrackServiceBase {
    public abstract getTracksInSubfolderAsync(subfolderPath: string): Promise<TrackModels>;
    public abstract getVisibleTracks(): TrackModels;
    public abstract getTracksForAlbums(albumKeys: string[]): TrackModels;
    public abstract getTracksForArtists(artists: ArtistModel[], artistType: ArtistType): TrackModels;
    public abstract getTracksForGenres(genres: string[]): TrackModels;
    public abstract savePlayCountAndDateLastPlayed(track: TrackModel): void;
    public abstract saveSkipCount(track: TrackModel): void;
    public abstract scrollToPlayingTrack(tracks: TrackModel[], viewPort: CdkVirtualScrollViewport): void;
}
