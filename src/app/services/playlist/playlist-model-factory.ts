import { Injectable } from '@angular/core';
import { Constants } from '../../common/application/constants';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { Strings } from '../../common/strings';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { PlaylistModel } from './playlist-model';

@Injectable()
export class PlaylistModelFactory {
    constructor(private translatorService: BaseTranslatorService, private fileAccess: BaseFileAccess) {}

    public create(playlistsParentFolderPath: string, playlistPath: string, playlistImagePath: string): PlaylistModel {
        return new PlaylistModel(
            this.getPlaylistName(playlistPath),
            this.getPlaylistFolderName(playlistsParentFolderPath, playlistPath),
            playlistPath,
            this.getPlaylistImage(playlistImagePath)
        );
    }

    public createDefault(): PlaylistModel {
        return new PlaylistModel('', '', '', Constants.emptyImage);
    }

    private getPlaylistName(playlistPath: string): string {
        return this.fileAccess.getFileNameWithoutExtension(playlistPath);
    }

    private getPlaylistFolderName(playlistsParentFolderPath: string, playlistPath: string): string {
        const directoryPath: string = this.fileAccess.getDirectoryPath(playlistPath);
        let directoryName: string = '';

        if (directoryPath === playlistsParentFolderPath) {
            directoryName = this.translatorService.get('unsorted');
        } else {
            directoryName = this.fileAccess.getDirectoryOrFileName(directoryPath);
        }

        return directoryName;
    }

    private getPlaylistImage(playlistImagePath: string): string {
        if (!Strings.isNullOrWhiteSpace(playlistImagePath)) {
            return playlistImagePath;
        }

        return Constants.emptyImage;
    }
}
