import { FileFormats } from '../src/app/common/application/file-formats';

export class MimeTypes {
    public static getMimeTypeForFileExtension(fileExtension: string): string {
        switch (fileExtension) {
            case FileFormats.mp3:
                return 'audio/mpeg';
            case FileFormats.flac:
                return 'audio/flac';
            case FileFormats.ogg:
                return 'audio/ogg';
            case FileFormats.m4a:
                return 'audio/m4a';
            case FileFormats.opus:
                return 'audio/ogg';
            case FileFormats.wav:
                return 'audio/wav';
            default:
                return '';
        }
    }
}
