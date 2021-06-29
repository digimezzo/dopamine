import { Injectable } from '@angular/core';
import { FileFormats } from '../application/file-formats';

@Injectable()
export class MimeTypes {
    public getMimeTypeForFileExtension(fileExtension: string): string {
        switch (fileExtension) {
            case FileFormats.mp3:
                return 'audio/mpeg';
            case FileFormats.flac:
                return 'audio/flac';
            case FileFormats.ogg:
                return 'audio/ogg';
            case FileFormats.m4a:
                return 'audio/m4a';
            // case FileFormats.wma:
            //     return 'audio/x-ms-wma';
            default:
                return '';
        }
    }
}
