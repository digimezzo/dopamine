import { RatingBackupService } from './rating-backup.service';
import { IMock, It, Mock, Times } from 'typemoq';
import { FileAccessBase } from '../../common/io/file-access.base';
import { DesktopBase } from '../../common/io/desktop.base';
import { Logger } from '../../common/logger';
import { TrackModel } from '../track/track-model';
import { Track } from '../../data/entities/track';
import { DateTime } from '../../common/date-time';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { TrackRepositoryBase } from '../../data/repositories/track-repository.base';

describe('RatingBackupService', () => {
    let fileAccessMock: IMock<FileAccessBase>;
    let desktopMock: IMock<DesktopBase>;
    let loggerMock: IMock<Logger>;
    let translatorMock: IMock<TranslatorServiceBase>;
    let dateTimeMock: IMock<DateTime>;
    let trackRepositoryMock: IMock<TrackRepositoryBase>;
    let service: RatingBackupService;

    beforeEach(() => {
        fileAccessMock = Mock.ofType<FileAccessBase>();
        desktopMock = Mock.ofType<DesktopBase>();
        loggerMock = Mock.ofType<Logger>();
        translatorMock = Mock.ofType<TranslatorServiceBase>();
        dateTimeMock = Mock.ofType<DateTime>();
        trackRepositoryMock = Mock.ofType<TrackRepositoryBase>();

        desktopMock.setup((x) => x.getMusicDirectory()).returns(() => '/home/user/Music');
        desktopMock.setup((x) => x.getApplicationDataDirectory()).returns(() => '/home/user/.config/Dopamine');
        fileAccessMock.setup((x) => x.pathExists('/home/user/Music')).returns(() => true);
        fileAccessMock
            .setup((x) => x.combinePath(['/home/user/Music', 'Dopamine', 'Ratings']))
            .returns(() => '/home/user/Music/Dopamine/Ratings');
        fileAccessMock
            .setup((x) => x.combinePath(['/home/user/Music/Dopamine/Ratings', 'ratings-backup.json']))
            .returns(() => '/home/user/Music/Dopamine/Ratings/ratings-backup.json');
        fileAccessMock
            .setup((x) => x.combinePath(['/home/user/Music/Dopamine/Ratings', 'auto-restore-v1.done']))
            .returns(() => '/home/user/Music/Dopamine/Ratings/auto-restore-v1.done');
        loggerMock.setup((x) => x.info(It.isAnyString(), It.isAnyString(), It.isAnyString())).returns(() => {});
        loggerMock.setup((x) => x.error(It.isAny(), It.isAnyString(), It.isAnyString(), It.isAnyString())).returns(() => {});
    });

    function createService(): RatingBackupService {
        return new RatingBackupService(fileAccessMock.object, desktopMock.object, loggerMock.object, trackRepositoryMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Act
            service = createService();

            // Assert
            expect(service).toBeTruthy();
        });

        it('should initialize with music directory', () => {
            // Act
            service = createService();

            // Assert
            expect(service.ratingsDirectoryPath).toEqual('/home/user/Music/Dopamine/Ratings');
            expect(service.ratingsBackupPath).toEqual('/home/user/Music/Dopamine/Ratings/ratings-backup.json');
        });
    });

    describe('backupTrackRatingAsync', () => {
        it('should create ratings directory if it does not exist', async () => {
            // Arrange
            service = createService();
            const track = new TrackModel(new Track('/path/to/track.mp3'), dateTimeMock.object, translatorMock.object, '');
            track.rating = 5;
            track.love = 1;

            fileAccessMock.setup((x) => x.createFullDirectoryPathIfDoesNotExist('/home/user/Music/Dopamine/Ratings')).returns(() => {});
            fileAccessMock.setup((x) => x.pathExists('/home/user/Music/Dopamine/Ratings/ratings-backup.json')).returns(() => false);
            fileAccessMock
                .setup((x) => x.getFileContentAsString('/home/user/Music/Dopamine/Ratings/ratings-backup.json'))
                .throws(new Error('File not found'));
            fileAccessMock
                .setup((x) => x.writeToFile('/home/user/Music/Dopamine/Ratings/ratings-backup.json', It.isAnyString()))
                .returns(() => {});

            // Act
            await service.backupTrackRatingAsync(track);

            // Assert
            fileAccessMock.verify((x) => x.createFullDirectoryPathIfDoesNotExist('/home/user/Music/Dopamine/Ratings'), Times.once());
        });

        it('should backup a track rating', async () => {
            // Arrange
            service = createService();
            const track = new TrackModel(new Track('/path/to/track.mp3'), dateTimeMock.object, translatorMock.object, '');
            track.rating = 7;
            track.love = 0;

            fileAccessMock.setup((x) => x.createFullDirectoryPathIfDoesNotExist('/home/user/Music/Dopamine/Ratings')).returns(() => {});
            fileAccessMock.setup((x) => x.pathExists('/home/user/Music/Dopamine/Ratings/ratings-backup.json')).returns(() => false);
            fileAccessMock
                .setup((x) => x.writeToFile('/home/user/Music/Dopamine/Ratings/ratings-backup.json', It.isAnyString()))
                .returns(() => {});

            // Act
            await service.backupTrackRatingAsync(track);

            // Assert
            fileAccessMock.verify(
                (x) => x.writeToFile('/home/user/Music/Dopamine/Ratings/ratings-backup.json', It.isAnyString()),
                Times.once(),
            );
        });
    });

    function createTrackModel(path: string, artists: string, title: string): TrackModel {
        const entity = new Track(path);
        entity.artists = artists;
        entity.trackTitle = title;
        return new TrackModel(entity, dateTimeMock.object, translatorMock.object, '');
    }

    describe('loadBackup', () => {
        it('should load existing backup file', () => {
            // Arrange
            service = createService();
            const backupContent =
                '{"version":1,"lastBackupDate":1234567890,"ratings":[{"trackPath":"/path/to/track.mp3","rating":5,"love":1,"artist":"Artist Name","title":"Song Title"}]}';

            fileAccessMock.setup((x) => x.pathExists('/home/user/Music/Dopamine/Ratings/ratings-backup.json')).returns(() => true);
            fileAccessMock
                .setup((x) => x.getFileContentAsString('/home/user/Music/Dopamine/Ratings/ratings-backup.json'))
                .returns(() => backupContent);

            // Act
            const backup = service.loadBackup();

            // Assert
            expect(backup.version).toEqual(1);
            expect(backup.ratings.length).toEqual(1);
            expect(backup.ratings[0].trackPath).toEqual('/path/to/track.mp3');
            expect(backup.ratings[0].rating).toEqual(5);
            expect(backup.ratings[0].artist).toEqual('Artist Name');
            expect(backup.ratings[0].title).toEqual('Song Title');
        });

        it('should return empty backup if file does not exist', () => {
            // Arrange
            service = createService();
            fileAccessMock.setup((x) => x.pathExists('/home/user/Music/Dopamine/Ratings/ratings-backup.json')).returns(() => false);

            // Act
            const backup = service.loadBackup();

            // Assert
            expect(backup.version).toEqual(1);
            expect(backup.ratings.length).toEqual(0);
        });
    });

    describe('deleteBackupAsync', () => {
        it('should delete backup file if it exists', async () => {
            // Arrange
            service = createService();
            fileAccessMock.setup((x) => x.pathExists('/home/user/Music/Dopamine/Ratings/ratings-backup.json')).returns(() => true);
            fileAccessMock
                .setup((x) => x.deleteFileIfExistsAsync('/home/user/Music/Dopamine/Ratings/ratings-backup.json'))
                .returns(async () => {});

            // Act
            await service.deleteBackupAsync();

            // Assert
            fileAccessMock.verify((x) => x.deleteFileIfExistsAsync('/home/user/Music/Dopamine/Ratings/ratings-backup.json'), Times.once());
        });
    });

    describe('findRatingByTrack', () => {
        it('should find rating by exact path match', () => {
            // Arrange
            service = createService();
            const track = createTrackModel('/path/to/track.mp3', ';Artist Name;', 'Song Title');

            const ratingEntries = [{ trackPath: '/path/to/track.mp3', rating: 5, love: 1, artist: 'Artist Name', title: 'Song Title' }];

            // Act
            const result = service.findRatingByTrack(track, ratingEntries);

            // Assert
            expect(result).toBeTruthy();
            expect(result?.rating).toEqual(5);
        });

        it('should find rating by metadata match when path differs', () => {
            // Arrange
            service = createService();
            const track = createTrackModel('/new/path/to/track.mp3', ';Artist Name;', 'Song Title');

            const ratingEntries = [{ trackPath: '/old/path/to/track.mp3', rating: 7, love: 0, artist: 'Artist Name', title: 'Song Title' }];

            // Act
            const result = service.findRatingByTrack(track, ratingEntries);

            // Assert
            expect(result).toBeTruthy();
            expect(result?.rating).toEqual(7);
        });

        it('should return undefined if no match found', () => {
            // Arrange
            service = createService();
            const track = createTrackModel('/unknown/path/track.mp3', ';Unknown Artist;', 'Unknown Song');

            const ratingEntries = [{ trackPath: '/path/to/track.mp3', rating: 5, love: 1, artist: 'Artist Name', title: 'Song Title' }];

            // Act
            const result = service.findRatingByTrack(track, ratingEntries);

            // Assert
            expect(result).toBeUndefined();
        });
    });

    describe('ratingMatchesTrack', () => {
        it('should match by exact path', () => {
            // Arrange
            service = createService();
            const track = new TrackModel(new Track('/path/to/track.mp3'), dateTimeMock.object, translatorMock.object, '');
            const entry = {
                trackPath: '/path/to/track.mp3',
                rating: 5,
                love: 1,
                artist: 'Artist Name',
                title: 'Song Title',
            };

            // Act
            const result = service.ratingMatchesTrack(entry, track);

            // Assert
            expect(result).toEqual(true);
        });

        it('should match by metadata when path differs', () => {
            // Arrange
            service = createService();
            const track = createTrackModel('/new/path/track.mp3', ';Test Artist;', 'Test Song');

            const entry = {
                trackPath: '/old/path/track.mp3',
                rating: 5,
                love: 1,
                artist: 'Test Artist',
                title: 'Test Song',
            };

            // Act
            const result = service.ratingMatchesTrack(entry, track);

            // Assert
            expect(result).toEqual(true);
        });

        it('should not match if nothing matches', () => {
            // Arrange
            service = createService();
            const track = createTrackModel('/path/track.mp3', ';Different Artist;', 'Different Song');

            const entry = {
                trackPath: '/other/path/track.mp3',
                rating: 5,
                love: 1,
                artist: 'Artist Name',
                title: 'Song Title',
            };

            // Act
            const result = service.ratingMatchesTrack(entry, track);

            // Assert
            expect(result).toEqual(false);
        });
    });

    describe('createInitialBackupFromTracksAsync', () => {
        it('should create initial backup from rated tracks', async () => {
            // Arrange
            service = createService();
            const track1 = new Track('/path/to/track1.mp3');
            track1.rating = 5;
            track1.love = 1;
            track1.artists = 'Artist 1';
            track1.trackTitle = 'Song 1';

            const track2 = new Track('/path/to/track2.mp3');
            track2.rating = 8;
            track2.love = 0;
            track2.artists = 'Artist 2';
            track2.trackTitle = 'Song 2';

            fileAccessMock.setup((x) => x.pathExists('/home/user/Music/Dopamine/Ratings/ratings-backup.json')).returns(() => false);
            fileAccessMock.setup((x) => x.createFullDirectoryPathIfDoesNotExist('/home/user/Music/Dopamine/Ratings')).returns(() => {});
            fileAccessMock
                .setup((x) => x.writeToFile('/home/user/Music/Dopamine/Ratings/ratings-backup.json', It.isAnyString()))
                .returns(() => {});

            // Act
            await service.createInitialBackupFromTracksAsync([track1, track2]);

            // Assert
            fileAccessMock.verify(
                (x) => x.writeToFile('/home/user/Music/Dopamine/Ratings/ratings-backup.json', It.isAnyString()),
                Times.once(),
            );
        });

        it('should skip creation if backup already exists', async () => {
            // Arrange
            service = createService();
            const track1 = new Track('/path/to/track1.mp3');
            track1.rating = 5;

            fileAccessMock.setup((x) => x.pathExists('/home/user/Music/Dopamine/Ratings/ratings-backup.json')).returns(() => true);

            // Act
            await service.createInitialBackupFromTracksAsync([track1]);

            // Assert - writeToFile should not be called
            fileAccessMock.verify(
                (x) => x.writeToFile('/home/user/Music/Dopamine/Ratings/ratings-backup.json', It.isAnyString()),
                Times.never(),
            );
        });

        it('should skip creation if no rated tracks found', async () => {
            // Arrange
            service = createService();
            const track1 = new Track('/path/to/track1.mp3');
            track1.rating = 0; // Not rated

            fileAccessMock.setup((x) => x.pathExists('/home/user/Music/Dopamine/Ratings/ratings-backup.json')).returns(() => false);

            // Act
            await service.createInitialBackupFromTracksAsync([track1]);

            // Assert - writeToFile should not be called
            fileAccessMock.verify(
                (x) => x.writeToFile('/home/user/Music/Dopamine/Ratings/ratings-backup.json', It.isAnyString()),
                Times.never(),
            );
        });
    });

    describe('tryAutoRestoreOnStartupAsync', () => {
        it('should mark guard even when no tracks are restored', async () => {
            // Arrange
            service = createService();

            fileAccessMock.setup((x) => x.pathExists('/home/user/Music/Dopamine/Ratings/auto-restore-v1.done')).returns(() => false);
            fileAccessMock.setup((x) => x.pathExists('/home/user/Music/Dopamine/Ratings/ratings-backup.json')).returns(() => true);

            const backupContent = JSON.stringify({
                version: 1,
                lastBackupDate: Date.now(),
                ratings: [{ trackPath: '/path/rated-track.mp3', rating: 5, love: 0, artist: 'A', title: 'T' }],
            });

            fileAccessMock
                .setup((x) => x.getFileContentAsString('/home/user/Music/Dopamine/Ratings/ratings-backup.json'))
                .returns(() => backupContent);

            const tracks: Track[] = [];
            for (let i = 0; i < 20; i++) {
                const track = new Track(`/library/unmatched-${i}.mp3`);
                track.trackId = i + 1;
                track.rating = 0;
                track.love = 0;
                tracks.push(track);
            }

            // Act
            const restoredCount = await service.tryAutoRestoreOnStartupAsync(tracks);

            // Assert
            expect(restoredCount).toEqual(0);
            fileAccessMock.verify(
                (x) => x.writeToFile('/home/user/Music/Dopamine/Ratings/auto-restore-v1.done', It.isAnyString()),
                Times.once(),
            );
        });

        it('should restore with exact path match even for small rating sets', async () => {
            // Arrange
            service = createService();

            fileAccessMock.setup((x) => x.pathExists('/home/user/Music/Dopamine/Ratings/auto-restore-v1.done')).returns(() => false);
            fileAccessMock.setup((x) => x.pathExists('/home/user/Music/Dopamine/Ratings/ratings-backup.json')).returns(() => true);

            const backupContent = JSON.stringify({
                version: 1,
                lastBackupDate: Date.now(),
                ratings: [{ trackPath: '/library/song.mp3', rating: 8, love: 1, artist: 'Artist', title: 'Song' }],
            });

            fileAccessMock
                .setup((x) => x.getFileContentAsString('/home/user/Music/Dopamine/Ratings/ratings-backup.json'))
                .returns(() => backupContent);

            fileAccessMock.setup((x) => x.createFullDirectoryPathIfDoesNotExist('/home/user/Music/Dopamine/Ratings')).returns(() => {});
            fileAccessMock
                .setup((x) => x.writeToFile('/home/user/Music/Dopamine/Ratings/auto-restore-v1.done', It.isAnyString()))
                .returns(() => {});

            trackRepositoryMock.setup((x) => x.updateRating(1, 8)).returns(() => {});
            trackRepositoryMock.setup((x) => x.updateLove(1, 1)).returns(() => {});

            const track = new Track('/library/song.mp3');
            track.trackId = 1;
            track.rating = 0;
            track.love = 0;

            // Act
            const restoredCount = await service.tryAutoRestoreOnStartupAsync([track]);

            // Assert
            expect(restoredCount).toEqual(1);
            trackRepositoryMock.verify((x) => x.updateRating(1, 8), Times.once());
            trackRepositoryMock.verify((x) => x.updateLove(1, 1), Times.once());
            fileAccessMock.verify(
                (x) => x.writeToFile('/home/user/Music/Dopamine/Ratings/auto-restore-v1.done', It.isAnyString()),
                Times.once(),
            );
        });
    });
});
