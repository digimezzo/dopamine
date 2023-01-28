import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationPaths } from '../../common/application/application-paths';
import { Constants } from '../../common/application/constants';
import { FileFormats } from '../../common/application/file-formats';
import { Collections } from '../../common/collections';
import { FileValidator } from '../../common/file-validator';
import { BaseFileAccess } from '../../common/io/base-file-access';
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
        private fileAccess: BaseFileAccess,
        private logger: Logger
    ) {
        this.initialize();
    }

    public get playlistsParentFolderPath(): string {
        return this._playlistsParentFolderPath;
    }

    public ensurePlaylistsParentFolderExists(playlistsParentFolder: string): void {
        try {
            this.fileAccess.createFullDirectoryPathIfDoesNotExist(playlistsParentFolder);
        } catch (e) {
            this.logger.error(
                `Could not create playlists directory. Error: ${e.message}`,
                'PlaylistFileManager',
                'ensurePlaylistsParentFolderExists'
            );
        }
    }

    private initialize(): void {
        const musicDirectory: string = this.fileAccess.musicDirectory();
        this._playlistsParentFolderPath = this.fileAccess.combinePath([musicDirectory, 'Dopamine', ApplicationPaths.playlistsFolder]);
    }

    public async getPlaylistsInPathAsync(path: string): Promise<PlaylistModel[]> {
        const filePathsInPath: string[] = await this.fileAccess.getFilesInDirectoryAsync(path);
        const sortedFilePathsInPath: string[] = filePathsInPath.sort();
        const playlists: PlaylistModel[] = [];

        for (let index = 0; index < sortedFilePathsInPath.length; index++) {
            const currentPath: string = sortedFilePathsInPath[index];

            if (this.fileValidator.isSupportedPlaylistFile(currentPath)) {
                const playlistPath: string = currentPath;
                const previousPath: string = Collections.getPreviousItem(sortedFilePathsInPath, index);
                const nextPath: string = Collections.getNextItem(sortedFilePathsInPath, index);

                let playlistImagePath: string = '';

                if (this.isProposedPlaylistImagePathValid(playlistPath, previousPath)) {
                    playlistImagePath = previousPath;
                } else if (this.isProposedPlaylistImagePathValid(playlistPath, nextPath)) {
                    playlistImagePath = nextPath;
                }

                playlists.push(this.playlistModelFactory.create(this._playlistsParentFolderPath, playlistPath, playlistImagePath));
            }
        }

        return playlists;
    }

    private isProposedPlaylistImagePathValid(playlistPath: string, proposedPlaylistImagePath: string): boolean {
        const playlistPathWithoutExtension: string = this.fileAccess.getPathWithoutExtension(playlistPath);

        return (
            proposedPlaylistImagePath != undefined &&
            this.fileValidator.isSupportedPlaylistImageFile(proposedPlaylistImagePath) &&
            proposedPlaylistImagePath.startsWith(playlistPathWithoutExtension)
        );
    }

    public createPlaylist(playlistFolder: PlaylistFolderModel, playlistName: string): PlaylistModel {
        const playlistPath: string = this.fileAccess.combinePath([playlistFolder.path, `${playlistName}${FileFormats.m3u}`]);
        const newPlaylist: PlaylistModel = this.playlistModelFactory.create(this._playlistsParentFolderPath, playlistPath, '');
        this.fileAccess.createFile(playlistPath);

        return newPlaylist;
    }

    public async deletePlaylistAsync(playlist: PlaylistModel): Promise<void> {
        await this.fileAccess.deleteFileIfExistsAsync(playlist.path);
        await this.fileAccess.deleteFileIfExistsAsync(playlist.imagePath);
    }

    public async updatePlaylistAsync(playlist: PlaylistModel, newName: string, newImagePath: string): Promise<void> {
        let playlistPath: string = playlist.path;

        if (newName !== playlist.name) {
            playlistPath = this.updatePlaylistPath(playlist, newName);
        }

        await this.fileAccess.deleteFileIfExistsAsync(playlist.imagePath);

        if (newImagePath !== Constants.emptyImage) {
            await this.createPlaylistImageAsync(playlistPath, newImagePath);
        }
    }

    private updatePlaylistPath(playlist: PlaylistModel, newName: string): string {
        const newPlaylistPath: string = this.fileAccess.changeFileName(playlist.path, newName);
        this.fileAccess.renameFileOrDirectory(playlist.path, newPlaylistPath);

        return newPlaylistPath;
    }

    private async createPlaylistImageAsync(playlistPath: string, selectedImagePath: string): Promise<void> {
        const playlistImageExtension: string = this.fileAccess.getFileExtension(selectedImagePath).toLowerCase();
        const playlistPathWithoutExtension: string = this.fileAccess.getPathWithoutExtension(playlistPath);
        const newPlaylistImagePath: string = `${playlistPathWithoutExtension}-${uuidv4()}-${playlistImageExtension}`;
        this.fileAccess.copyFile(selectedImagePath, newPlaylistImagePath);
    }
}
