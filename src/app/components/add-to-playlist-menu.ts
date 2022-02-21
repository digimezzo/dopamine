import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
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

    constructor(private playlistFolderService: BasePlaylistFolderService, private playlistService: BasePlaylistService) {}

    public playlists: PlaylistModel[] = [];

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

            json[objectKey].push(playlist.name);

            return json;
        }, {});
    }

    public async addArtistsToPlaylistAsync(artists: ArtistModel[]): Promise<void> {
        alert(artists.length);
    }

    public async addGenresToPlaylistAsync(genres: GenreModel[]): Promise<void> {
        alert(genres.length);
    }

    public async addAlbumsToPlaylistAsync(albums: AlbumModel[]): Promise<void> {
        alert(albums.length);
    }

    public async addTracksToPlaylistAsync(tracks: TrackModel[]): Promise<void> {
        alert(tracks.length);
    }
}
