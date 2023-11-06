import { Injectable } from '@angular/core';
import { IFileMetadata } from './i-file-metadata';
import { TagLibFileMetadata } from './tag-lib-file-metadata';
import { FileMetadataFactoryBase } from './file-metadata.factory.base';

@Injectable()
export class FileMetadataFactory implements FileMetadataFactoryBase {
    public async createAsync(path: string): Promise<IFileMetadata> {
        const fileMetadata: IFileMetadata = new TagLibFileMetadata(path);
        await fileMetadata.loadAsync();

        return fileMetadata;
    }
}
