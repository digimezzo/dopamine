import { Injectable } from '@angular/core';
import { FileFormats } from './application/file-formats';
import { FileSystem } from './io/file-system';

@Injectable()
export class FileValidator {
    public constructor(private fileSystem: FileSystem) {}

    public isPlayableAudioFile(filePath: string): boolean {
        if (!this.fileSystem.pathExists(filePath)) {
            return false;
        }

        const fileExtension: string = this.fileSystem.getFileExtension(filePath);

        if (!FileFormats.supportedAudioExtensions.includes(fileExtension.toLowerCase())) {
            return false;
        }

        return true;
    }
}
