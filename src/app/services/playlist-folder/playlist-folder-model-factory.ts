import { Injectable } from '@angular/core';
import { FileSystem } from '../../common/io/file-system';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { PlaylistFolderModel } from './playlist-folder-model';

@Injectable()
export class PlaylistFolderModelFactory {
    constructor(private translatorService: BaseTranslatorService, private fileSystem: FileSystem) {}

    public create(path: string): PlaylistFolderModel {
        return new PlaylistFolderModel(this.fileSystem.getDirectoryOrFileName(path), path, true);
    }

    public createUnsorted(path: string): PlaylistFolderModel {
        return new PlaylistFolderModel(this.translatorService.get('unsorted'), path, false);
    }

    public createDefault(): PlaylistFolderModel {
        return new PlaylistFolderModel('', '', false);
    }
}
