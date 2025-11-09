import { AlbumData } from '../entities/album-data';
import { ArtistData } from '../entities/artist-data';
import { GenreData } from '../entities/genre-data';
import { Track } from '../entities/track';

export abstract class TrackRepositoryBase {
    public abstract getNumberOfTracksThatDoNotBelongFoldersAsync(): Promise<number>;
    public abstract deleteTracksAsync(trackIds: number[]): Promise<void>;
    public abstract getVisibleTracksAsync(): Promise<Track[] | undefined>;
    public abstract getTracksForAlbumsAsync(albumKeyIndex: string, albumKeys: string[]): Promise<Track[] | undefined>;
    public abstract getTracksForTrackArtistsAsync(trackArtists: string[]): Promise<Track[] | undefined>;
    public abstract getTracksForAlbumArtistsAsync(albumArtists: string[]): Promise<Track[] | undefined>;
    public abstract getTracksForGenresAsync(genres: string[]): Promise<Track[] | undefined>;
    public abstract getTracksForPathsAsync(paths: string[]): Promise<Track[] | undefined>;
    public abstract getAlbumDataForAlbumKeyAsync(albumKeyIndex: string, albumKey: string): Promise<AlbumData[] | undefined>;
    public abstract getAllAlbumDataAsync(albumKeyIndex: string): Promise<AlbumData[] | undefined>;
    public abstract getAlbumDataForTrackArtistsAsync(albumKeyIndex: string, trackArtists: string[]): Promise<AlbumData[] | undefined>;
    public abstract getAlbumDataForAlbumArtistsAsync(albumKeyIndex: string, albumArtists: string[]): Promise<AlbumData[] | undefined>;
    public abstract getAlbumDataForGenresAsync(albumKeyIndex: string, genres: string[]): Promise<AlbumData[] | undefined>;
    public abstract getAlbumDataThatNeedsIndexingAsync(albumKeyIndex: string): Promise<AlbumData[] | undefined>;
    public abstract getTrackArtistDataAsync(): Promise<ArtistData[] | undefined>;
    public abstract getAlbumArtistDataAsync(): Promise<ArtistData[] | undefined>;
    public abstract getGenreDataAsync(): Promise<GenreData[] | undefined>;
    public abstract updatePlayCountAndDateLastPlayedAsync(trackId: number, playCount: number, dateLastPlayedInTicks: number): Promise<void>;
    public abstract updateSkipCountAsync(trackId: number, skipCount: number): Promise<void>;
    public abstract updateRatingAsync(trackId: number, rating: number): Promise<void>;
    public abstract updateLoveAsync(trackId: number, love: number): Promise<void>;
    public abstract getLastModifiedTrackForAlbumKeyAsync(albumKeyIndex: string, albumKey: string): Promise<Track | undefined>;
    public abstract disableNeedsAlbumArtworkIndexingAsync(albumKey: string): Promise<void>;
    public abstract updateTrackAsync(track: Track): Promise<void>;
}
