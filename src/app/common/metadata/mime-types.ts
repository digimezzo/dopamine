import { Injectable } from '@angular/core';
import { FileFormats } from '../application/file-formats';

@Injectable()
export class MimeTypes {
    public getMimeTypeForFileExtension(fileExtension: string): string {
        switch (fileExtension) {
            case FileFormats.mp3:
                return 'audio/mpeg';
            default:
                return '';
        }
    }
}
