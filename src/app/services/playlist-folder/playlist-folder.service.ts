import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { Strings } from '../../common/strings';
import { TextSanitizer } from '../../common/text-sanitizer';
import { BasePlaylistService } from '../playlist/base-playlist.service';
import { BasePlaylistFolderService } from './base-playlist-folder.service';
import { PlaylistFolderModel } from './playlist-folder-model';
import { PlaylistFolderModelFactory } from './playlist-folder-model-factory';

@Injectable()
export class PlaylistFolderService implements BasePlaylistFolderService {
    private playlistFoldersChanged: Subject<void> = new Subject();

    constructor(
        private playlistService: BasePlaylistService,
        private playlistFolderModelFactory: PlaylistFolderModelFactory,
        private fileAccess: BaseFileAccess,
        private textSanitizer: TextSanitizer
    ) {}

    public playlistFoldersChanged$: Observable<void> = this.playlistFoldersChanged.asObservable();

    public async getPlaylistFoldersAsync(): Promise<PlaylistFolderModel[]> {
        const playlistFolderPaths: string[] = await this.fileAccess.getDirectoriesInDirectoryAsync(
            this.playlistService.playlistsParentFolderPath
        );
        const playlistFolders: PlaylistFolderModel[] = [];

        playlistFolders.push(this.playlistFolderModelFactory.createUnsorted(this.playlistService.playlistsParentFolderPath));

        for (const playlistFolderPath of playlistFolderPaths) {
            playlistFolders.push(this.playlistFolderModelFactory.create(playlistFolderPath));
        }

        return playlistFolders.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
    }

    public deletePlaylistFolder(playlistFolder: PlaylistFolderModel): void {
        this.fileAccess.deleteDirectoryRecursively(playlistFolder.path);

        this.playlistFoldersChanged.next();
    }

    public renamePlaylistFolder(playlistFolder: PlaylistFolderModel, newName: string): void {
        const sanitizedPlaylistFolderName: string = this.textSanitizer.sanitize(newName);
        const newPlaylistFolderPath: string = this.fileAccess.changeFolderName(playlistFolder.path, sanitizedPlaylistFolderName);
        this.fileAccess.renameFileOrDirectory(playlistFolder.path, newPlaylistFolderPath);

        this.playlistFoldersChanged.next();
    }

    public createPlaylistFolder(playlistFolderName: string): void {
        if (Strings.isNullOrWhiteSpace(playlistFolderName)) {
            throw new Error(`playlistFolderName is empty`);
        }

        const sanitizedPlaylistFolderName: string = this.textSanitizer.sanitize(playlistFolderName);
        const fullPlaylistFolderDirectoryPath: string = this.fileAccess.combinePath([
            this.playlistService.playlistsParentFolderPath,
            sanitizedPlaylistFolderName,
        ]);

        this.fileAccess.createFullDirectoryPathIfDoesNotExist(fullPlaylistFolderDirectoryPath);

        this.playlistFoldersChanged.next();
    }
}
