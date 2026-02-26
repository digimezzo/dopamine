import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Logger } from '../../common/logger';
import { AlbumModel } from '../album/album-model';
import { ArtistModel } from '../artist/artist-model';
import { ArtistType } from '../artist/artist-type';
import { GenreModel } from '../genre/genre-model';
import { PlaylistFolderModel } from '../playlist-folder/playlist-folder-model';
import { PlaylistFolderModelFactory } from '../playlist-folder/playlist-folder-model-factory';
import { TrackModel } from '../track/track-model';
import { TrackModelFactory } from '../track/track-model-factory';
import { TrackModels } from '../track/track-models';
import { PlaylistDecoder } from './playlist-decoder';
import { PlaylistEntry } from './playlist-entry';
import { PlaylistFileManager } from './playlist-file-manager';
import { PlaylistModel } from './playlist-model';
import { PlaylistServiceBase } from './playlist.service.base';
import { TrackServiceBase } from '../track/track.service.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { CollectionUtils } from '../../common/utils/collections-utils';
import { FileValidator } from '../../common/validation/file-validator';
import { NotificationServiceBase } from '../notification/notification.service.base';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Constants } from '../../common/application/constants';
import { PlaylistUpdateInfo } from './playlist-update-info';
import { PromiseUtils } from '../../common/utils/promise-utils';
import { SettingsBase } from '../../common/settings/settings.base';

@Injectable()
export class PlaylistService implements PlaylistServiceBase {
    private _playlistsParentFolderPath: string = '';
    private _activePlaylistFolder: PlaylistFolderModel = this.playlistFolderModelFactory.createDefault();
    private playlistsChanged: Subject<void> = new Subject();
    private playlistTracksChanged: Subject<void> = new Subject();
    private delayedUpdatePlaylistFile: Subject<PlaylistUpdateInfo> = new Subject<PlaylistUpdateInfo>();
    private _isUpdatingPlaylistFile: boolean = false;

    public constructor(
        private trackService: TrackServiceBase,
        private notificationService: NotificationServiceBase,
        private playlistFolderModelFactory: PlaylistFolderModelFactory,
        private playlistFileManager: PlaylistFileManager,
        private playlistDecoder: PlaylistDecoder,
        private trackModelFactory: TrackModelFactory,
        private fileValidator: FileValidator,
        private fileAccess: FileAccessBase,
        private settings: SettingsBase,
        private logger: Logger,
    ) {
        this.initialize();
    }

    public get isUpdatingPlaylistFile(): boolean {
        return this._isUpdatingPlaylistFile;
    }

    public get playlistsParentFolderPath(): string {
        return this._playlistsParentFolderPath;
    }

    public get activePlaylistFolder(): PlaylistFolderModel {
        return this._activePlaylistFolder;
    }

    public get hasActivePlaylistFolder(): boolean {
        return !this._activePlaylistFolder.isDefault;
    }

    public playlistsChanged$: Observable<void> = this.playlistsChanged.asObservable();
    public playlistTracksChanged$: Observable<void> = this.playlistTracksChanged.asObservable();

    public async addArtistsToPlaylistAsync(playlistPath: string, playlistName: string, artistsToAdd: ArtistModel[]): Promise<void> {
        if (playlistPath == undefined) {
            throw new Error('playlistPath is undefined');
        }

        if (artistsToAdd == undefined) {
            throw new Error('artistsToAdd is undefined');
        }

        const tracks: TrackModels = this.trackService.getTracksForArtists(artistsToAdd, ArtistType.allArtists);
        await this.addTracksToPlaylistAsync(playlistPath, playlistName, tracks.tracks);
    }

    public async addGenresToPlaylistAsync(playlistPath: string, playlistName: string, genresToAdd: GenreModel[]): Promise<void> {
        if (playlistPath == undefined) {
            throw new Error('playlistPath is undefined');
        }

        if (genresToAdd == undefined) {
            throw new Error('genresToAdd is undefined');
        }

        const genreNames: string[] = genresToAdd.map((x) => x.name);
        const tracks: TrackModels = this.trackService.getTracksForGenres(genreNames);
        await this.addTracksToPlaylistAsync(playlistPath, playlistName, tracks.tracks);
    }

