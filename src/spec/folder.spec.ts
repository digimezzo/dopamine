import * as assert from 'assert';
import * as TypeMoq from 'typemoq';
import { Folder } from '../app/data/entities/folder';

describe('Folder', () => {
    describe('constructor', () => {
        it('Should set path', () => {
            // Arrange
            // Act
            const folder: Folder = new Folder('/home/myself/Music');

            // Assert
            assert.ok(folder.path === '/home/myself/Music');
        });
    });
});
