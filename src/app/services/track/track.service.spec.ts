import { IMock, It, Mock, Times } from 'typemoq';
import { FileSystem } from '../../core/io/file-system';
import { TrackModel } from '../playback/track-model';
import { TrackService } from './track.service';

describe('TrackService', () => {
    let fileSystemMock: IMock<FileSystem>;

    let service: TrackService;

    beforeEach(() => {
        fileSystemMock = Mock.ofType<FileSystem>();

        fileSystemMock.setup((x) => x.getFileExtension('/home/user/Music/Subfolder1/track1.mp3')).returns(() => '.mp3');
        fileSystemMock.setup((x) => x.getFileExtension('/home/user/Music/Subfolder1/track1.png')).returns(() => '.png');
        fileSystemMock.setup((x) => x.getFileExtension('/home/user/Music/Subfolder1/track2.ogg')).returns(() => '.ogg');
        fileSystemMock.setup((x) => x.getFileExtension('/home/user/Music/Subfolder1/track3.flac')).returns(() => '.flac');
        fileSystemMock.setup((x) => x.getFileExtension('/home/user/Music/Subfolder1/track4.wav')).returns(() => '.wav');
        fileSystemMock.setup((x) => x.getFileExtension('/home/user/Music/Subfolder1/track5.aac')).returns(() => '.aac');
        fileSystemMock.setup((x) => x.getFileExtension('/home/user/Music/Subfolder1/track6.wma')).returns(() => '.wma');
        fileSystemMock
            .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Subfolder1'))
            .returns(async () => [
                '/home/user/Music/Subfolder1/track1.mp3',
                '/home/user/Music/Subfolder1/track1.png',
                '/home/user/Music/Subfolder1/track2.ogg',
                '/home/user/Music/Subfolder1/track3.flac',
                '/home/user/Music/Subfolder1/track4.wav',
                '/home/user/Music/Subfolder1/track5.aac',
                '/home/user/Music/Subfolder1/track6.wma',
            ]);

        service = new TrackService(fileSystemMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeTruthy();
        });
    });

    describe('getTracksInDirectory', () => {
        it('should return an empty collection when the directory path is undefined', async () => {
            // Arrange
            const directoryPath: string = undefined;

            // Act
            const tracks: TrackModel[] = await service.getTracksInDirectoryAsync(directoryPath);

            // Assert
            expect(tracks.length).toEqual(0);
        });

        it('should return an empty collection when the directory path is empty', async () => {
            // Arrange
            const directoryPath: string = '';

            // Act
            const tracks: TrackModel[] = await service.getTracksInDirectoryAsync(directoryPath);

            // Assert
            expect(tracks.length).toEqual(0);
        });

        it('should not check if an empty path exists', async () => {
            // Arrange
            const directoryPath: string = '';

            // Act
            const tracks: TrackModel[] = await service.getTracksInDirectoryAsync(directoryPath);

            // Assert
            fileSystemMock.verify((x) => x.pathExists(It.isAny()), Times.never());
        });

        it('should not check if an undefined path exists', async () => {
            // Arrange
            const directoryPath: string = undefined;

            // Act
            const tracks: TrackModel[] = await service.getTracksInDirectoryAsync(directoryPath);

            // Assert
            fileSystemMock.verify((x) => x.pathExists(It.isAny()), Times.never());
        });

        it('should check that the given non empty or undefined path exists', async () => {
            // Arrange
            const directoryPath: string = '/home/user/Music/Subfolder1';

            // Act
            const tracks: TrackModel[] = await service.getTracksInDirectoryAsync(directoryPath);

            // Assert
            fileSystemMock.verify((x) => x.pathExists('/home/user/Music/Subfolder1'), Times.exactly(1));
        });

        it('should return an empty collection when the directory path does not exist', async () => {
            // Arrange
            const directoryPath: string = '/home/user/Music/Subfolder1';
            fileSystemMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => false);

            // Act
            const tracks: TrackModel[] = await service.getTracksInDirectoryAsync(directoryPath);

            // Assert
            expect(tracks.length).toEqual(0);
        });

        it('should get all files in an existing directory', async () => {
            // Arrange
            const directoryPath: string = '/home/user/Music/Subfolder1';
            fileSystemMock.setup((x) => x.pathExists(directoryPath)).returns(() => true);

            // Act
            const tracks: TrackModel[] = await service.getTracksInDirectoryAsync(directoryPath);

            // Assert
            fileSystemMock.verify((x) => x.getFilesInDirectoryAsync(directoryPath), Times.exactly(1));
        });

        it('should include tracks for files which have a supported audio extension', async () => {
            // Arrange
            const directoryPath: string = '/home/user/Music/Subfolder1';
            fileSystemMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => true);

            // Act
            const tracks: TrackModel[] = await service.getTracksInDirectoryAsync(directoryPath);

            // Assert
            expect(tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track1.mp3')).toBeTruthy();
        });

        it('should not include tracks for files which have an unsupported audio extension', async () => {
            // Arrange
            const directoryPath: string = '/home/user/Music/Subfolder1';
            fileSystemMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => true);

            // Act
            const tracks: TrackModel[] = await service.getTracksInDirectoryAsync(directoryPath);

            // Assert
            expect(tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track1.png')).toBeFalsy();
            expect(tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track2.ogg')).toBeFalsy();
            expect(tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track3.flac')).toBeFalsy();
            expect(tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track4.wav')).toBeFalsy();
            expect(tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track5.aac')).toBeFalsy();
            expect(tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track6.wma')).toBeFalsy();
        });
    });
});
