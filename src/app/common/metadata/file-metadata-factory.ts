import { Injectable } from '@angular/core';
import { FileFormats } from '../application/file-formats';
import { BaseFileSystem } from '../io/base-file-system';
import { BaseFileMetadataFactory } from './base-file-metadata-factory';
import { IFileMetadata } from './i-file-metadata';
import { MusicMetadataFileMetadata } from './music-metadata-file-meta-data';
import { TagLibFileMetadata } from './tag-lib-file-metadata';

@Injectable()
export class FileMetadataFactory implements BaseFileMetadataFactory {
    public constructor(private fileSystem: BaseFileSystem) {}

    public async createAsync(path: string): Promise<IFileMetadata> {
        let fileMetadata: IFileMetadata;

        const fileExtension = this.fileSystem.getFileExtension(path).toLowerCase();

        switch (fileExtension) {
            case FileFormats.mp3:
                fileMetadata = new TagLibFileMetadata(path);
                break;
            case FileFormats.flac:
                fileMetadata = new TagLibFileMetadata(path);
                break;
            case FileFormats.ogg:
                fileMetadata = new TagLibFileMetadata(path);
                break;
            case FileFormats.m4a:
                fileMetadata = new MusicMetadataFileMetadata(path);
                break;
            case FileFormats.opus:
                fileMetadata = new MusicMetadataFileMetadata(path);
                break;
            case FileFormats.wav:
                fileMetadata = new TagLibFileMetadata(path);
                break;
            default:
                fileMetadata = new TagLibFileMetadata(path);
                break;
        }

        await fileMetadata.loadAsync();

        return fileMetadata;
    }
}
