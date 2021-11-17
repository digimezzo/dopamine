import { Injectable } from '@angular/core';
import { ApplicationPaths } from '../../common/application/application-paths';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { Strings } from '../../common/strings';
import { TextSanitizer } from '../../common/text-sanitizer';
import { BasePlaylistService } from './base-playlist.service';
import { PlaylistFolderModel } from './playlist-folder-model';
import { PlaylistFolderModelFactory } from './playlist-folder-model-factory';
import { PlaylistModel } from './playlist-model';
import { PlaylistModelFactory } from './playlist-model-factory';

@Injectable()
export class PlaylistService implements BasePlaylistService {
    private _playlistsDirectoryPath: string;

    constructor(
        private playlistFolderModelFactory: PlaylistFolderModelFactory,
        private playlistModelFactory: PlaylistModelFactory,
        private fileSystem: FileSystem,
        private textSanitizer: TextSanitizer,
        private logger: Logger
    ) {
        this.initialize();
    }

    private initialize(): void {
        this._playlistsDirectoryPath = this.getPlaylistsDirectoryPath();
        this.ensurePlaylistsDirectoryExists();
    }

    private ensurePlaylistsDirectoryExists(): void {
        try {
            this.fileSystem.createFullDirectoryPathIfDoesNotExist(this._playlistsDirectoryPath);
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

    public createPlaylistFolder(playlistFolderName: string): void {
        if (Strings.isNullOrWhiteSpace(playlistFolderName)) {
            throw new Error(`playlistFolderName is empty`);
        }

        const sanitizedPlaylistFolderName: string = this.textSanitizer.sanitize(playlistFolderName);
        const fullPlaylistFolderDirectoryPath: string = this.fileSystem.combinePath([
            this._playlistsDirectoryPath,
            sanitizedPlaylistFolderName,
        ]);

        this.fileSystem.createFullDirectoryPathIfDoesNotExist(fullPlaylistFolderDirectoryPath);
    }

    public async getPlaylistFoldersAsync(): Promise<PlaylistFolderModel[]> {
        const playlistFolderPaths: string[] = await this.fileSystem.getDirectoriesInDirectoryAsync(this._playlistsDirectoryPath);
        const playlistFolders: PlaylistFolderModel[] = [];

        for (const playlistFolderPath of playlistFolderPaths) {
            playlistFolders.push(this.playlistFolderModelFactory.create(playlistFolderPath));
        }

        return playlistFolders;
    }

    public deletePlaylistFolder(playlistFolder: PlaylistFolderModel): void {
        this.fileSystem.deleteDirectoryRecursively(playlistFolder.path);
    }

    public renamePlaylistFolder(playlistFolder: PlaylistFolderModel, newName: string): void {
        const sanitizedPlaylistFolderName: string = this.textSanitizer.sanitize(newName);
        this.fileSystem.renameDirectory(playlistFolder.path, sanitizedPlaylistFolderName);
    }

    public async getPlaylistsAsync(playlistFolder: PlaylistFolderModel): Promise<PlaylistModel[]> {
        const playlistPaths: string[] = await this.fileSystem.getFilesInDirectoryAsync(playlistFolder.path);
        const playlists: PlaylistModel[] = [];

        for (const playlistPath of playlistPaths) {
            playlists.push(this.playlistModelFactory.create(playlistPath));
        }

        return playlists;
    }
}
