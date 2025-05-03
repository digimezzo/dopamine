import { AlbumData } from '../entities/album-data';
import { ArtistData } from '../entities/artist-data';
import { GenreData } from '../entities/genre-data';
import { Track } from '../entities/track';

export abstract class TrackRepositoryBase {
    public abstract getNumberOfTracksThatDoNotBelongFolders(): number;
    public abstract deleteTracks(trackIds: number[]): void;
    public abstract getVisibleTracks(): Track[] | undefined;
    public abstract getTracksForAlbums(albumKeyIndex: string, albumKeys: string[]): Track[] | undefined;
    public abstract getTracksForTrackArtists(trackArtists: string[]): Track[] | undefined;
    public abstract getTracksForAlbumArtists(albumArtists: string[]): Track[] | undefined;
    public abstract getTracksForGenres(genres: string[]): Track[] | undefined;
    public abstract getTracksForPaths(paths: string[]): Track[] | undefined;
    public abstract getAlbumDataForAlbumKey(albumKeyIndex: string, albumKey: string): AlbumData[] | undefined;
    public abstract getAllAlbumData(albumKeyIndex: string): AlbumData[] | undefined;
    public abstract getAlbumDataForTrackArtists(albumKeyIndex: string, trackArtists: string[]): AlbumData[] | undefined;
    public abstract getAlbumDataForAlbumArtists(albumKeyIndex: string, albumArtists: string[]): AlbumData[] | undefined;
    public abstract getAlbumDataForGenres(albumKeyIndex: string, genres: string[]): AlbumData[] | undefined;
    public abstract getAlbumDataThatNeedsIndexing(albumKeyIndex: string): AlbumData[] | undefined;
    public abstract getTrackArtistData(): ArtistData[] | undefined;
    public abstract getAlbumArtistData(): ArtistData[] | undefined;
    public abstract getGenreData(): GenreData[] | undefined;
    public abstract updatePlayCountAndDateLastPlayed(trackId: number, playCount: number, dateLastPlayedInTicks: number): void;
    public abstract updateSkipCount(trackId: number, skipCount: number): void;
    public abstract updateRating(trackId: number, rating: number): void;
    public abstract updateLove(trackId: number, love: number): void;
    public abstract getLastModifiedTrackForAlbumKeyAsync(albumKeyIndex: string, albumKey: string): Track | undefined;
    public abstract disableNeedsAlbumArtworkIndexing(albumKey: string): void;
    public abstract updateTrack(track: Track): void;
}
