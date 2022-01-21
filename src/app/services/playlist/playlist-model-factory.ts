import { Injectable } from '@angular/core';
import { Constants } from '../../common/application/constants';
import { FileFormats } from '../../common/application/file-formats';
import { FileSystem } from '../../common/io/file-system';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { PlaylistModel } from './playlist-model';

@Injectable()
export class PlaylistModelFactory {
    constructor(private translatorService: BaseTranslatorService, private fileSystem: FileSystem) {}

    public create(playlistsParentFolderPath: string, playlistPath: string): PlaylistModel {
        return new PlaylistModel(
            this.getPlaylistName(playlistPath),
            this.getPlaylistFolderName(playlistsParentFolderPath, playlistPath),
            playlistPath,
            this.getPlaylistImage(playlistPath)
        );
    }

    public createDefault(): PlaylistModel {
        return new PlaylistModel('', '', '', Constants.emptyImage);
    }

    private getPlaylistName(playlistPath: string): string {
        return this.fileSystem.getFileName(playlistPath);
    }

    private getPlaylistFolderName(playlistsParentFolderPath: string, playlistPath: string): string {
        const directoryPath: string = this.fileSystem.getDirectoryPath(playlistPath);
        let directoryName: string = '';

        if (directoryPath === playlistsParentFolderPath) {
            directoryName = this.translatorService.get('unsorted');
        } else {
            directoryName = this.fileSystem.getDirectoryOrFileName(directoryPath);
        }

        return directoryName;
    }

    private getPlaylistImage(playlistPath: string): string {
        for (const playlistImageExtension of FileFormats.supportedPlaylistImageExtensions) {
            const playlistImagePath: string = this.fileSystem.changeFileExtension(playlistPath, playlistImageExtension);

            if (this.fileSystem.pathExists(playlistImagePath)) {
                return playlistImagePath;
            }
        }

        return Constants.emptyImage;
    }
}
