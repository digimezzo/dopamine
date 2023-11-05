/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Logger } from '../../common/logger';
import { PromiseUtils } from '../../common/utils/promise-utils';
import { AlbumModel } from '../../services/album/album-model';
import { ArtistModel } from '../../services/artist/artist-model';
import { GenreModel } from '../../services/genre/genre-model';
import { PlaylistFolderModel } from '../../services/playlist-folder/playlist-folder-model';
import { PlaylistModel } from '../../services/playlist/playlist-model';
import { TrackModel } from '../../services/track/track-model';
import { PlaylistFolderServiceBase } from '../../services/playlist-folder/playlist-folder.service.base';
import { PlaylistServiceBase } from '../../services/playlist/playlist.service.base';

@Injectable()
export class AddToPlaylistMenu {
    private subscription: Subscription = new Subscription();

    public constructor(
        private playlistFolderService: PlaylistFolderServiceBase,
        private playlistService: PlaylistServiceBase,
        private logger: Logger,
    ) {}

    public playlists: any;

    public get hasPlaylists(): boolean {
        return this.playlists != undefined && Object.keys(this.playlists).length > 0;
    }

    public async initializeAsync(): Promise<void> {
        this.subscription.add(
            this.playlistFolderService.playlistFoldersChanged$.subscribe(() => {
                PromiseUtils.noAwait(this.fillPlaylistsAsync());
            }),
        );

        this.subscription.add(
            this.playlistService.playlistsChanged$.subscribe(() => {
                PromiseUtils.noAwait(this.fillPlaylistsAsync());
            }),
        );

        await this.fillPlaylistsAsync();
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
        } catch (e: unknown) {
            this.logger.error(e, 'Could not add tracks to playlist', 'AddToPlaylistMenu', 'addTracksToPlaylist');
        }
    }
}
