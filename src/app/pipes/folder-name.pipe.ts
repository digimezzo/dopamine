import { Pipe, PipeTransform } from '@angular/core';
import { FileSystem } from '../core/io/file-system';
import { StringCompare } from '../core/string-compare';
import { FolderModel } from '../services/folder/folder-model';

@Pipe({ name: 'folderName' })
export class FolderNamePipe implements PipeTransform {
    constructor(private fileSystem: FileSystem) {}

    public transform(folder: FolderModel): string {
        if (folder == undefined) {
            return '';
        }

        if (StringCompare.isNullOrWhiteSpace(folder.path)) {
            return '';
        }

        return this.fileSystem.getDirectoryName(folder.path);
    }
}
