import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApplicationPaths } from '../../common/application/application-paths';
import { Constants } from '../../common/application/constants';
import { FileFormats } from '../../common/application/file-formats';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { Strings } from '../../common/strings';
import { TextSanitizer } from '../../common/text-sanitizer';
import { BasePlaylistService } from './base-playlist.service';
import { PlaylistFolderModel } from './playlist-folder-model';
import { PlaylistFolderModelFactory } from './playlist-folder-model-factory';
import { PlaylistImagePathCreator } from './playlist-image-path-creator';
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
        private playlistImagePathCreator: PlaylistImagePathCreator,
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

    public async getPlaylistFoldersAsync(): Promise<PlaylistFolderModel[]> {
        const playlistsInParentFolder: PlaylistModel[] = await this.getPlaylistsInPathAsync(this._playlistsDirectoryPath);
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
            const playlistsInPlaylistFolder: PlaylistModel[] = await this.getPlaylistsInPathAsync(playlistFolder.path);
            playlists.push(...playlistsInPlaylistFolder);
        }

        return playlists;
    }

    public async deletePlaylistAsync(playlist: PlaylistModel): Promise<void> {
        await this.fileSystem.deleteFileIfExistsAsync(playlist.path);

        this.playlistFoldersChanged.next();
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
