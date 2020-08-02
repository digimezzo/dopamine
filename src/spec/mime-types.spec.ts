import * as assert from 'assert';
import { MimeTypes } from '../app/metadata/mime-types';

describe('MimeTypes', () => {
    describe('getMimeTypeForFileExtension', () => {
        it('Should return audio/mpeg for file extension .mp3', () => {
            // Arrange
            const possiblySplittedMetadata: string[] = null;

            // Act
            const mimeType: string = MimeTypes.getMimeTypeForFileExtension('.mp3');

            // Assert
            assert.strictEqual(mimeType, 'audio/mpeg');
        });

        it('Should return an empty string for an unknown file extension', () => {
            // Arrange
            const possiblySplittedMetadata: string[] = null;

            // Act
            const mimeType: string = MimeTypes.getMimeTypeForFileExtension('.doc');

            // Assert
            assert.strictEqual(mimeType, '');
        });
    });
});
