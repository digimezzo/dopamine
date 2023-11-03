import { Injectable } from '@angular/core';
import { BaseFileMetadataFactory } from './base-file-metadata-factory';
import { IFileMetadata } from './i-file-metadata';
import { TagLibFileMetadata } from './tag-lib-file-metadata';

@Injectable()
export class FileMetadataFactory implements BaseFileMetadataFactory {
    public async createAsync(path: string): Promise<IFileMetadata> {
        const fileMetadata: IFileMetadata = new TagLibFileMetadata(path);
        await fileMetadata.loadAsync();

        return fileMetadata;
    }
}
