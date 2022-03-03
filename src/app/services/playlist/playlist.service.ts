import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FileValidator } from '../../common/file-validator';
import { FileSystem } from '../../common/io/file-system';
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
        private fileSystem: FileSystem,
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

    public async addArtistsToPlaylistAsync(playlistPath: string, artistsToAdd: ArtistModel[]): Promise<void> {
        if (playlistPath == undefined) {
            throw new Error('playlistPath is undefined');
        }

        if (artistsToAdd == undefined) {
            throw new Error('artistsToAdd is undefined');
        }

        const artistNames: string[] = artistsToAdd.map((x) => x.name);
        const tracks: TrackModels = this.trackService.getTracksForArtists(artistNames, ArtistType.allArtists);
        await this.addTracksToPlaylistAsync(playlistPath, tracks.tracks);
    }

    public async addGenresToPlaylistAsync(playlistPath: string, genresToAdd: GenreModel[]): Promise<void> {
        if (playlistPath == undefined) {
            throw new Error('playlistPath is undefined');
        }

        if (genresToAdd == undefined) {
            throw new Error('genresToAdd is undefined');
        }

        const genreNames: string[] = genresToAdd.map((x) => x.name);
        const tracks: TrackModels = this.trackService.getTracksForGenres(genreNames);
        await this.addTracksToPlaylistAsync(playlistPath, tracks.tracks);
    }

    public async addAlbumsToPlaylistAsync(playlistPath: string, albumsToAdd: AlbumModel[]): Promise<void> {
        if (playlistPath == undefined) {
            throw new Error('playlistPath is undefined');
        }

        if (albumsToAdd == undefined) {
            throw new Error('albumsToAdd is undefined');
        }

        const albumKeys: string[] = albumsToAdd.map((x) => x.albumKey);
        const tracks: TrackModels = this.trackService.getTracksForAlbums(albumKeys);
        await this.addTracksToPlaylistAsync(playlistPath, tracks.tracks);
    }

    public async addTracksToPlaylistAsync(playlistPath: string, tracksToAdd: TrackModel[]): Promise<void> {
        if (playlistPath == undefined) {
            throw new Error('playlistPath is undefined');
        }

        if (tracksToAdd == undefined) {
            throw new Error('tracksToAdd is undefined');
        }

        try {
            for (const path of tracksToAdd.map((x) => x.path)) {
                await this.fileSystem.appendTextToFileAsync(playlistPath, path);
            }
        } catch (e) {
            this.logger.error(
                `Could not add tracks to playlist '${playlistPath}'. Error: ${e.message}`,
                'PlaylistService',
                'addTracksToPlaylist'
            );
            throw new Error(e.message);
        }
    }

    public async removeTracksFromPlaylistAsync(tracksToRemove: TrackModel[]): Promise<void> {
        if (tracksToRemove == undefined) {
            throw new Error('tracksToRemove is undefined');
        }

        try {
            const allPlaylistTracks: TrackModel[] = await this.decodePlaylistAsync(playlist);
            const playlistTracksAfterRemoval: TrackModel[] = [];
            const trackPathsToRemove: string[] = tracksToRemove.map((x) => x.path);

            for (const playlistTrack of allPlaylistTracks) {
                if (!trackPathsToRemove.includes(playlistTrack.path)) {
                    playlistTracksAfterRemoval.push(playlistTrack);
                }
            }

            await this.fileSystem.clearFileContentsAsync(playlist.path);

            for (const playlistTrack of playlistTracksAfterRemoval) {
                await this.fileSystem.appendTextToFileAsync(playlist.path, playlistTrack.path);
            }
        } catch (e) {
            this.logger.error(
                `Could not remove tracks from playlist '${playlist.path}'. Error: ${e.message}`,
                'PlaylistService',
                'removeTracksFromPlaylistAsync'
            );
            throw new Error(e.message);
        }
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

    public async updatePlaylistDetailsAsync(playlist: PlaylistModel, newName: string, newImagePath: string): Promise<void> {
        try {
            if (playlist.isDefault) {
                playlist = this.playlistFileManager.createPlaylist(this.activePlaylistFolder, newName);
                this.logger.info(`Created new playlist '${playlist.path}'`, 'PlaylistService', 'tryUpdatePlaylistDetailsAsync');
            }

            await this.playlistFileManager.updatePlaylistAsync(playlist, newName, newImagePath);

            this.playlistsChanged.next();
        } catch (e) {
            this.logger.error(`Could not update playlist details. Error: ${e.message}`, 'PlaylistService', 'tryUpdatePlaylistDetailsAsync');
            throw new Error(e.message);
        }
    }

    public async getTracksAsync(playlists: PlaylistModel[]): Promise<TrackModels> {
        if (this.playlistsParentFolderPath == undefined) {
            this.logger.error(`Playlists is undefined. Returning empty array of tracks`, 'PlaylistService', 'getTracksAsync');

            return new TrackModels();
        }

        const trackModels: TrackModels = new TrackModels();

        for (const playlist of playlists) {
            const playlistTracks: TrackModel[] = await this.decodePlaylistAsync(playlist);

            for (const playlistTrack of playlistTracks) {
                playlistTrack.playlistPath = playlist.path;
                trackModels.addTrack(playlistTrack);
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

        try {
            playlistEntries = await this.playlistDecoder.decodePlaylistAsync(playlist);
        } catch (e) {
            this.logger.error(`Could not decode playlist with path='${playlist.path}'`, 'PlaylistService', 'getTracksAsync');
            throw new Error(e.message);
        }

        for (const playlistEntry of playlistEntries) {
            if (this.fileValidator.isPlayableAudioFile(playlistEntry.decodedPath)) {
                const track: TrackModel = await this.trackModelFactory.createFromFileAsync(playlistEntry.decodedPath);
                tracks.push(track);
            }
        }

        return tracks;
    }
}
