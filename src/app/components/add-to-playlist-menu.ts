import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Logger } from '../common/logger';
import { AlbumModel } from '../services/album/album-model';
import { ArtistModel } from '../services/artist/artist-model';
import { GenreModel } from '../services/genre/genre-model';
import { BasePlaylistFolderService } from '../services/playlist-folder/base-playlist-folder.service';
import { PlaylistFolderModel } from '../services/playlist-folder/playlist-folder-model';
import { BasePlaylistService } from '../services/playlist/base-playlist.service';
import { PlaylistModel } from '../services/playlist/playlist-model';
import { TrackModel } from '../services/track/track-model';

@Injectable()
export class AddToPlaylistMenu {
    private subscription: Subscription = new Subscription();

    constructor(
        private playlistFolderService: BasePlaylistFolderService,
        private playlistService: BasePlaylistService,
        private logger: Logger
    ) {}

    public playlists: any;

    public get hasPlaylists(): boolean {
        return this.playlists != undefined && Object.keys(this.playlists).length > 0;
    }

    public async initializeAsync(): Promise<void> {
        this.subscription.add(
            this.playlistFolderService.playlistFoldersChanged$.subscribe(async () => {
                await this.fillPlaylistsAsync();
            })
        );

        this.subscription.add(
            this.playlistService.playlistsChanged$.subscribe(async () => {
                await this.fillPlaylistsAsync();
            })
        );

        this.fillPlaylistsAsync();
    }

    private async fillPlaylistsAsync(): Promise<void> {
        const playlistFolders: PlaylistFolderModel[] = await this.playlistFolderService.getPlaylistFoldersAsync();
        const playlists: PlaylistModel[] = await this.playlistService.getPlaylistsAsync(playlistFolders);

        this.playlists = this.playlistsToJson(playlists);
    }

    private playlistsToJson(playlists: PlaylistModel[]): any {
        return playlists.reduce((json: any, playlist: PlaylistModel) => {
            const objectKey: any = playlist['folderName'];

            if (json[objectKey] == undefined) {
                json[objectKey] = [];
            }

            json[objectKey].push({ path: playlist.path, name: playlist.name });

            return json;
        }, {});
    }

    public async addArtistsToPlaylistAsync(playlistName: string, playlistPath: string, artists: ArtistModel[]): Promise<void> {
        await this.playlistService.addArtistsToPlaylistAsync(playlistName, playlistPath, artists);
    }

    public async addGenresToPlaylistAsync(playlistName: string, playlistPath: string, genres: GenreModel[]): Promise<void> {
        await this.playlistService.addGenresToPlaylistAsync(playlistName, playlistPath, genres);
    }

    public async addAlbumsToPlaylistAsync(playlistName: string, playlistPath: string, albums: AlbumModel[]): Promise<void> {
        await this.playlistService.addAlbumsToPlaylistAsync(playlistName, playlistPath, albums);
    }

    public async addTracksToPlaylistAsync(playlistName: string, playlistPath: string, tracks: TrackModel[]): Promise<void> {
        try {
            await this.playlistService.addTracksToPlaylistAsync(playlistName, playlistPath, tracks);
        } catch (e) {
            this.logger.error(`Could not add tracks to playlist. Error: ${e.message}`, 'AddToPlaylistMenu', 'addTracksToPlaylist');
        }
    }
}
