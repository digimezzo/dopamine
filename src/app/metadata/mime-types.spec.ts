import * as assert from 'assert';
import { MimeTypes } from './mime-types';

describe('MimeTypes', () => {
    describe('getMimeTypeForFileExtension', () => {
        it('should return audio/mpeg for file extension .mp3', () => {
            // Arrange
            const mimeTypes: MimeTypes = new MimeTypes();

            // Act
            const mimeType: string = mimeTypes.getMimeTypeForFileExtension('.mp3');

            // Assert
            assert.strictEqual(mimeType, 'audio/mpeg');
        });

        it('should return an empty string for an unknown file extension', () => {
            // Arrange
            const mimeTypes: MimeTypes = new MimeTypes();

            // Act
            const mimeType: string = mimeTypes.getMimeTypeForFileExtension('.doc');

            // Assert
            assert.strictEqual(mimeType, '');
        });
    });
});
