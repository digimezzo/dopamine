import { Injectable } from '@angular/core';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { PlaylistFolderModel } from './playlist-folder-model';
import { TranslatorServiceBase } from '../translator/translator.service.base';

@Injectable()
export class PlaylistFolderModelFactory {
    public constructor(
        private translatorService: TranslatorServiceBase,
        private fileAccess: BaseFileAccess,
    ) {}

    public create(path: string): PlaylistFolderModel {
        return new PlaylistFolderModel(this.fileAccess.getDirectoryOrFileName(path), path, true);
    }

    public createUnsorted(path: string): PlaylistFolderModel {
        return new PlaylistFolderModel(this.translatorService.get('unsorted'), path, false);
    }

    public createDefault(): PlaylistFolderModel {
        return new PlaylistFolderModel('', '', false);
    }
}
