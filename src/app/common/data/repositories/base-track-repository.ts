import { AlbumData } from '../entities/album-data';
import { ArtistData } from '../entities/artist-data';
import { GenreData } from '../entities/genre-data';
import { Track } from '../entities/track';

export abstract class BaseTrackRepository {
    public abstract getNumberOfTracksThatNeedIndexing(): number;
    public abstract getNumberOfTracks(): number;
    public abstract getMaximumDateFileModified(): number;
    public abstract getNumberOfTracksThatDoNotBelongFolders(): number;
    public abstract deleteTracksThatDoNotBelongFolders(): number;
    public abstract deleteTrack(trackId: number): void;
    public abstract deleteTracks(trackIds: number[]): void;
    public abstract getVisibleTracks(): Track[];
    public abstract getAllTracks(): Track[];
    public abstract getTracksForAlbums(albumKeys: string[]): Track[];
    public abstract getTracksForTrackArtists(trackArtists: string[]): Track[];
    public abstract getTracksForAlbumArtists(albumArtists: string[]): Track[];
    public abstract getTracksForGenres(genres: string[]): Track[];
    public abstract updateTrack(track: Track): void;
    public abstract addTrack(track: Track): void;
    public abstract getTrackByPath(path: string): Track;
    public abstract getAlbumDataThatNeedsIndexing(): AlbumData[];
    public abstract getAllAlbumData(): AlbumData[];
    public abstract getAlbumDataForTrackArtists(trackArtists: string[]): AlbumData[];
    public abstract getAlbumDataForAlbumArtists(albumArtists: string[]): AlbumData[];
    public abstract getAlbumDataForGenres(genres: string[]): AlbumData[];
    public abstract getTrackArtistData(): ArtistData[];
    public abstract getAlbumArtistData(): ArtistData[];
    public abstract getGenreData(): GenreData[];
    public abstract getLastModifiedTrackForAlbumKeyAsync(albumKey: string): Track;
    public abstract disableNeedsAlbumArtworkIndexingAsync(albumKey: string): void;
    public abstract enableNeedsAlbumArtworkIndexingForAllTracks(onlyWhenHasNoCover: boolean): void;
    public abstract updatePlayCountAndDateLastPlayed(trackId: number, playCount: number, dateLastPlayedInTicks: number): void;
    public abstract updateSkipCount(trackId: number, skipCount: number): void;
    public abstract updateRating(trackId: number, rating: number): void;
    public abstract updateLove(trackId: number, love: number): void;
}
