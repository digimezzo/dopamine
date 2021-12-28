import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApplicationPaths } from '../../common/application/application-paths';
import { FileFormats } from '../../common/application/file-formats';
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
    private playlistFoldersChanged: Subject<void> = new Subject();
    private playlistsChanged: Subject<void> = new Subject();

    constructor(
        private playlistFolderModelFactory: PlaylistFolderModelFactory,
        private playlistModelFactory: PlaylistModelFactory,
        private fileSystem: FileSystem,
        private textSanitizer: TextSanitizer,
        private logger: Logger
    ) {
        this.initialize();
    }

    public playlistFoldersChanged$: Observable<void> = this.playlistFoldersChanged.asObservable();
    public playlistsChanged$: Observable<void> = this.playlistsChanged.asObservable();

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

        this.playlistFoldersChanged.next();
    }

    public async getPlaylistFoldersAsync(): Promise<PlaylistFolderModel[]> {
        const filesInParentFolder: string[] = await this.fileSystem.getFilesInDirectoryAsync(this._playlistsDirectoryPath);
        const playlistsInParentFolder: string[] = this.getSupportedPlaylistPaths(filesInParentFolder);
        const playlistFolderPaths: string[] = await this.fileSystem.getDirectoriesInDirectoryAsync(this._playlistsDirectoryPath);
        const playlistFolders: PlaylistFolderModel[] = [];

        if (playlistsInParentFolder.length > 0) {
            playlistFolders.push(this.playlistFolderModelFactory.createUnsorted(this._playlistsDirectoryPath));
        }

        for (const playlistFolderPath of playlistFolderPaths) {
            playlistFolders.push(this.playlistFolderModelFactory.create(playlistFolderPath));
        }

        return playlistFolders.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
    }

    public deletePlaylistFolder(playlistFolder: PlaylistFolderModel): void {
        this.fileSystem.deleteDirectoryRecursively(playlistFolder.path);

        this.playlistFoldersChanged.next();
    }

    public renamePlaylistFolder(playlistFolder: PlaylistFolderModel, newName: string): void {
        const sanitizedPlaylistFolderName: string = this.textSanitizer.sanitize(newName);
        this.fileSystem.renameFileOrDirectory(playlistFolder.path, sanitizedPlaylistFolderName);

        this.playlistFoldersChanged.next();
    }

    public async getPlaylistsAsync(playlistFolders: PlaylistFolderModel[]): Promise<PlaylistModel[]> {
        const playlists: PlaylistModel[] = [];

        for (const playlistFolder of playlistFolders) {
            const playlistPaths: string[] = await this.fileSystem.getFilesInDirectoryAsync(playlistFolder.path);

            for (const playlistPath of playlistPaths) {
                playlists.push(this.playlistModelFactory.create(playlistPath));
            }
        }

        return playlists;
    }

    public async deletePlaylistAsync(playlist: PlaylistModel): Promise<void> {
        await this.fileSystem.deleteFileIfExistsAsync(playlist.path);

        this.playlistFoldersChanged.next();
    }

    public async updatePlaylistDetailsAsync(playlist: PlaylistModel, newName: string): Promise<void> {
        const extension: string = this.fileSystem.getFileExtension(playlist.path);
        this.fileSystem.renameFileOrDirectory(playlist.path, `${newName}${extension}`);

        this.playlistsChanged.next();
    }

    private getSupportedPlaylistPaths(proposedFilePaths: string[]): string[] {
        const supportedPlaylistsPaths: string[] = [];

        for (const proposedFilePath of proposedFilePaths) {
            if (this.isSupportedPlaylistFile(proposedFilePath)) {
                supportedPlaylistsPaths.push(proposedFilePath);
            }
        }

        return supportedPlaylistsPaths;
    }

    private isSupportedPlaylistFile(filePath: string): boolean {
        const fileExtension: string = this.fileSystem.getFileExtension(filePath);

        if (FileFormats.supportedPlaylistExtensions.includes(fileExtension.toLowerCase())) {
            return true;
        }

        return false;
    }
}
