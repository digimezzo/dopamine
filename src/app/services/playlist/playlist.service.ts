import { Injectable } from '@angular/core';
import { ApplicationPaths } from '../../common/application/application-paths';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { BasePlaylistService } from './base-playlist.service';

@Injectable()
export class PlaylistService implements BasePlaylistService {
    private _playlistsDirectoryPath: string;

    constructor(private fileSystem: FileSystem, private logger: Logger) {
        this.initialize();
    }

    public createPlaylistFolder(playlistFolderName: string): boolean {
        throw new Error('Method not implemented.');
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
}
