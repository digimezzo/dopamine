import { Injectable } from '@angular/core';
import { ApplicationPaths } from '../../common/application/application-paths';
import { Constants } from '../../common/application/constants';
import { FileFormats } from '../../common/application/file-formats';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { PlaylistFolderModel } from '../playlist-folder/playlist-folder-model';
import { PlaylistModel } from './playlist-model';
import { PlaylistModelFactory } from './playlist-model-factory';

@Injectable()
export class PlaylistFileManager {
    constructor(private playlistModelFactory: PlaylistModelFactory, private fileSystem: FileSystem, private logger: Logger) {}

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

    public getPlaylistsDirectoryPath(): string {
        const musicDirectory: string = this.fileSystem.musicDirectory();
        const playlistsDirectoryPath: string = this.fileSystem.combinePath([musicDirectory, 'Dopamine', ApplicationPaths.playlistsFolder]);

        return playlistsDirectoryPath;
    }

    public async getPlaylistsInPathAsync(path: string): Promise<PlaylistModel[]> {
        const filePathsInPath: string[] = await this.fileSystem.getFilesInDirectoryAsync(path);
        const playlists: PlaylistModel[] = [];

        for (const filePath of filePathsInPath) {
            if (this.isSupportedPlaylistFile(filePath)) {
                playlists.push(this.playlistModelFactory.create(filePath));
            }
        }

        return playlists;
    }

    public createPlaylist(playlistFolder: PlaylistFolderModel, playlistName: string): PlaylistModel {
        const playlistPath: string = this.fileSystem.combinePath([playlistFolder.path, `${playlistName}${FileFormats.m3u}`]);

        const newPlaylist: PlaylistModel = this.playlistModelFactory.create(playlistPath);
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
        const playlistImageExtension: string = this.fileSystem.getFileExtension(selectedImagePath);
        const newPlaylistImagePath: string = this.fileSystem.changeFileExtension(playlistPath, playlistImageExtension);
        this.fileSystem.copyFile(selectedImagePath, newPlaylistImagePath);
    }

    private isSupportedPlaylistFile(filePath: string): boolean {
        const fileExtension: string = this.fileSystem.getFileExtension(filePath);

        if (FileFormats.supportedPlaylistExtensions.includes(fileExtension.toLowerCase())) {
            return true;
        }

        return false;
    }
}
