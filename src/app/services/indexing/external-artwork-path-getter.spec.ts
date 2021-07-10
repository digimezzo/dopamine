import * as path from 'path';
import { IMock, It, Mock } from 'typemoq';
import { FileSystem } from '../../common/io/file-system';
import { ExternalArtworkPathGetter } from './external-artwork-path-getter';

describe('ExternalArtworkPathGetter', () => {
    let fileSystemMock: IMock<FileSystem>;
    let externalArtworkPathGetter: ExternalArtworkPathGetter;

    beforeEach(() => {
        fileSystemMock = Mock.ofType<FileSystem>();
        externalArtworkPathGetter = new ExternalArtworkPathGetter(fileSystemMock.object);
    });

    describe('getExternalArtworkPath', () => {
        it('should return undefined if audio file path is undefined', () => {
            // Arrange

            // Act
            const externalArtworkPath: string = externalArtworkPathGetter.getExternalArtworkPath(undefined);

            // Assert
            expect(externalArtworkPath).toBeUndefined();
        });

        it('should return undefined if there is no file that matches an external artwork pattern in the same directory', () => {
            // Arrange
            const audioFilePath: string = '/home/MyUser/Music/MyMusicFile.mp3';

            fileSystemMock.setup((x) => x.getDirectoryPath(audioFilePath)).returns(() => '/home/MyUser/Music');
            fileSystemMock.setup((x) => x.getFileNameWithoutExtension(audioFilePath)).returns(() => 'MyMusicFile');
            fileSystemMock.setup((x) => x.pathExists(It.isAnyString())).returns(() => false);

            // Act
            const externalArtworkPath: string = externalArtworkPathGetter.getExternalArtworkPath(audioFilePath);

            // Assert
            expect(externalArtworkPath).toBeUndefined();
        });

        it('should return undefined if there is a file that matches an external artwork pattern in the same directory', () => {
            // Arrange
            const audioFilePath: string = '/home/MyUser/Music/MyMusicFile.mp3';
            const expectedArtworkPath: string = path.join('/home/MyUser/Music', 'MyMusicFile.png');

            fileSystemMock.setup((x) => x.getDirectoryPath(audioFilePath)).returns(() => '/home/MyUser/Music');
            fileSystemMock.setup((x) => x.getFileNameWithoutExtension(audioFilePath)).returns(() => 'MyMusicFile');
            fileSystemMock.setup((x) => x.combinePath(It.isAny())).returns(() => expectedArtworkPath);
            fileSystemMock.setup((x) => x.pathExists(expectedArtworkPath)).returns(() => true);

            // Act
            const externalArtworkPath: string = externalArtworkPathGetter.getExternalArtworkPath(audioFilePath);

            // Assert
            expect(externalArtworkPath).toBe(expectedArtworkPath);
        });
    });
});
