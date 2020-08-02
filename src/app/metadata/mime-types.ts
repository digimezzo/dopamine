import { FileFormats } from '../core/base/file-formats';

export class MimeTypes {
    public static getMimeTypeForFileExtension(fileExtension: string): string {
        switch (fileExtension) {
            case FileFormats.mp3:
                return 'audio/mpeg';
            default:
                return '';
        }
    }
}
