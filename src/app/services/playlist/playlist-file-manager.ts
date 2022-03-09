import { Injectable } from '@angular/core';
import { ApplicationPaths } from '../../common/application/application-paths';
import { Constants } from '../../common/application/constants';
import { FileFormats } from '../../common/application/file-formats';
import { FileValidator } from '../../common/file-validator';
import { BaseFileSystem } from '../../common/io/base-file-system';
import { Logger } from '../../common/logger';
import { PlaylistFolderModel } from '../playlist-folder/playlist-folder-model';
import { PlaylistModel } from './playlist-model';
import { PlaylistModelFactory } from './playlist-model-factory';

@Injectable()
export class PlaylistFileManager {
    private _playlistsParentFolderPath: string = '';

    constructor(
        private playlistModelFactory: PlaylistModelFactory,
        private fileValidator: FileValidator,
        private fileSystem: BaseFileSystem,
        private logger: Logger
    ) {
        this.initialize();
    }

    public get playlistsParentFolderPath(): string {
        return this._playlistsParentFolderPath;
    }

    public ensurePlaylistsParentFolderExists(playlistsParentFolder: string): void {
        try {
            this.fileSystem.createFullDirectoryPathIfDoesNotExist(playlistsParentFolder);
        } catch (e) {
            this.logger.error(
                `Could not create playlists directory. Error: ${e.message}`,
                'PlaylistFileManager',
                'ensurePlaylistsParentFolderExists'
            );
        }
    }

    private initialize(): void {
        const musicDirectory: string = this.fileSystem.musicDirectory();
        this._playlistsParentFolderPath = this.fileSystem.combinePath([musicDirectory, 'Dopamine', ApplicationPaths.playlistsFolder]);
    }

    public async getPlaylistsInPathAsync(path: string): Promise<PlaylistModel[]> {
        const filePathsInPath: string[] = await this.fileSystem.getFilesInDirectoryAsync(path);
        const playlists: PlaylistModel[] = [];

        for (const filePath of filePathsInPath) {
            if (this.fileValidator.isSupportedPlaylistFile(filePath)) {
                playlists.push(this.playlistModelFactory.create(this._playlistsParentFolderPath, filePath));
            }
        }

        return playlists;
    }

    public createPlaylist(playlistFolder: PlaylistFolderModel, playlistName: string): PlaylistModel {
        const playlistPath: string = this.fileSystem.combinePath([playlistFolder.path, `${playlistName}${FileFormats.m3u}`]);
        const newPlaylist: PlaylistModel = this.playlistModelFactory.create(this._playlistsParentFolderPath, playlistPath);
        this.fileSystem.createFile(playlistPath);

        return newPlaylist;
    }

    public async deletePlaylistAsync(playlist: PlaylistModel): Promise<void> {
        await this.fileSystem.deleteFileIfExistsAsync(playlist.path);
        await this.fileSystem.deleteFileIfExistsAsync(playlist.imagePath);
    }

    public async updatePlaylistAsync(playlist: PlaylistModel, newName: string, newImagePath: string): Promise<void> {
        let playlistPath: string = playlist.path;

        if (newName !== playlist.name) {
            playlistPath = this.updatePlaylistPath(playlist, newName);
        }

        if (newImagePath !== Constants.emptyImage) {
            if (newImagePath !== playlist.imagePath) {
                await this.fileSystem.deleteFileIfExistsAsync(playlist.imagePath);
                await this.replacePlaylistImageAsync(playlistPath, newImagePath);
            } else {
                this.updatePlaylistImagePath(playlist, newName);
            }
        } else {
            await this.fileSystem.deleteFileIfExistsAsync(playlist.imagePath);
        }
    }

    private updatePlaylistPath(playlist: PlaylistModel, newName: string): string {
        const newPlaylistPath: string = this.fileSystem.changeFileName(playlist.path, newName);
        this.fileSystem.renameFileOrDirectory(playlist.path, newPlaylistPath);

        return newPlaylistPath;
    }

    private updatePlaylistImagePath(playlist: PlaylistModel, newName: string): void {
        const newPlaylistImagePath: string = this.fileSystem.changeFileName(playlist.imagePath, newName);
        this.fileSystem.renameFileOrDirectory(playlist.imagePath, newPlaylistImagePath);
    }

    private async replacePlaylistImageAsync(playlistPath: string, selectedImagePath: string): Promise<void> {
        const playlistImageExtension: string = this.fileSystem.getFileExtension(selectedImagePath).toLowerCase();
        const newPlaylistImagePath: string = this.fileSystem.changeFileExtension(playlistPath, playlistImageExtension);
        this.fileSystem.copyFile(selectedImagePath, newPlaylistImagePath);
    }
}
