import { MimeTypes } from './mime-types';

describe('MimeTypes', () => {
    describe('getMimeTypeForFileExtension', () => {
        it('should return audio/mpeg for file extension .mp3', () => {
            // Arrange
            const mimeTypes: MimeTypes = new MimeTypes();

            // Act
            const mimeType: string = mimeTypes.getMimeTypeForFileExtension('.mp3');

            // Assert
            expect(mimeType).toEqual('audio/mpeg');
        });

        it('should return audio/flac for file extension .flac', () => {
            // Arrange
            const mimeTypes: MimeTypes = new MimeTypes();

            // Act
            const mimeType: string = mimeTypes.getMimeTypeForFileExtension('.flac');

            // Assert
            expect(mimeType).toEqual('audio/flac');
        });

        it('should return audio/ogg for file extension .ogg', () => {
            // Arrange
            const mimeTypes: MimeTypes = new MimeTypes();

            // Act
            const mimeType: string = mimeTypes.getMimeTypeForFileExtension('.ogg');

            // Assert
            expect(mimeType).toEqual('audio/ogg');
        });

        it('should return audio/m4a for file extension .m4a', () => {
            // Arrange
            const mimeTypes: MimeTypes = new MimeTypes();

            // Act
            const mimeType: string = mimeTypes.getMimeTypeForFileExtension('.m4a');

            // Assert
            expect(mimeType).toEqual('audio/m4a');
        });

        it('should return audio/ogg for file extension .opus', () => {
            // Arrange
            const mimeTypes: MimeTypes = new MimeTypes();

            // Act
            const mimeType: string = mimeTypes.getMimeTypeForFileExtension('.opus');

            // Assert
            expect(mimeType).toEqual('audio/ogg');
        });

        it('should return audio/wav for file extension .wav', () => {
            // Arrange
            const mimeTypes: MimeTypes = new MimeTypes();

            // Act
            const mimeType: string = mimeTypes.getMimeTypeForFileExtension('.wav');

            // Assert
            expect(mimeType).toEqual('audio/wav');
        });

        it('should return an empty string for an unknown file extension', () => {
            // Arrange
            const mimeTypes: MimeTypes = new MimeTypes();

            // Act
            const mimeType: string = mimeTypes.getMimeTypeForFileExtension('.doc');

            // Assert
            expect(mimeType).toEqual('');
        });
    });
});
