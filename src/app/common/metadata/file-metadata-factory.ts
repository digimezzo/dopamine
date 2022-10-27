import { Injectable } from '@angular/core';
import { FileMetadata } from './file-metadata';
import { IFileMetadata } from './i-file-metadata';

@Injectable()
export class FileMetadataFactory {
    public async createAsync(path: string): Promise<IFileMetadata> {
        const fileMetadata: FileMetadata = new FileMetadata(path);
        await fileMetadata.loadAsync();

        return fileMetadata;
    }
}
