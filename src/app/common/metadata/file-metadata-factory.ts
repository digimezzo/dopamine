import { Injectable } from '@angular/core';
import { FileFormats } from '../application/file-formats';
import { BaseFileSystem } from '../io/base-file-system';
import { FileMetadata } from './tag-lib-file-metadata';
import { IFileMetadata } from './i-file-metadata';
import { BaseFileMetadataFactory } from './base-file-metadata-factory';

@Injectable()
export class FileMetadataFactory implements BaseFileMetadataFactory {
    public constructor(private fileSystem: BaseFileSystem){
    }

    public async createAsync(path: string): Promise<IFileMetadata> {
        let fileMetadata: IFileMetadata;

        const fileExtension = this.fileSystem.getFileExtension(path).toLowerCase();

        switch (fileExtension) {
            case FileFormats.mp3:
                fileMetadata = new FileMetadata(path);
                break;
            case FileFormats.flac:
                fileMetadata = new FileMetadata(path);
                break;
            case FileFormats.ogg:
                fileMetadata = new FileMetadata(path);
                break;
            case FileFormats.m4a:
                fileMetadata = new FileMetadata(path);
                break;
            case FileFormats.opus:
                fileMetadata = new FileMetadata(path);
                break;
            case FileFormats.wav:
                fileMetadata = new FileMetadata(path);
                break;
            default:
                fileMetadata = new FileMetadata(path);
                break;
        }

        await fileMetadata.loadAsync();

        return fileMetadata;
    }
}
