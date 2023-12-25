const { FileFormats } = require('./file-formats');

class MimeTypes {
    static getMimeTypeForFileExtension(fileExtension) {
        switch (fileExtension.toLowerCase()) {
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

exports.MimeTypes = MimeTypes;
