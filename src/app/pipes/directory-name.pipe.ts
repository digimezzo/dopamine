import { Pipe, PipeTransform } from '@angular/core';
import { FileSystem } from '../core/io/file-system';
import { StringCompare } from '../core/string-compare';

@Pipe({ name: 'directoryName' })
export class DirectoryNamePipe implements PipeTransform {
    constructor(private fileSystem: FileSystem) {
    }

    public transform(directoryPath: string): string {
        if (StringCompare.isNullOrWhiteSpace(directoryPath)) {
            return '';
        }

        return this.fileSystem.getDirectoryName(directoryPath);
    }
}
