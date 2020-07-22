import * as assert from 'assert';
import { Times, It, Mock, IMock } from 'typemoq';
import { IndexablePath } from '../app/services/indexing/indexable-path';

describe('FolderPathInfo', () => {
    describe('constructor', () => {
        it('Should set path', () => {
            // Arrange
            // Act
            const indexablePath: IndexablePath = new IndexablePath('/home/user/Music/Song.mp3', 123456789, 1);

            // Assert
            assert.strictEqual(indexablePath.path, '/home/user/Music/Song.mp3');
        });

        it('Should set dateModifiedTicks', () => {
            // Arrange
            // Act
            const indexablePath: IndexablePath = new IndexablePath('/home/user/Music/Song.mp3', 123456789, 1);

            // Assert
            assert.strictEqual(indexablePath.dateModifiedTicks, 123456789);
        });

        it('Should set folderId', () => {
            // Arrange
            // Act
            const indexablePath: IndexablePath = new IndexablePath('/home/user/Music/Song.mp3', 123456789, 1);

            // Assert
            assert.strictEqual(indexablePath.folderId, 1);
        });
    });
});
