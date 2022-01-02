import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApplicationPaths } from '../../common/application/application-paths';
import { Constants } from '../../common/application/constants';
import { FileFormats } from '../../common/application/file-formats';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { PlaylistFolderModel } from '../playlist-folder/playlist-folder-model';
import { BasePlaylistService } from './base-playlist.service';
import { PlaylistImagePathCreator } from './playlist-image-path-creator';
import { PlaylistModel } from './playlist-model';
import { PlaylistModelFactory } from './playlist-model-factory';

@Injectable()
export class PlaylistService implements BasePlaylistService {
    private _playlistsParentFolder: string;
    private _activePlaylistFolder: PlaylistFolderModel;
    private playlistsChanged: Subject<void> = new Subject();

    constructor(
        private playlistModelFactory: PlaylistModelFactory,
        private playlistImagePathCreator: PlaylistImagePathCreator,
        private fileSystem: FileSystem,
        private logger: Logger
    ) {
        this.initialize();
    }

    public get playlistsParentFolder(): string {
        return this._playlistsParentFolder;
    }

    public get activePlaylistFolder(): PlaylistFolderModel {
        return this._activePlaylistFolder;
    }

    public playlistsChanged$: Observable<void> = this.playlistsChanged.asObservable();

    public setActivePlaylistFolder(selectedPlaylistFolders: PlaylistFolderModel[]): void {
        this._activePlaylistFolder = undefined;

        if (selectedPlaylistFolders != undefined && selectedPlaylistFolders.length > 0) {
            this._activePlaylistFolder = selectedPlaylistFolders[0];
        }

        console.log(this._activePlaylistFolder);
    }

    private initialize(): void {
        this._playlistsParentFolder = this.getPlaylistsDirectoryPath();
        this.ensurePlaylistsDirectoryExists();
    }

    private ensurePlaylistsDirectoryExists(): void {
        try {
            this.fileSystem.createFullDirectoryPathIfDoesNotExist(this._playlistsParentFolder);
        } catch (e) {
            this.logger.error(
                `Could not create playlists directory. Error: ${e.message}`,
                'PlaylistService',
                'ensurePlaylistsDirectoryExists'
            );
        }
    }

    private getPlaylistsDirectoryPath(): string {
        const musicDirectory: string = this.fileSystem.musicDirectory();
        const playlistsDirectoryPath: string = this.fileSystem.combinePath([musicDirectory, 'Dopamine', ApplicationPaths.playlistsFolder]);

        return playlistsDirectoryPath;
    }

    public async getPlaylistsInParentFolder(): Promise<PlaylistModel[]> {
        return await this.getPlaylistsInPathAsync(this._playlistsParentFolder);
    }

    private async getPlaylistsInPathAsync(path: string): Promise<PlaylistModel[]> {
        const filePathsInPath: string[] = await this.fileSystem.getFilesInDirectoryAsync(path);
        const playlists: PlaylistModel[] = [];

        for (const filePath of filePathsInPath) {
            if (this.isSupportedPlaylistFile(filePath)) {
                playlists.push(this.playlistModelFactory.create(filePath));
            }
        }

        return playlists;
    }

    public async getPlaylistsAsync(playlistFolders: PlaylistFolderModel[]): Promise<PlaylistModel[]> {
        const playlists: PlaylistModel[] = [];

        for (const playlistFolder of playlistFolders) {
            const playlistsInPlaylistFolder: PlaylistModel[] = await this.getPlaylistsInPathAsync(playlistFolder.path);
            playlists.push(...playlistsInPlaylistFolder);
        }

        return playlists;
    }

    public async deletePlaylistAsync(playlist: PlaylistModel): Promise<void> {
        await this.fileSystem.deleteFileIfExistsAsync(playlist.path);

        this.playlistsChanged.next();
    }

    public async tryUpdatePlaylistDetailsAsync(playlist: PlaylistModel, newName: string, selectedImagePath: string): Promise<boolean> {
        let couldUpdatePlaylistDetails: boolean = true;

        try {
            await this.updatePlaylistImageAsync(playlist, selectedImagePath);
            this.updatePlaylistName(playlist, newName);

            this.playlistsChanged.next();
        } catch (e) {
            this.logger.error(`Could not update playlist details. Error: ${e.message}`, 'PlaylistService', 'updatePlaylistDetailsAsync');
            couldUpdatePlaylistDetails = false;
        }

        return couldUpdatePlaylistDetails;
    }

    private async updatePlaylistImageAsync(playlist: PlaylistModel, selectedImagePath: string): Promise<void> {
        await this.fileSystem.deleteFileIfExistsAsync(playlist.imagePath);

        if (selectedImagePath !== Constants.emptyImage) {
            const playlistImageExtension: string = this.fileSystem.getFileExtension(selectedImagePath);
            const newPlaylistImagePath: string = this.playlistImagePathCreator.createPlaylistImagePath(
                playlist.path,
                playlistImageExtension
            );
            this.fileSystem.copyFile(selectedImagePath, newPlaylistImagePath);
        }
    }

    private updatePlaylistName(playlist: PlaylistModel, newName: string): void {
        const extension: string = this.fileSystem.getFileExtension(playlist.path);
        this.fileSystem.renameFileOrDirectory(playlist.path, `${newName}${extension}`);
    }

    private isSupportedPlaylistFile(filePath: string): boolean {
        const fileExtension: string = this.fileSystem.getFileExtension(filePath);

        if (FileFormats.supportedPlaylistExtensions.includes(fileExtension.toLowerCase())) {
            return true;
        }

        return false;
    }
}
