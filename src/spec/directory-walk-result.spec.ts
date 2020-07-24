import * as assert from 'assert';
import { Times, It, Mock, IMock } from 'typemoq';
import { DirectoryWalkResult } from '../app/services/indexing/directory-walk-result';

describe('DirectoryWalkResult', () => {
    describe('conectructor', () => {
        it('Should set file paths', async () => {
            // Arrange
            const filePaths: string[] = [
                '/home/user/Music/Track 1.mp3',
                '/home/user/Music/Track 2.mp3'
            ];

            const error1: Error = new Error('Error 1');
            const error2: Error = new Error('Error 2');

            const errors: Error[] = [
                error1,
                error2
            ];

            // Act
            const directoryWalkResult: DirectoryWalkResult = new DirectoryWalkResult(filePaths, errors);

            // Assert
            assert.ok(directoryWalkResult.filePaths !== null);
            assert.ok(directoryWalkResult.filePaths.includes('/home/user/Music/Track 1.mp3'));
            assert.ok(directoryWalkResult.filePaths.includes('/home/user/Music/Track 2.mp3'));
        });

        it('Should set errors', async () => {
            // Arrange
            const filePaths: string[] = [
                '/home/user/Music/Track 1.mp3',
                '/home/user/Music/Track 2.mp3'
            ];

            const error1: Error = new Error('Error 1');
            const error2: Error = new Error('Error 2');

            const errors: Error[] = [
                error1,
                error2
            ];

            // Act
            const directoryWalkResult: DirectoryWalkResult = new DirectoryWalkResult(filePaths, errors);

            // Assert
            assert.ok(directoryWalkResult.errors !== null);
            assert.ok(directoryWalkResult.errors.includes(error1));
            assert.ok(directoryWalkResult.errors.includes(error2));
        });
    });
});
