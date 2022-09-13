import { Injectable } from '@angular/core';
import { FileMetadata } from './file-metadata';

@Injectable()
export class FileMetadataFactory {
    public create(path: string): FileMetadata {
        return new FileMetadata(path);
    }
}
