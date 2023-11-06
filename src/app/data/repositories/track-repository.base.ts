import { AlbumData } from '../entities/album-data';
import { ArtistData } from '../entities/artist-data';
import { GenreData } from '../entities/genre-data';
import { Track } from '../entities/track';

export abstract class TrackRepositoryBase {
    public abstract getNumberOfTracksThatNeedIndexing(): number;
    public abstract getNumberOfTracks(): number;
    public abstract getMaximumDateFileModified(): number;
    public abstract getNumberOfTracksThatDoNotBelongFolders(): number;
    public abstract deleteTracksThatDoNotBelongFolders(): number;
    public abstract deleteTrack(trackId: number): void;
    public abstract deleteTracks(trackIds: number[]): void;
    public abstract getVisibleTracks(): Track[] | undefined;
    public abstract getAllTracks(): Track[] | undefined;
    public abstract getTracksForAlbums(albumKeys: string[]): Track[] | undefined;
    public abstract getTracksForTrackArtists(trackArtists: string[]): Track[] | undefined;
    public abstract getTracksForAlbumArtists(albumArtists: string[]): Track[] | undefined;
    public abstract getTracksForGenres(genres: string[]): Track[] | undefined;
    public abstract updateTrack(track: Track): void;
    public abstract addTrack(track: Track): void;
    public abstract getTrackByPath(path: string): Track | undefined;
    public abstract getAlbumDataThatNeedsIndexing(): AlbumData[] | undefined;
    public abstract getAlbumDataForAlbumKey(albumKey: string): AlbumData[] | undefined;
    public abstract getAllAlbumData(): AlbumData[] | undefined;
    public abstract getAlbumDataForTrackArtists(trackArtists: string[]): AlbumData[] | undefined;
    public abstract getAlbumDataForAlbumArtists(albumArtists: string[]): AlbumData[] | undefined;
    public abstract getAlbumDataForGenres(genres: string[]): AlbumData[] | undefined;
    public abstract getTrackArtistData(): ArtistData[] | undefined;
    public abstract getAlbumArtistData(): ArtistData[] | undefined;
    public abstract getGenreData(): GenreData[] | undefined;
    public abstract getLastModifiedTrackForAlbumKeyAsync(albumKey: string): Track | undefined;
    public abstract disableNeedsAlbumArtworkIndexing(albumKey: string): void;
    public abstract enableNeedsAlbumArtworkIndexingForAllTracks(onlyWhenHasNoCover: boolean): void;
    public abstract updatePlayCountAndDateLastPlayed(trackId: number, playCount: number, dateLastPlayedInTicks: number): void;
    public abstract updateSkipCount(trackId: number, skipCount: number): void;
    public abstract updateRating(trackId: number, rating: number): void;
    public abstract updateLove(trackId: number, love: number): void;
}
