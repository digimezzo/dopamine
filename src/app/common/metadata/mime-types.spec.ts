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
