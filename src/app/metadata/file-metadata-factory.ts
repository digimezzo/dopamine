import { Injectable } from '@angular/core';
import { FileMetadata } from './file-metadata';
import { ReadOnlyFileMetadata } from './read-only-file-metadata';

@Injectable({
    providedIn: 'root',
})
export class FileMetadataFactory {
    public async createReadOnlyAsync(path: string): Promise<FileMetadata> {
        return await ReadOnlyFileMetadata.createAsync(path);
    }
}
