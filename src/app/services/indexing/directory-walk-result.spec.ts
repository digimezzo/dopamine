import { DirectoryWalkResult } from './directory-walk-result';

describe('DirectoryWalkResult', () => {
    describe('constructor', () => {
        it('should set file paths', async () => {
            // Arrange
            const filePaths: string[] = ['/home/user/Music/Track 1.mp3', '/home/user/Music/Track 2.mp3'];

            const error1: Error = new Error('Error 1');
            const error2: Error = new Error('Error 2');

            const errors: Error[] = [error1, error2];

            // Act
            const directoryWalkResult: DirectoryWalkResult = new DirectoryWalkResult(filePaths, errors);

            // Assert
            expect(directoryWalkResult.filePaths).toBeDefined();
            expect(directoryWalkResult.filePaths.includes('/home/user/Music/Track 1.mp3')).toBeTruthy();
            expect(directoryWalkResult.filePaths.includes('/home/user/Music/Track 2.mp3')).toBeTruthy();
        });

        it('should set errors', async () => {
            // Arrange
            const filePaths: string[] = ['/home/user/Music/Track 1.mp3', '/home/user/Music/Track 2.mp3'];

            const error1: Error = new Error('Error 1');
            const error2: Error = new Error('Error 2');

            const errors: Error[] = [error1, error2];

            // Act
            const directoryWalkResult: DirectoryWalkResult = new DirectoryWalkResult(filePaths, errors);

            // Assert
            expect(directoryWalkResult.errors).toBeDefined();
            expect(directoryWalkResult.errors.includes(error1)).toBeTruthy();
            expect(directoryWalkResult.errors.includes(error2)).toBeTruthy();
        });
    });
});
