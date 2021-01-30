import { IMock, It, Mock, Times } from 'typemoq';
import { FileSystem } from '../../core/io/file-system';
import { Track } from '../../data/entities/track';
import { TrackFiller } from '../indexing/track-filler';
import { TrackModel } from './track-model';
import { TrackService } from './track.service';

describe('TrackService', () => {
    let fileSystemMock: IMock<FileSystem>;
    let trackFillerMock: IMock<TrackFiller>;

    let service: TrackService;

    beforeEach(() => {
        fileSystemMock = Mock.ofType<FileSystem>();
        trackFillerMock = Mock.ofType<TrackFiller>();

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

        const track: Track = new Track('/home/user/Music/Subfolder1/track1.mp3');
        const filledTrack: Track = new Track('/home/user/Music/Subfolder1/track1.mp3');
        filledTrack.trackTitle = 'My track title';
        trackFillerMock.setup((x) => x.addFileMetadataToTrackAsync(track)).returns(async () => filledTrack);

        service = new TrackService(fileSystemMock.object, trackFillerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('getTracksInSubfolderAsync', () => {
        it('should return an empty collection when the subfolder path is undefined', async () => {
            // Arrange
            const subfolderPath: string = undefined;

            // Act
            const tracks: TrackModel[] = await service.getTracksInSubfolderAsync(undefined);

            // Assert
            expect(tracks.length).toEqual(0);
        });

        it('should return an empty collection when the subfolder path is empty', async () => {
            // Arrange
            const subfolderPath: string = '';

            // Act
            const tracks: TrackModel[] = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            expect(tracks.length).toEqual(0);
        });

        it('should not check if an undefined path exists', async () => {
            // Arrange
            const subfolderPath: string = undefined;

            // Act
            const tracks: TrackModel[] = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            fileSystemMock.verify((x) => x.pathExists(It.isAny()), Times.never());
        });

        it('should not check if an empty path exists', async () => {
            // Arrange
            const subfolderPath: string = '';

            // Act
            const tracks: TrackModel[] = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            fileSystemMock.verify((x) => x.pathExists(It.isAny()), Times.never());
        });

        it('should check that the given non empty or undefined path exists', async () => {
            // Arrange
            const subfolderPath: string = '/home/user/Music/Subfolder1';

            // Act
            const tracks: TrackModel[] = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            fileSystemMock.verify((x) => x.pathExists('/home/user/Music/Subfolder1'), Times.exactly(1));
        });

        it('should return an empty collection when the subfolder path does not exist', async () => {
            // Arrange
            const subfolderPath: string = '/home/user/Music/Subfolder1';
            fileSystemMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => false);

            // Act
            const tracks: TrackModel[] = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            expect(tracks.length).toEqual(0);
        });

        it('should get all files in an existing directory', async () => {
            // Arrange
            const subfolderPath: string = '/home/user/Music/Subfolder1';
            fileSystemMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => true);

            // Act
            const tracks: TrackModel[] = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            fileSystemMock.verify((x) => x.getFilesInDirectoryAsync('/home/user/Music/Subfolder1'), Times.exactly(1));
        });

        it('should include tracks for files which have a supported audio extension', async () => {
            // Arrange
            const subfolderPath: string = '/home/user/Music/Subfolder1';
            fileSystemMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => true);

            // Act
            const tracks: TrackModel[] = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            expect(tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track1.mp3')).toBeTruthy();
        });

        it('should not include tracks for files which have an unsupported audio extension', async () => {
            // Arrange
            const subfolderPath: string = '/home/user/Music/Subfolder1';
            fileSystemMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => true);

            // Act
            const tracks: TrackModel[] = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            expect(tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track1.png')).toBeFalsy();
            expect(tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track2.ogg')).toBeFalsy();
            expect(tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track3.flac')).toBeFalsy();
            expect(tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track4.wav')).toBeFalsy();
            expect(tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track5.aac')).toBeFalsy();
            expect(tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track6.wma')).toBeFalsy();
        });

        it('should add metadata information to the tracks', async () => {
            // Arrange
            const subfolderPath: string = '/home/user/Music/Subfolder1';
            fileSystemMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => true);

            // Act
            const tracks: TrackModel[] = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            trackFillerMock.verify(
                (x) => x.addFileMetadataToTrackAsync(It.is<Track>((track) => track.path === '/home/user/Music/Subfolder1/track1.mp3')),
                Times.exactly(1)
            );
        });
    });
});
