import { IMock, It, Mock, Times } from 'typemoq';
import { DateTime } from '../../common/date-time';
import { ArtistType } from '../artist/artist-type';
import { TrackModel } from './track-model';
import { TrackModelFactory } from './track-model-factory';
import { TrackModels } from './track-models';
import { TrackService } from './track.service';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { Track } from '../../data/entities/track';
import { SettingsMock } from '../../testing/settings-mock';
import { ArtistModel } from '../artist/artist-model';
import { Logger } from '../../common/logger';

describe('TrackService', () => {
    let trackModelFactoryMock: IMock<TrackModelFactory>;
    let trackRepositoryMock: IMock<TrackRepositoryBase>;
    let fileAccessMock: IMock<FileAccessBase>;
    let settingsMock: SettingsMock;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let loggerMock: IMock<Logger>;

    let track1: Track;
    let track2: Track;
    let track3: Track;
    let track4: Track;

    let service: TrackService;

    beforeEach(() => {
        trackModelFactoryMock = Mock.ofType<TrackModelFactory>();
        trackRepositoryMock = Mock.ofType<TrackRepositoryBase>();
        fileAccessMock = Mock.ofType<FileAccessBase>();
        settingsMock = new SettingsMock();
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        loggerMock = Mock.ofType<Logger>();

        fileAccessMock.setup((x) => x.getFileExtension('/home/user/Music/Subfolder1/track1.mp3')).returns(() => '.mp3');
        fileAccessMock.setup((x) => x.getFileExtension('/home/user/Music/Subfolder1/track1.png')).returns(() => '.png');
        fileAccessMock
            .setup((x) => x.getFilesInDirectoryAsync('/home/user/Music/Subfolder1'))
            .returns(() => Promise.resolve(['/home/user/Music/Subfolder1/track1.mp3', '/home/user/Music/Subfolder1/track1.png']));

        track1 = new Track('path1');
        track2 = new Track('path2');
        track3 = new Track('path3');
        track4 = new Track('path4');

        trackRepositoryMock.setup((x) => x.getTracksForAlbums('', ['albumKey1', 'albumKey2'])).returns(() => [track1, track2]);
        trackRepositoryMock.setup((x) => x.getTracksForAlbums('', ['unknownAlbumKey1', 'unknownAlbumKey2'])).returns(() => []);
        trackRepositoryMock.setup((x) => x.getTracksForAlbums('', [])).returns(() => []);

        trackRepositoryMock.setup((x) => x.getTracksForGenres(['genre1', 'genre2'])).returns(() => [track1, track3]);
        trackRepositoryMock.setup((x) => x.getTracksForGenres(['unknownGenre1', 'unknownGenre2'])).returns(() => []);
        trackRepositoryMock.setup((x) => x.getTracksForGenres([])).returns(() => []);

        trackRepositoryMock.setup((x) => x.getTracksForTrackArtists(['Source artist3', 'Source artist4'])).returns(() => [track2]);
        trackRepositoryMock.setup((x) => x.getTracksForAlbumArtists(['Source artist3', 'Source artist4'])).returns(() => [track3]);

        trackModelFactoryMock
            .setup((x) => x.createFromTrack(track1, ''))
            .returns(() => new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object, ''));
        trackModelFactoryMock
            .setup((x) => x.createFromTrack(track2, ''))
            .returns(() => new TrackModel(track2, dateTimeMock.object, translatorServiceMock.object, ''));
        trackModelFactoryMock
            .setup((x) => x.createFromTrack(track3, ''))
            .returns(() => new TrackModel(track3, dateTimeMock.object, translatorServiceMock.object, ''));
        trackModelFactoryMock
            .setup((x) => x.createFromTrack(track4, ''))
            .returns(() => new TrackModel(track4, dateTimeMock.object, translatorServiceMock.object, ''));
        trackModelFactoryMock
            .setup((x) => x.createFromFileAsync('/home/user/Music/Subfolder1/track1.mp3', ''))
            .returns(() =>
                Promise.resolve(
                    new TrackModel(
                        new Track('/home/user/Music/Subfolder1/track1.mp3'),
                        dateTimeMock.object,
                        translatorServiceMock.object,
                        '',
                    ),
                ),
            );

        dateTimeMock.setup((x) => x.convertDateToTicks(It.isAny())).returns(() => 123456);

        service = new TrackService(
            trackModelFactoryMock.object,
            trackRepositoryMock.object,
            fileAccessMock.object,
            settingsMock,
            loggerMock.object,
        );
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
        it('should return an empty TrackModels when the subfolder path is empty', async () => {
            // Arrange, Act
            const tracksModels: TrackModels = await service.getTracksInSubfolderAsync('');

            // Assert
            expect(tracksModels.tracks.length).toEqual(0);
            expect(tracksModels.totalDurationInMilliseconds).toEqual(0);
            expect(tracksModels.totalFileSizeInBytes).toEqual(0);
        });

        it('should not check if an empty path exists', async () => {
            // Arrange, Act
            await service.getTracksInSubfolderAsync('');

            // Assert
            fileAccessMock.verify((x) => x.pathExists(It.isAny()), Times.never());
        });

        it('should check that the given non empty or undefined path exists', async () => {
            // Arrange, Act
            await service.getTracksInSubfolderAsync('/home/user/Music/Subfolder1');

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
            await service.getTracksInSubfolderAsync(subfolderPath);

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
            await service.getTracksInSubfolderAsync(subfolderPath);

            // Assert
            trackModelFactoryMock.verify((x) => x.createFromFileAsync('/home/user/Music/Subfolder1/track1.mp3', ''), Times.once());
        });
    });

    describe('getVisibleTracks', () => {
        test.todo('should write tests');
    });

    describe('getTracksForAlbums', () => {
        it('should return a TrackModels containing no tracks if albumKeys empty', () => {
            // Arrange
            const albumKeys: string[] = [];

            // Act
            const tracksModels: TrackModels = service.getTracksForAlbums(albumKeys);

            // Assert
            trackRepositoryMock.verify((x) => x.getTracksForAlbums('', albumKeys), Times.never());
            expect(tracksModels.tracks.length).toEqual(0);
        });

        it('should return a TrackModels containing tracks if tracks are found for the given albumKeys', () => {
            // Arrange
            const albumKeys: string[] = ['albumKey1', 'albumKey2'];

            // Act
            const tracksModels: TrackModels = service.getTracksForAlbums(albumKeys);

            // Assert
            trackRepositoryMock.verify((x) => x.getTracksForAlbums('', albumKeys), Times.exactly(1));
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
            trackRepositoryMock.verify((x) => x.getTracksForAlbums('', albumKeys), Times.exactly(1));
            expect(tracksModels.tracks.length).toEqual(0);
        });
    });

    describe('getTracksForArtists', () => {
        it('should return a TrackModels containing no tracks if artists is empty', () => {
            // Arrange
            const artists: ArtistModel[] = [];
            const artistType: ArtistType = ArtistType.albumArtists;

            // Act
            const tracksModels: TrackModels = service.getTracksForArtists(artists, artistType);

            // Assert
            trackRepositoryMock.verify((x) => x.getTracksForTrackArtists([]), Times.never());
            trackRepositoryMock.verify((x) => x.getTracksForAlbumArtists([]), Times.never());
            expect(tracksModels.tracks.length).toEqual(0);
        });

        it('should return a TrackModels for track artists only if artistType is trackArtists', () => {
            // Arrange
            const artist3: ArtistModel = new ArtistModel('Source artist3', 'artist3', translatorServiceMock.object);
            const artist4: ArtistModel = new ArtistModel('Source artist4', 'artist4', translatorServiceMock.object);

            // Act
            const tracksModels: TrackModels = service.getTracksForArtists([artist3, artist4], ArtistType.trackArtists);

            // Assert
            trackRepositoryMock.verify((x) => x.getTracksForTrackArtists(['Source artist3', 'Source artist4']), Times.once());
            expect(tracksModels.tracks.length).toEqual(1);
            expect(tracksModels.tracks[0].path).toEqual(track2.path);
        });

        it('should return a TrackModels for album artists only if artistType is albumArtists', () => {
            // Arrange
            const artist3: ArtistModel = new ArtistModel('Source artist3', 'Artist3', translatorServiceMock.object);
            const artist4: ArtistModel = new ArtistModel('Source artist4', 'Artist4', translatorServiceMock.object);

            // Act
            const tracksModels: TrackModels = service.getTracksForArtists([artist3, artist4], ArtistType.albumArtists);

            // Assert
            trackRepositoryMock.verify((x) => x.getTracksForAlbumArtists(['Source artist3', 'Source artist4']), Times.once());
            expect(tracksModels.tracks.length).toEqual(1);
            expect(tracksModels.tracks[0].path).toEqual(track3.path);
        });

        it('should return a TrackModels for both track and album artists if artistType is allArtists', () => {
            // Arrange
            const artist3: ArtistModel = new ArtistModel('Source artist3', 'Artist3', translatorServiceMock.object);
            const artist4: ArtistModel = new ArtistModel('Source artist4', 'Artist4', translatorServiceMock.object);

            // Act
            const tracksModels: TrackModels = service.getTracksForArtists([artist3, artist4], ArtistType.allArtists);

            // Assert
            trackRepositoryMock.verify((x) => x.getTracksForTrackArtists(['Source artist3', 'Source artist4']), Times.once());
            trackRepositoryMock.verify((x) => x.getTracksForAlbumArtists(['Source artist3', 'Source artist4']), Times.once());
            expect(tracksModels.tracks.length).toEqual(2);
            expect(tracksModels.tracks[0].path).toEqual(track2.path);
            expect(tracksModels.tracks[1].path).toEqual(track3.path);
        });
    });

    describe('getTracksForGenres', () => {
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
            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, '');
            trackModel.increasePlayCountAndDateLastPlayed();

            // Act
            service.savePlayCountAndDateLastPlayed(trackModel);

            // Assert
            trackRepositoryMock.verify((x) => x.updatePlayCountAndDateLastPlayed(9, track.playCount!, track.dateLastPlayed!), Times.once());
        });
    });

    describe('saveSkipCount', () => {
        it('should update play count in the database', () => {
            // Arrange
            const track: Track = new Track('path');
            track.trackId = 9;

            const trackModel: TrackModel = new TrackModel(track, dateTimeMock.object, translatorServiceMock.object, '');
            trackModel.increaseSkipCount();

            // Act
            service.saveSkipCount(trackModel);

            // Assert
            trackRepositoryMock.verify((x) => x.updateSkipCount(9, 1), Times.once());
        });
    });
});
