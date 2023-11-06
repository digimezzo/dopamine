import { Pipe, PipeTransform } from '@angular/core';
import { StringUtils } from '../../common/utils/string-utils';
import { SubfolderModel } from '../../services/folder/subfolder-model';
import { FileAccessBase } from '../../common/io/file-access.base';

@Pipe({ name: 'subfolderName' })
export class SubfolderNamePipe implements PipeTransform {
    public constructor(private fileAccess: FileAccessBase) {}

    public transform(subfolder: SubfolderModel | undefined): string {
        if (subfolder == undefined) {
            return '';
        }

        if (subfolder.isGoToParent) {
            return '..';
        }

        if (StringUtils.isNullOrWhiteSpace(subfolder.path)) {
            return '';
        }

        return this.fileAccess.getDirectoryOrFileName(subfolder.path);
    }
}
