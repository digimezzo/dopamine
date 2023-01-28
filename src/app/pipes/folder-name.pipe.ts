import { Pipe, PipeTransform } from '@angular/core';
import { BaseFileAccess } from '../common/io/base-file-access';
import { Strings } from '../common/strings';
import { FolderModel } from '../services/folder/folder-model';

@Pipe({ name: 'folderName' })
export class FolderNamePipe implements PipeTransform {
    constructor(private fileAccess: BaseFileAccess) {}

    public transform(folder: FolderModel): string {
        if (folder == undefined) {
            return '';
        }

        if (Strings.isNullOrWhiteSpace(folder.path)) {
            return '';
        }

        return this.fileAccess.getDirectoryOrFileName(folder.path);
    }
}
