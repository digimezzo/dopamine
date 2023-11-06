import { Pipe, PipeTransform } from '@angular/core';
import { FolderModel } from '../../services/folder/folder-model';
import { Strings } from '../../common/strings';
import { FileAccessBase } from '../../common/io/file-access.base';

@Pipe({ name: 'folderName' })
export class FolderNamePipe implements PipeTransform {
    public constructor(private fileAccess: FileAccessBase) {}

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
