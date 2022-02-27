import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FileValidator } from '../../common/file-validator';
import { Logger } from '../../common/logger';
import { AlbumModel } from '../album/album-model';
import { ArtistModel } from '../artist/artist-model';
import { ArtistType } from '../artist/artist-type';
import { GenreModel } from '../genre/genre-model';
import { PlaylistFolderModel } from '../playlist-folder/playlist-folder-model';
import { PlaylistFolderModelFactory } from '../playlist-folder/playlist-folder-model-factory';
import { BaseTrackService } from '../track/base-track.service';
import { TrackModel } from '../track/track-model';
import { TrackModelFactory } from '../track/track-model-factory';
import { TrackModels } from '../track/track-models';
import { BasePlaylistService } from './base-playlist.service';
import { PlaylistDecoder } from './playlist-decoder';
import { PlaylistEntry } from './playlist-entry';
import { PlaylistFileManager as PlaylistFileManager } from './playlist-file-manager';
import { PlaylistModel } from './playlist-model';

@Injectable()
export class PlaylistService implements BasePlaylistService {
    private _playlistsParentFolderPath: string = '';
    private _activePlaylistFolder: PlaylistFolderModel = this.playlistFolderModelFactory.createDefault();
    private playlistsChanged: Subject<void> = new Subject();

    constructor(
        private trackService: BaseTrackService,
        private playlistFolderModelFactory: PlaylistFolderModelFactory,
        private playlistFileManager: PlaylistFileManager,
        private playlistDecoder: PlaylistDecoder,
        private trackModelFactory: TrackModelFactory,
        private fileValidator: FileValidator,
        private logger: Logger
    ) {
        this.initialize();
    }

    public get playlistsParentFolderPath(): string {
        return this._playlistsParentFolderPath;
    }

    public get activePlaylistFolder(): PlaylistFolderModel {
        return this._activePlaylistFolder;
    }

    public playlistsChanged$: Observable<void> = this.playlistsChanged.asObservable();

    public addArtistsToPlaylist(playlistPath: string, artists: ArtistModel[]): void {
        if (playlistPath == undefined) {
            throw new Error('playlistPath is undefined');
        }

        if (artists == undefined) {
            throw new Error('artists is undefined');
        }

        const artistNames: string[] = artists.map((x) => x.name);
        const tracks: TrackModels = this.trackService.getTracksForArtists(artistNames, ArtistType.allArtists);
        this.playlistFileManager.addTracksToPlaylist(playlistPath, tracks.tracks);
    }

    public addGenresToPlaylist(playlistPath: string, genres: GenreModel[]): void {
        if (playlistPath == undefined) {
            throw new Error('playlistPath is undefined');
        }

        if (genres == undefined) {
            throw new Error('genres is undefined');
        }

        const genreNames: string[] = genres.map((x) => x.name);
        const tracks: TrackModels = this.trackService.getTracksForGenres(genreNames);
        this.playlistFileManager.addTracksToPlaylist(playlistPath, tracks.tracks);
    }

    public addAlbumsToPlaylist(playlistPath: string, albums: AlbumModel[]): void {
        if (playlistPath == undefined) {
            throw new Error('playlistPath is undefined');
        }

        if (albums == undefined) {
            throw new Error('albums is undefined');
        }

        const albumKeys: string[] = albums.map((x) => x.albumKey);
        const tracks: TrackModels = this.trackService.getTracksForAlbums(albumKeys);
        this.playlistFileManager.addTracksToPlaylist(playlistPath, tracks.tracks);
    }

    public addTracksToPlaylist(playlistPath: string, tracks: TrackModel[]): void {
        if (playlistPath == undefined) {
            throw new Error('playlistPath is undefined');
        }

        if (tracks == undefined) {
            throw new Error('tracks is undefined');
        }

        this.playlistFileManager.addTracksToPlaylist(playlistPath, tracks);
    }

    public setActivePlaylistFolder(selectedPlaylistFolders: PlaylistFolderModel[]): void {
        this._activePlaylistFolder = this.playlistFolderModelFactory.createDefault();

        if (selectedPlaylistFolders != undefined && selectedPlaylistFolders.length > 0) {
            this._activePlaylistFolder = selectedPlaylistFolders[0];
        }
    }

    public async getPlaylistsInParentFolder(): Promise<PlaylistModel[]> {
        return await this.playlistFileManager.getPlaylistsInPathAsync(this._playlistsParentFolderPath);
    }

    public async getPlaylistsAsync(playlistFolders: PlaylistFolderModel[]): Promise<PlaylistModel[]> {
        const playlists: PlaylistModel[] = [];

        for (const playlistFolder of playlistFolders) {
            const playlistsInPlaylistFolder: PlaylistModel[] = await this.playlistFileManager.getPlaylistsInPathAsync(playlistFolder.path);
            playlists.push(...playlistsInPlaylistFolder);
        }

        return playlists;
    }

    public async deletePlaylistAsync(playlist: PlaylistModel): Promise<void> {
        await this.playlistFileManager.deletePlaylistAsync(playlist);

        this.playlistsChanged.next();
    }

    public async tryUpdatePlaylistDetailsAsync(playlist: PlaylistModel, newName: string, newImagePath: string): Promise<boolean> {
        let couldUpdatePlaylistDetails: boolean = true;

        try {
            if (playlist.isDefault) {
                playlist = this.playlistFileManager.createPlaylist(this.activePlaylistFolder, newName);
                this.logger.info(`Created new playlist '${playlist.path}'`, 'PlaylistService', 'tryUpdatePlaylistDetailsAsync');
            }

            await this.playlistFileManager.updatePlaylistAsync(playlist, newName, newImagePath);

            this.playlistsChanged.next();
        } catch (e) {
            this.logger.error(`Could not update playlist details. Error: ${e.message}`, 'PlaylistService', 'tryUpdatePlaylistDetailsAsync');
            couldUpdatePlaylistDetails = false;
        }

        return couldUpdatePlaylistDetails;
    }

    public async getTracksAsync(playlists: PlaylistModel[]): Promise<TrackModels> {
        if (this.playlistsParentFolderPath == undefined) {
            this.logger.error(`Playlists is undefined. Returning empty array of tracks`, 'PlaylistService', 'getTracksAsync');

            return new TrackModels();
        }

        const trackModels: TrackModels = new TrackModels();

        for (const playlist of playlists) {
            try {
                const playlistTracks: TrackModel[] = await this.decodePlaylistAsync(playlist);

                for (const playlistTrack of playlistTracks) {
                    trackModels.addTrack(playlistTrack);
                }
            } catch (e) {
                this.logger.error(`Could not decode playlist with path='${playlist.path}'`, 'PlaylistService', 'getTracksAsync');
            }
        }

        return trackModels;
    }

    private initialize(): void {
        this._playlistsParentFolderPath = this.playlistFileManager.playlistsParentFolderPath;
        this.playlistFileManager.ensurePlaylistsParentFolderExists(this._playlistsParentFolderPath);
    }

    private async decodePlaylistAsync(playlist: PlaylistModel): Promise<TrackModel[]> {
        const tracks: TrackModel[] = [];
        let playlistEntries: PlaylistEntry[] = [];

        playlistEntries = await this.playlistDecoder.decodePlaylistAsync(playlist);

        for (const playlistEntry of playlistEntries) {
            if (this.fileValidator.isPlayableAudioFile(playlistEntry.decodedPath)) {
                const track: TrackModel = await this.trackModelFactory.createFromFileAsync(playlistEntry.decodedPath);
                tracks.push(track);
            }
        }

        return tracks;
    }
}