    public async addAlbumsToPlaylistAsync(playlistPath: string, playlistName: string, albumsToAdd: AlbumModel[]): Promise<void> {
        if (playlistPath == undefined) {
            throw new Error('playlistPath is undefined');
        }

        if (albumsToAdd == undefined) {
            throw new Error('albumsToAdd is undefined');
        }

        const albumKeys: string[] = albumsToAdd.map((x) => x.albumKey);
        const tracks: TrackModels = this.trackService.getTracksForAlbums(albumKeys);
        await this.addTracksToPlaylistAsync(playlistPath, playlistName, tracks.tracks);
    }

    public async addTracksToPlaylistAsync(playlistPath: string, playlistName: string, tracksToAdd: TrackModel[]): Promise<void> {
        if (playlistPath == undefined) {
            throw new Error('playlistPath is undefined');
        }

        if (tracksToAdd == undefined) {
            throw new Error('tracksToAdd is undefined');
        }

        try {
            for (const path of tracksToAdd.map((x) => x.path)) {
                await this.fileAccess.appendTextToFileAsync(playlistPath, path);
            }

            if (tracksToAdd.length === 1) {
                await this.notificationService.singleTrackAddedToPlaylistAsync(playlistName);
            } else {
                await this.notificationService.multipleTracksAddedToPlaylistAsync(playlistName, tracksToAdd.length);
            }
        } catch (e: unknown) {
            this.logger.error(e, `Could not add tracks to playlist '${playlistPath}'`, 'PlaylistService', 'addTracksToPlaylist');
            throw new Error(e instanceof Error ? e.message : 'Unknown error');
        }
    }

    public async removeTracksFromPlaylistsAsync(tracksToRemove: TrackModel[]): Promise<void> {
        if (tracksToRemove == undefined) {
            throw new Error('tracksToRemove is undefined');
        }

        try {
            const tracksToRemoveGroupedByPlaylistPath: Map<string, TrackModel[]> = CollectionUtils.groupBy(
                tracksToRemove,
                (track: TrackModel) => track.playlistPath,
            );

            for (const playlistPath of Array.from(tracksToRemoveGroupedByPlaylistPath.keys())) {
                const tracksToRemoveForSinglePlaylist: TrackModel[] = tracksToRemoveGroupedByPlaylistPath.get(playlistPath) ?? [];

                await this.removeTracksFromSinglePlaylistAsync(playlistPath, tracksToRemoveForSinglePlaylist);
            }
        } catch (e: unknown) {
            this.logger.error(e, 'Could not remove tracks from playlists.', 'PlaylistService', 'removeTracksFromPlaylistsAsync');

            throw new Error(e instanceof Error ? e.message : 'Unknown error');
        }

        this.playlistTracksChanged.next();
    }

