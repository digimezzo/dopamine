import { Injectable } from '@angular/core';
import { FileMetadata } from './file-metadata';
import { ReadOnlyFileMetadata } from './read-only-file-metadata';

@Injectable({
    providedIn: 'root'
})
export class FileMetadataFactory {
    public createReadOnly(path: string): FileMetadata {
        return new ReadOnlyFileMetadata(path);
    }
}
