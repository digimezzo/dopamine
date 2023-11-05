import { Pipe, PipeTransform } from '@angular/core';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { FolderModel } from '../../services/folder/folder-model';
import { Strings } from '../../common/strings';

@Pipe({ name: 'folderName' })
export class FolderNamePipe implements PipeTransform {
    public constructor(private fileAccess: BaseFileAccess) {}

    public transform(folder: FolderModel | undefined): string {
        if (folder == undefined) {
            return '';
        }

        if (Strings.isNullOrWhiteSpace(folder.path)) {
            return '';
        }

        return this.fileAccess.getDirectoryOrFileName(folder.path);
    }
}
