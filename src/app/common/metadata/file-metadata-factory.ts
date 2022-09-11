import { Injectable } from '@angular/core';
import { FileMetadata } from './file-metadata';
import { Metadata } from './metadata';

@Injectable()
export class FileMetadataFactory {
    public create(path: string): Metadata {
        return new FileMetadata(path);
    }
}
