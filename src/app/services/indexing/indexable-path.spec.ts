import { IndexablePath } from './indexable-path';

describe('FolderPathInfo', () => {
    describe('constructor', () => {
        it('should set path', () => {
            // Arrange

            // Act
            const indexablePath: IndexablePath = new IndexablePath('/home/user/Music/Track.mp3', 123456789, 1);

            // Assert
            expect(indexablePath.path).toEqual('/home/user/Music/Track.mp3');
        });

        it('should set dateModifiedTicks', () => {
            // Arrange

            // Act
            const indexablePath: IndexablePath = new IndexablePath('/home/user/Music/Track.mp3', 123456789, 1);

            // Assert
            expect(indexablePath.dateModifiedTicks).toEqual(123456789);
        });

        it('should set folderId', () => {
            // Arrange

            // Act
            const indexablePath: IndexablePath = new IndexablePath('/home/user/Music/Track.mp3', 123456789, 1);

            // Assert
            expect(indexablePath.folderId).toEqual(1);
        });
    });
});
