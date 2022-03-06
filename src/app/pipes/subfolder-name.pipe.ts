import { Pipe, PipeTransform } from '@angular/core';
import { BaseFileSystem } from '../common/io/base-file-system';
import { Strings } from '../common/strings';
import { SubfolderModel } from '../services/folder/subfolder-model';

@Pipe({ name: 'subfolderName' })
export class SubfolderNamePipe implements PipeTransform {
    constructor(private fileSystem: BaseFileSystem) {}

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

        return this.fileSystem.getDirectoryOrFileName(subfolder.path);
    }
}
