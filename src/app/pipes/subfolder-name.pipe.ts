import { Pipe, PipeTransform } from '@angular/core';
import { BaseFileAccess } from '../common/io/base-file-access';
import { Strings } from '../common/strings';
import { SubfolderModel } from '../services/folder/subfolder-model';

@Pipe({ name: 'subfolderName' })
export class SubfolderNamePipe implements PipeTransform {
    constructor(private fileAccess: BaseFileAccess) {}

    public transform(subfolder: SubfolderModel): string {
        if (subfolder == undefined) {
            return '';
        }

        if (subfolder.isGoToParent) {
            return '..';
        }

        if (Strings.isNullOrWhiteSpace(subfolder.path)) {
            return '';
        }

        return this.fileAccess.getDirectoryOrFileName(subfolder.path);
    }
}
