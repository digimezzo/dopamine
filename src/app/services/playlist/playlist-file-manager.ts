import { Injectable } from '@angular/core';
import { ApplicationPaths } from '../../common/application/application-paths';
import { Constants } from '../../common/application/constants';
import { FileFormats } from '../../common/application/file-formats';
import { GuidFactory } from '../../common/guid.factory';
import { Logger } from '../../common/logger';
import { PlaylistFolderModel } from '../playlist-folder/playlist-folder-model';
import { PlaylistModel } from './playlist-model';
import { PlaylistModelFactory } from './playlist-model-factory';
import { FileAccessBase } from '../../common/io/file-access.base';
import { CollectionUtils } from '../../common/utils/collections-utils';
import { FileValidator } from '../../common/validation/file-validator';
import { DesktopBase } from '../../common/io/desktop.base';
import { StringUtils } from '../../common/utils/string-utils';

@Injectable()
export class PlaylistFileManager {
    private _playlistsParentFolderPath: string = '';

    public constructor(
        private playlistModelFactory: PlaylistModelFactory,
        private guidFactory: GuidFactory,
        private fileValidator: FileValidator,
        private applicationPaths: ApplicationPaths,
        private desktop: DesktopBase,
        private fileAccess: FileAccessBase,
        private logger: Logger,
    ) {
        this.initialize();
    }

    public get playlistsParentFolderPath(): string {
        return this._playlistsParentFolderPath;
    }

    public ensurePlaylistsParentFolderExists(playlistsParentFolder: string): void {
        try {
            this.fileAccess.createFullDirectoryPathIfDoesNotExist(playlistsParentFolder);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not create playlists directory', 'PlaylistFileManager', 'ensurePlaylistsParentFolderExists');
        }
    }

    private initialize(): void {
        let musicDirectory: string = '';

        try {
            musicDirectory = this.desktop.getMusicDirectory();
        } catch (e: unknown) {
            this.logger.error(e, 'Could not access music directory', 'PlaylistFileManager', 'initialize');
        }

        if (!StringUtils.isNullOrWhiteSpace(musicDirectory) && this.fileAccess.pathExists(musicDirectory)) {
            this._playlistsParentFolderPath = this.fileAccess.combinePath([musicDirectory, 'Dopamine', 'Playlists']);
            this.logger.info(
                `Music directory found at '${musicDirectory}'. Saving playlists to '${this._playlistsParentFolderPath}'`,
                'PlaylistFileManager',
                'initialize',
            );
        } else {
            this._playlistsParentFolderPath = this.fileAccess.combinePath([this.desktop.getApplicationDataDirectory(), 'Playlists']);
            this.logger.info(
                `Music directory not found. Saving playlists to '${this._playlistsParentFolderPath}'`,
                'PlaylistFileManager',
                'initialize',
            );
        }
    }

    public async getPlaylistsInPathAsync(path: string): Promise<PlaylistModel[]> {
        const filePathsInPath: string[] = await this.fileAccess.getFilesInDirectoryAsync(path);
        const sortedFilePathsInPath: string[] = filePathsInPath.sort();
        const playlists: PlaylistModel[] = [];

        for (let index = 0; index < sortedFilePathsInPath.length; index++) {
            const currentPath: string = sortedFilePathsInPath[index];

            if (this.fileValidator.isSupportedPlaylistFile(currentPath)) {
                const playlistPath: string = currentPath;
                const previousPath: string | undefined = CollectionUtils.getPreviousItem<string>(sortedFilePathsInPath, index);
                const nextPath: string | undefined = CollectionUtils.getNextItem<string>(sortedFilePathsInPath, index);

                let playlistImagePath: string = '';

                if (previousPath != undefined && this.isProposedPlaylistImagePathValid(playlistPath, previousPath)) {
                    playlistImagePath = previousPath;
                } else if (nextPath != undefined && this.isProposedPlaylistImagePathValid(playlistPath, nextPath)) {
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
            this.createPlaylistImage(playlistPath, newImagePath);
        }
    }

    private updatePlaylistPath(playlist: PlaylistModel, newName: string): string {
        const newPlaylistPath: string = this.fileAccess.changeFileName(playlist.path, newName);
        this.fileAccess.renameFileOrDirectory(playlist.path, newPlaylistPath);

        return newPlaylistPath;
    }

    private createPlaylistImage(playlistPath: string, selectedImagePath: string): void {
        const playlistImageExtension: string = this.fileAccess.getFileExtension(selectedImagePath).toLowerCase();
        const playlistPathWithoutExtension: string = this.fileAccess.getPathWithoutExtension(playlistPath);
        const newPlaylistImagePath: string = `${playlistPathWithoutExtension}-${this.guidFactory.create()}-${playlistImageExtension}`;
        this.fileAccess.copyFile(selectedImagePath, newPlaylistImagePath);
    }
}
