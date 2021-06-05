import { Pipe, PipeTransform } from '@angular/core';
import { FileSystem } from '../core/io/file-system';
import { Strings } from '../core/strings';
import { SubfolderModel } from '../services/folder/subfolder-model';

@Pipe({ name: 'subfolderName' })
export class SubfolderNamePipe implements PipeTransform {
    constructor(private fileSystem: FileSystem) {}

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

        return this.fileSystem.getDirectoryName(subfolder.path);
    }
}
