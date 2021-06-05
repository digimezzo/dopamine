import { Pipe, PipeTransform } from '@angular/core';
import { FileSystem } from '../core/io/file-system';
import { Strings } from '../core/strings';
import { FolderModel } from '../services/folder/folder-model';

@Pipe({ name: 'folderName' })
export class FolderNamePipe implements PipeTransform {
    constructor(private fileSystem: FileSystem) {}

    public transform(folder: FolderModel): string {
        if (folder == undefined) {
            return '';
        }

        if (Strings.isNullOrWhiteSpace(folder.path)) {
            return '';
        }

        return this.fileSystem.getDirectoryName(folder.path);
    }
}
