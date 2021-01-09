import * as assert from 'assert';
import * as path from 'path';
import { IMock, It, Mock } from 'typemoq';
import { FileSystem } from '../app/core/io/file-system';
import { ExternalArtworkPathGetter } from '../app/services/indexing/external-artwork-path-getter';

describe('ExternalArtworkPathGetter', () => {
    describe('getExternalArtworkPath', () => {
        it('Should return undefined if audio file path is undefined', () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const externalArtworkPathGetter: ExternalArtworkPathGetter = new ExternalArtworkPathGetter(fileSystemMock.object);

            // Act
            const externalArtworkPath: string = externalArtworkPathGetter.getExternalArtworkPath(undefined);

            // Assert
            assert.strictEqual(externalArtworkPath, undefined);
        });

        it('Should return undefined if there is no file that matches an external artwork pattern in the same directory', () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const externalArtworkPathGetter: ExternalArtworkPathGetter = new ExternalArtworkPathGetter(fileSystemMock.object);
            const audioFilePath: string = '/home/MyUser/Music/MyMusicFile.mp3';

            fileSystemMock.setup((x) => x.getDirectoryPath(audioFilePath)).returns(() => '/home/MyUser/Music');
            fileSystemMock.setup((x) => x.getFileNameWithoutExtension(audioFilePath)).returns(() => 'MyMusicFile');
            fileSystemMock.setup((x) => x.pathExists(It.isAnyString())).returns(() => false);

            // Act
            const externalArtworkPath: string = externalArtworkPathGetter.getExternalArtworkPath(audioFilePath);

            // Assert
            assert.strictEqual(externalArtworkPath, undefined);
        });

        it('Should return a path if there is a file that matches a fixed external artwork pattern in the same directory', () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const externalArtworkPathGetter: ExternalArtworkPathGetter = new ExternalArtworkPathGetter(fileSystemMock.object);
            const audioFilePath: string = '/home/MyUser/Music/MyMusicFile.mp3';
            const expectedArtworkPath: string = path.join('/home/MyUser/Music', 'front.png');

            fileSystemMock.setup((x) => x.getDirectoryPath(audioFilePath)).returns(() => '/home/MyUser/Music');
            fileSystemMock.setup((x) => x.getFileNameWithoutExtension(audioFilePath)).returns(() => 'MyMusicFile');
            fileSystemMock.setup((x) => x.pathExists(expectedArtworkPath)).returns(() => true);

            // Act
            const externalArtworkPath: string = externalArtworkPathGetter.getExternalArtworkPath(audioFilePath);

            // Assert
            assert.strictEqual(externalArtworkPath, expectedArtworkPath);
        });

        it('Should return a path if there is a file that matches a template external artwork pattern in the same directory', () => {
            // Arrange
            const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
            const externalArtworkPathGetter: ExternalArtworkPathGetter = new ExternalArtworkPathGetter(fileSystemMock.object);
            const audioFilePath: string = '/home/MyUser/Music/MyMusicFile.mp3';
            const expectedArtworkPath: string = path.join('/home/MyUser/Music', 'MyMusicFile.png');

            fileSystemMock.setup((x) => x.getDirectoryPath(audioFilePath)).returns(() => '/home/MyUser/Music');
            fileSystemMock.setup((x) => x.getFileNameWithoutExtension(audioFilePath)).returns(() => 'MyMusicFile');
            fileSystemMock.setup((x) => x.pathExists(expectedArtworkPath)).returns(() => true);

            // Act
            const externalArtworkPath: string = externalArtworkPathGetter.getExternalArtworkPath(audioFilePath);

            // Assert
            assert.strictEqual(externalArtworkPath, expectedArtworkPath);
        });
    });
});
