import { IMock, It, Mock, Times } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { BaseTrackRepository } from '../../common/data/repositories/base-track-repository';
import { DateTime } from '../../common/date-time';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { ArtistType } from '../artist/artist-type';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { TrackModel } from './track-model';
import { TrackModelFactory } from './track-model-factory';
import { TrackModels } from './track-models';
import { TrackService } from './track.service';

describe('TrackService', () => {
    let trackModelFactoryMock: IMock<TrackModelFactory>;
    let trackRepositoryMock: IMock<BaseTrackRepository>;
    let fileAccessMock: IMock<BaseFileAccess>;

    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let track1: Track;
    let track2: Track;
    let track3: Track;
    let track4: Track;

    let service: TrackService;

    beforeEach(() => {
        trackModelFactoryMock = Mock.ofType<TrackModelFactory>();
        trackRepositoryMock = Mock.ofType<BaseTrackRepository>();
        fileAccessMock = Mock.ofType<BaseFileAccess>();

        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        fileAccessMock.setup((x) => x.getFileExtension('/home/user/Music/Subfolder1/track1.mp3')).returns(() => '.mp3');
        fileAccessMock.setup((x) => x.getFileExtension('/home/user/Music/Subfolder1/track1.png')).returns(() => '.png');
        fileAccessMock
            .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Subfolder1'))
            .returns(async () => ['/home/user/Music/Subfolder1/track1.mp3', '/home/user/Music/Subfolder1/track1.png']);

        track1 = new Track('path1');
        track2 = new Track('path2');
        track3 = new Track('path3');
        track4 = new Track('path4');

        trackRepositoryMock.setup((x) => x.getTracksForAlbums(['albumKey1', 'albumKey2'])).returns(() => [track1, track2]);
        trackRepositoryMock.setup((x) => x.getTracksForAlbums(['unknownAlbumKey1', 'unknownAlbumKey2'])).returns(() => []);
        trackRepositoryMock.setup((x) => x.getTracksForAlbums([])).returns(() => []);

        trackRepositoryMock.setup((x) => x.getTracksForGenres(['genre1', 'genre2'])).returns(() => [track1, track3]);
        trackRepositoryMock.setup((x) => x.getTracksForGenres(['unknownGenre1', 'unknownGenre2'])).returns(() => []);
        trackRepositoryMock.setup((x) => x.getTracksForGenres([])).returns(() => []);

        trackRepositoryMock.setup((x) => x.getTracksForTrackArtists(['artist3', 'artist4'])).returns(() => [track2]);
        trackRepositoryMock.setup((x) => x.getTracksForAlbumArtists(['artist3', 'artist4'])).returns(() => [track3]);

        trackModelFactoryMock
            .setup((x) => x.createFromTrack(track1))
            .returns(() => new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object));
        trackModelFactoryMock
            .setup((x) => x.createFromTrack(track2))
            .returns(() => new TrackModel(track2, dateTimeMock.object, translatorServiceMock.object));
        trackModelFactoryMock
            .setup((x) => x.createFromTrack(track3))
            .returns(() => new TrackModel(track3, dateTimeMock.object, translatorServiceMock.object));
        trackModelFactoryMock
            .setup((x) => x.createFromTrack(track4))
            .returns(() => new TrackModel(track4, dateTimeMock.object, translatorServiceMock.object));
        trackModelFactoryMock
            .setup((x) => x.createFromFileAsync('/home/user/Music/Subfolder1/track1.mp3'))
            .returns(
                async () =>
                    new TrackModel(new Track('/home/user/Music/Subfolder1/track1.mp3'), dateTimeMock.object, translatorServiceMock.object)
            );

        service = new TrackService(trackModelFactoryMock.object, trackRepositoryMock.object, fileAccessMock.object);
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
            fileAccessMock.verify((x) => x.pathExists(It.isAny()), Times.never());
        });

        it('should not check if an empty path exists', async () => {
            // Arrange
            const subfolderPath: string = '';

            // Act
            const tracksModels: TrackModels = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            fileAccessMock.verify((x) => x.pathExists(It.isAny()), Times.never());
        });

        it('should check that the given non empty or undefined path exists', async () => {
            // Arrange
            const subfolderPath: string = '/home/user/Music/Subfolder1';

            // Act
            const tracksModels: TrackModels = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            fileAccessMock.verify((x) => x.pathExists('/home/user/Music/Subfolder1'), Times.exactly(1));
        });

        it('should return an empty TrackModels when the subfolder path does not exist', async () => {
            // Arrange
            const subfolderPath: string = '/home/user/Music/Subfolder1';
            fileAccessMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => false);

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
            fileAccessMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => true);

            // Act
            const tracksModels: TrackModels = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            fileAccessMock.verify((x) => x.getFilesInDirectoryAsync('/home/user/Music/Subfolder1'), Times.exactly(1));
        });

        it('should include tracks for files which have a supported audio extension', async () => {
            // Arrange
            const subfolderPath: string = '/home/user/Music/Subfolder1';
            fileAccessMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => true);

            // Act
            const tracksModels: TrackModels = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            expect(tracksModels.tracks.map((x) => x.path).includes('/home/user/Music/Subfolder1/track1.mp3')).toBeTruthy();
        });

        it('should not include tracks for files which have an unsupported audio extension', async () => {
            // Arrange
            const subfolderPath: string = '/home/user/Music/Subfolder1';
            fileAccessMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => true);

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

        it('should create TrackModels from files', async () => {
            // Arrange
            const subfolderPath: string = '/home/user/Music/Subfolder1';
            fileAccessMock.setup((x) => x.pathExists('/home/user/Music/Subfolder1')).returns(() => true);

            // Act
            const tracksModels: TrackModels = await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            trackModelFactoryMock.verify((x) => x.createFromFileAsync('/home/user/Music/Subfolder1/track1.mp3'), Times.once());
        });
    });

    describe('getVisibleTracks', () => {
        test.todo('should write tests');
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
            expect(tracksModels.tracks[0].path).toEqual('path1');
            expect(tracksModels.tracks[1].path).toEqual('path2');
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

    describe('getTracksForArtists', () => {
        it('should return a TrackModels containing no tracks if artists is undefined', () => {
            // Arrange
            const artists: string[] = undefined;
            const artistType: ArtistType = ArtistType.albumArtists;

            // Act
            const tracksModels: TrackModels = service.getTracksForArtists(artists, artistType);

            // Assert
            trackRepositoryMock.verify((x) => x.getTracksForTrackArtists(artists), Times.never());
            trackRepositoryMock.verify((x) => x.getTracksForAlbumArtists(artists), Times.never());
            expect(tracksModels.tracks.length).toEqual(0);
        });

        it('should return a TrackModels containing no tracks if artists is empty', () => {
            // Arrange
            const artists: string[] = [];
            const artistType: ArtistType = ArtistType.albumArtists;

            // Act
            const tracksModels: TrackModels = service.getTracksForArtists(artists, artistType);

            // Assert
            trackRepositoryMock.verify((x) => x.getTracksForTrackArtists(artists), Times.never());
            trackRepositoryMock.verify((x) => x.getTracksForAlbumArtists(artists), Times.never());
            expect(tracksModels.tracks.length).toEqual(0);
        });

        it('should return a TrackModels containing no tracks if artistType is undefined', () => {
            // Arrange
            const artists: string[] = ['artist1'];
            const artistType: ArtistType = undefined;

            // Act
            const tracksModels: TrackModels = service.getTracksForArtists(artists, artistType);

            // Assert
            trackRepositoryMock.verify((x) => x.getTracksForTrackArtists(artists), Times.never());
            trackRepositoryMock.verify((x) => x.getTracksForAlbumArtists(artists), Times.never());
            expect(tracksModels.tracks.length).toEqual(0);
        });

        it('should return a TrackModels for track artists only if artistType is trackArtists', () => {
            // Arrange

            // Act
            const tracksModels: TrackModels = service.getTracksForArtists(['artist3', 'artist4'], ArtistType.trackArtists);

            // Assert
            expect(tracksModels.tracks.length).toEqual(1);
            expect(tracksModels.tracks[0].path).toEqual(track2.path);
        });

        it('should return a TrackModels for album artists only if artistType is albumArtists', () => {
            // Arrange

            // Act
            const tracksModels: TrackModels = service.getTracksForArtists(['artist3', 'artist4'], ArtistType.albumArtists);

            // Assert
            expect(tracksModels.tracks.length).toEqual(1);
            expect(tracksModels.tracks[0].path).toEqual(track3.path);
        });

        it('should return a TrackModels for both track and album artists if artistType is allArtists', () => {
            // Arrange

            // Act
            const tracksModels: TrackModels = service.getTracksForArtists(['artist3', 'artist4'], ArtistType.allArtists);

            // Assert
            expect(tracksModels.tracks.length).toEqual(2);
            expect(tracksModels.tracks[0].path).toEqual(track2.path);
            expect(tracksModels.tracks[1].path).toEqual(track3.path);
        });
    });

    describe('getTracksForGenres', () => {
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
            expect(tracksModels.tracks[0].path).toEqual('path1');
            expect(tracksModels.tracks[1].path).toEqual('path3');
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

    describe('savePlayCountAndDateLastPlayed', () => {
        it('should update play count and date last played in the database', () => {
            // Arrange
            const track: Track = new Track('path');
            track.trackId = 9;

            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
            trackModel.increasePlayCountAndDateLastPlayed();

            // Act
            service.savePlayCountAndDateLastPlayed(trackModel);

            // Assert
            trackRepositoryMock.verify((x) => x.updatePlayCountAndDateLastPlayed(9, track.playCount, track.dateLastPlayed), Times.once());
        });
    });

    describe('saveSkipCount', () => {
        it('should update play count in the database', () => {
            // Arrange
            const track: Track = new Track('path');
            track.trackId = 9;

            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object);
            trackModel.increaseSkipCount();

            // Act
            service.saveSkipCount(trackModel);

            // Assert
            trackRepositoryMock.verify((x) => x.updateSkipCount(9, 1), Times.once());
        });
    });
});
