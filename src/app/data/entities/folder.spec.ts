import * as assert from 'assert';
import { Folder } from './folder';

describe('Folder', () => {
    describe('constructor', () => {
        it('should set path', () => {
            // Arrange

            // Act
            const folder: Folder = new Folder('/home/myself/Music');

            // Assert
            assert.ok(folder.path === '/home/myself/Music');
        });
    });
});
