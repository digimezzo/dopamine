import { Injectable } from '@angular/core';
import { IFileMetadata } from './i-file-metadata';
import { MusicFileMetadata } from './music-file-metadata';
import { FileMetadataFactoryBase } from './file-metadata.factory.base';

@Injectable()
export class FileMetadataFactory implements FileMetadataFactoryBase {
    public async createAsync(path: string): Promise<IFileMetadata> {
        const fileMetadata: IFileMetadata = new MusicFileMetadata(path);
        await fileMetadata.loadAsync();

        return fileMetadata;
    }
}
