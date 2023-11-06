import { Injectable } from '@angular/core';
import { PlaylistFolderModel } from './playlist-folder-model';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import {FileAccessBase} from "../../common/io/file-access.base";

@Injectable()
export class PlaylistFolderModelFactory {
    public constructor(
        private translatorService: TranslatorServiceBase,
        private fileAccess: FileAccessBase,
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