    private async removeTracksFromSinglePlaylistAsync(playlistPath: string, tracksToRemove: TrackModel[]): Promise<void> {
        if (playlistPath == undefined) {
            throw new Error('playlistPath is undefined');
        }

        if (tracksToRemove == undefined) {
            throw new Error('tracksToRemove is undefined');
        }

        try {
            const allPlaylistTracks: TrackModel[] = await this.decodePlaylistAsync(playlistPath);
            const playlistTracksAfterRemoval: TrackModel[] = [];
            const trackPathsToRemove: string[] = tracksToRemove.map((x) => x.path);

            for (const playlistTrack of allPlaylistTracks) {
                if (!trackPathsToRemove.includes(playlistTrack.path)) {
                    playlistTracksAfterRemoval.push(playlistTrack);
                }
            }

            await this.fileAccess.clearFileContentsAsync(playlistPath);

            for (const playlistTrack of playlistTracksAfterRemoval) {
                await this.fileAccess.appendTextToFileAsync(playlistPath, playlistTrack.path);
            }
        } catch (e: unknown) {
            this.logger.error(
                e,
                `Could not remove tracks from playlist '${playlistPath}'`,
                'PlaylistService',
                'removeTracksFromPlaylistAsync',
            );
            throw new Error(e instanceof Error ? e.message : 'Unknown error');
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
                this.logger.info(`Created new playlist '${playlist.path}'`, 'PlaylistService', 'updatePlaylistDetailsAsync');
            }

            await this.playlistFileManager.updatePlaylistAsync(playlist, newName, newImagePath);

            this.playlistsChanged.next();
        } catch (e: unknown) {
            this.logger.error(e, 'Could not update playlist details', 'PlaylistService', 'updatePlaylistDetailsAsync');
            throw new Error(e instanceof Error ? e.message : 'Unknown error');
        }
    }

    public async getTracksAsync(playlists: PlaylistModel[]): Promise<TrackModels> {
        if (this.playlistsParentFolderPath == undefined) {
            this.logger.warn(`Playlists is undefined. Returning empty array of tracks`, 'PlaylistService', 'getTracksAsync');

            return new TrackModels();
        }

        const trackModels: TrackModels = new TrackModels();

        for (const playlist of playlists) {
            const playlistTracks: TrackModel[] = await this.decodePlaylistAsync(playlist.path);

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

        this.delayedUpdatePlaylistFile
            .pipe(debounceTime(Constants.playlistsSaveDelayMilliseconds))
            .subscribe((playlistUpdateInfo: PlaylistUpdateInfo) => {
                PromiseUtils.noAwait(this.updatePlaylistFileAsync(playlistUpdateInfo.playlistPath, playlistUpdateInfo.tracks));
            });
    }

    private async decodePlaylistAsync(playlistPath: string): Promise<TrackModel[]> {
        const tracks: TrackModel[] = [];
        let playlistEntries: PlaylistEntry[] = [];

        try {
            playlistEntries = await this.playlistDecoder.decodePlaylistAsync(playlistPath);
        } catch (e: unknown) {
            this.logger.error(e, `Could not decode playlist with path='${playlistPath}'`, 'PlaylistService', 'decodePlaylistAsync');
            throw new Error(e instanceof Error ? e.message : 'Unknown error');
        }

        const albumKeyIndex = this.settings.albumKeyIndex;

        for (const playlistEntry of playlistEntries) {
            if (await this.fileValidator.isPlayableAudioFileAsync(playlistEntry.decodedPath)) {
                const track: TrackModel = await this.trackModelFactory.createFromFileAsync(playlistEntry.decodedPath, albumKeyIndex);
                tracks.push(track);
            }
        }

        return tracks;
    }

    public async updatePlaylistOrderAsync(tracks: TrackModel[]): Promise<void> {
        if (tracks == undefined) {
            throw new Error('tracks is undefined');
        }

        if (tracks.length === 0) {
            throw new Error('tracks is empty');
        }

        if (!this.areTrackFromSinglePlaylist(tracks)) {
            return;
        }

        this._isUpdatingPlaylistFile = true;
        this.delayedUpdatePlaylistFile.next(new PlaylistUpdateInfo(tracks[0].playlistPath, tracks));
    }

    private areTrackFromSinglePlaylist(tracks: TrackModel[]): boolean {
        const uniquePlaylistPaths: Set<string> = new Set(tracks.map((x) => x.playlistPath));

        return uniquePlaylistPaths.size === 1;
    }

    private async updatePlaylistFileAsync(playlistPath: string, tracks: TrackModel[]): Promise<void> {
        try {
            await this.fileAccess.replaceMultiLineTextInFileAsync(
                playlistPath,
                tracks.map((x) => x.path),
            );
        } catch (e: unknown) {
            this.logger.error(e, `Could not update tracks in playlist '${playlistPath}'`, 'PlaylistService', 'updatePlaylistFileAsync');
            throw new Error(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            this._isUpdatingPlaylistFile = false;
        }
    }
}
