import { Folder } from './folder';

describe('Folder', () => {
    describe('constructor', () => {
        it('should set path', () => {
            // Arrange

            // Act
            const folder: Folder = new Folder('/home/myself/Music');

            // Assert
            expect(folder.path).toEqual('/home/myself/Music');
        });
    });
});
