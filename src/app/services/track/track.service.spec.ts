import { IMock, It, Mock, Times } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { FileSystem } from '../../common/io/file-system';
import { TrackFiller } from '../indexing/track-filler';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { TrackModels } from './track-models';
import { TrackService } from './track.service';

describe('TrackService', () => {
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let trackRepositoryMock: IMock<BaseTrackRepository>;
    let fileSystemMock: IMock<FileSystem>;
    let trackFillerMock: IMock<TrackFiller>;

    let track1: Track;
    let track2: Track;
    let track3: Track;
    let track4: Track;

    let service: TrackService;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        trackRepositoryMock = Mock.ofType<BaseTrackRepository>();
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

        track1 = new Track('Path 1');
        track2 = new Track('Path 2');
        track3 = new Track('Path 3');
        track4 = new Track('Path 4');

        trackRepositoryMock.setup((x) => x.getTracksForAlbums(['albumKey1', 'albumKey2'])).returns(() => [track1, track2]);
        trackRepositoryMock.setup((x) => x.getTracksForAlbums(['unknownAlbumKey1', 'unknownAlbumKey2'])).returns(() => []);
        trackRepositoryMock.setup((x) => x.getTracksForAlbums([])).returns(() => []);

        trackRepositoryMock.setup((x) => x.getTracksForGenres(['genre1', 'genre2'])).returns(() => [track1, track3]);
        trackRepositoryMock.setup((x) => x.getTracksForGenres(['unknownGenre1', 'unknownGenre2'])).returns(() => []);
        trackRepositoryMock.setup((x) => x.getTracksForGenres([])).returns(() => []);

        const trackToFill: Track = new Track('/home/user/Music/Subfolder1/track1.mp3');
        const filledTrack: Track = new Track('/home/user/Music/Subfolder1/track1.mp3');
        filledTrack.trackTitle = 'My track title';
        trackFillerMock.setup((x) => x.addFileMetadataToTrackAsync(trackToFill)).returns(async () => filledTrack);

        service = new TrackService(translatorServiceMock.object, trackRepositoryMock.object, fileSystemMock.object, trackFillerMock.object);
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
        it('should return an empty TrackModels when the subfolder path is undefined', async () => {
            // Arrange
            const subfolderPath: string = undefined;

            // Act
            const tracksModels: TrackModels = await service.getTracksInSubfolderAsync(undefined);

            // Assert
            expect(tracksModels.tracks.length).toEqual(0);
            expect(tracksModels.totalDurationInMilliseconds).toEqual(0);
            expect(tracksModels.totalFileSizeInBytes).toEqual(0);
        });

        it('should return an empty TrackModels when the subfolder path is empty', async () => {
            // Arrange
            const subfolderPath: string = '';

            // Act
            const tracksModels: TrackModels = await service.getTracksInSubfolderAsync(undefined);

            // Assert
            expect(tracksModels.tracks.length).toEqual(0);
            expect(tracksModels.totalDurationInMilliseconds).toEqual(0);
            expect(tracksModels.totalFileSizeInBytes).toEqual(0);
        });

        it('should not check if an undefined path exists', async () => {
            // Arrange
            const subfolderPath: string = undefined;

            // Act
            const tracksModels: TrackModels = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            fileSystemMock.verify((x) => x.pathExists(It.isAny()), Times.never());
        });

        it('should not check if an empty path exists', async () => {
            // Arrange
            const subfolderPath: string = '';

            // Act
            const tracksModels: TrackModels = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            fileSystemMock.verify((x) => x.pathExists(It.isAny()), Times.never());
        });

        it('should check that the given non empty or undefined path exists', async () => {
            // Arrange
            const subfolderPath: string = '/home/user/Music/Subfolder1';

            // Act
            const tracksModels: TrackModels = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            fileSystemMock.verify((x) => x.pathExists('/home/user/Music/Subfolder1'), Times.exactly(1));
        });

        it('should return an empty TrackModels when the subfolder path does not exist', async () => {
            // Arrange
            const subfolderPath: string = '/home/user/Music/Subfolder1';
            fileSystemMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => false);

            // Act
            const tracksModels: TrackModels = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            expect(tracksModels.tracks.length).toEqual(0);
            expect(tracksModels.totalDurationInMilliseconds).toEqual(0);
            expect(tracksModels.totalFileSizeInBytes).toEqual(0);
        });

        it('should get all files in an existing directory', async () => {
            // Arrange
            const subfolderPath: string = '/home/user/Music/Subfolder1';
            fileSystemMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => true);

            // Act
            const tracksModels: TrackModels = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            fileSystemMock.verify((x) => x.getFilesInDirectoryAsync('/home/user/Music/Subfolder1'), Times.exactly(1));
        });

        it('should include tracks for files which have a supported audio extension', async () => {
            // Arrange
            const subfolderPath: string = '/home/user/Music/Subfolder1';
            fileSystemMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => true);

            // Act
            const tracksModels: TrackModels = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            expect(tracksModels.tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track1.mp3')).toBeTruthy();
        });

        it('should not include tracks for files which have an unsupported audio extension', async () => {
            // Arrange
            const subfolderPath: string = '/home/user/Music/Subfolder1';
            fileSystemMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => true);

            // Act
            const tracksModels: TrackModels = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            expect(tracksModels.tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track1.png')).toBeFalsy();
            expect(tracksModels.tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track2.ogg')).toBeFalsy();
            expect(tracksModels.tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track3.flac')).toBeFalsy();
            expect(tracksModels.tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track4.wav')).toBeFalsy();
            expect(tracksModels.tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track5.aac')).toBeFalsy();
            expect(tracksModels.tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track6.wma')).toBeFalsy();
        });

        it('should add metadata information to the tracks', async () => {
            // Arrange
            const subfolderPath: string = '/home/user/Music/Subfolder1';
            fileSystemMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => true);

            // Act
            const tracksModels: TrackModels = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            trackFillerMock.verify(
                (x) => x.addFileMetadataToTrackAsync(It.is<Track>((track) => track.path === '/home/user/Music/Subfolder1/track1.mp3')),
                Times.exactly(1)
            );
        });
    });

    describe('getAlbumTracks', () => {
        it('should return a TrackModels containing no tracks if albumKeys is undefined', () => {
            // Arrange
            const albumKeys: string[] = undefined;

            // Act
            const tracksModels: TrackModels = service.getTracksForAlbums(albumKeys);

            // Assert
            trackRepositoryMock.verify((x) => x.getTracksForAlbums(albumKeys), Times.never());
            expect(tracksModels.tracks.length).toEqual(0);
        });

        it('should return a TrackModels containing no tracks if albumKeys empty', () => {
            // Arrange
            const albumKeys: string[] = [];

            // Act
            const tracksModels: TrackModels = service.getTracksForAlbums(albumKeys);

            // Assert
            trackRepositoryMock.verify((x) => x.getTracksForAlbums(albumKeys), Times.never());
            expect(tracksModels.tracks.length).toEqual(0);
        });

        it('should return a TrackModels containing tracks if tracks are found for the given albumKeys', () => {
            // Arrange
            const albumKeys: string[] = ['albumKey1', 'albumKey2'];

            // Act
            const tracksModels: TrackModels = service.getTracksForAlbums(albumKeys);

            // Assert
            trackRepositoryMock.verify((x) => x.getTracksForAlbums(albumKeys), Times.exactly(1));
            expect(tracksModels.tracks.length).toEqual(2);
            expect(tracksModels.tracks[0].path).toEqual('Path 1');
            expect(tracksModels.tracks[1].path).toEqual('Path 2');
        });

        it('should return a TrackModels containing no tracks if no tracks are found for the given albumKeys', () => {
            // Arrange
            const albumKeys: string[] = ['unknownAlbumKey1', 'unknownAlbumKey2'];

            // Act
            const tracksModels: TrackModels = service.getTracksForAlbums(albumKeys);

            // Assert
            trackRepositoryMock.verify((x) => x.getTracksForAlbums(albumKeys), Times.exactly(1));
            expect(tracksModels.tracks.length).toEqual(0);
        });
    });

    describe('getGenreTracks', () => {
        it('should return a TrackModels containing no tracks if genres is undefined', () => {
            // Arrange
            const genres: string[] = undefined;

            // Act
            const tracksModels: TrackModels = service.getTracksForGenres(genres);

            // Assert
            trackRepositoryMock.verify((x) => x.getTracksForGenres(genres), Times.never());
            expect(tracksModels.tracks.length).toEqual(0);
        });

        it('should return a TrackModels containing no tracks if genres empty', () => {
            // Arrange
            const genres: string[] = [];

            // Act
            const tracksModels: TrackModels = service.getTracksForGenres(genres);

            // Assert
            trackRepositoryMock.verify((x) => x.getTracksForGenres(genres), Times.never());
            expect(tracksModels.tracks.length).toEqual(0);
        });

        it('should return a TrackModels containing tracks if tracks are found for the given genres', () => {
            // Arrange
            const genres: string[] = ['genre1', 'genre2'];

            // Act
            const tracksModels: TrackModels = service.getTracksForGenres(genres);

            // Assert
            trackRepositoryMock.verify((x) => x.getTracksForGenres(genres), Times.exactly(1));
            expect(tracksModels.tracks.length).toEqual(2);
            expect(tracksModels.tracks[0].path).toEqual('Path 1');
            expect(tracksModels.tracks[1].path).toEqual('Path 3');
        });

        it('should return a TrackModels containing no tracks if no tracks are found for the given genres', () => {
            // Arrange
            const genres: string[] = ['unknownGenre1', 'unknownGenre2'];

            // Act
            const tracksModels: TrackModels = service.getTracksForGenres(genres);

            // Assert
            trackRepositoryMock.verify((x) => x.getTracksForGenres(genres), Times.exactly(1));
            expect(tracksModels.tracks.length).toEqual(0);
        });
    });
});
