import { Pipe, PipeTransform } from '@angular/core';
import { FolderModel } from '../../services/folder/folder-model';
import { StringUtils } from '../../common/utils/string-utils';
import { FileAccessBase } from '../../common/io/file-access.base';

@Pipe({ name: 'folderName' })
export class FolderNamePipe implements PipeTransform {
    public constructor(private fileAccess: FileAccessBase) {}

    public transform(folder: FolderModel | undefined): string {
        if (folder == undefined) {
            return '';
        }

        if (StringUtils.isNullOrWhiteSpace(folder.path)) {
            return '';
        }

        return this.fileAccess.getDirectoryOrFileName(folder.path);
    }
}
