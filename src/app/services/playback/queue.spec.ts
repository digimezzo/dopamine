import { IMock, Mock } from 'typemoq';
import { DateTime } from '../../common/date-time';
import { Logger } from '../../common/logger';
import { Shuffler } from '../../common/shuffler';
import { TrackModel } from '../track/track-model';
import { Queue } from './queue';
import { Track } from '../../data/entities/track';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { SettingsMock } from '../../testing/settings-mock';

describe('Queue', () => {
    let shufflerMock: IMock<Shuffler>;
    let loggerMock: IMock<Logger>;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let settingsMock: any;

    beforeEach(() => {
        shufflerMock = Mock.ofType<Shuffler>();
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        loggerMock = Mock.ofType<Logger>();
        settingsMock = new SettingsMock();
    });

    function createQueue(): Queue {
        return new Queue(shufflerMock.object, loggerMock.object);
    }

    function createTrackModel(path: string): TrackModel {
        return new TrackModel(new Track(path), dateTimeMock.object, translatorServiceMock.object, settingsMock);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const queue: Queue = createQueue();

            // Assert
            expect(queue).toBeDefined();
        });

        it('should define tracks as empty', () => {
            // Arrange

            // Act
            const queue: Queue = createQueue();

            // Assert
            expect(queue.tracks.length).toEqual(0);
        });
    });

    describe('numberOfTracks', () => {
        it('should return the number of tracks', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], false);

            // Act
            const numberOfTracks: number = queue.numberOfTracks;

            // Assert
            expect(numberOfTracks).toEqual(3);
        });
    });

    describe('setTracks', () => {
        it('should set the tracks in the order they were provided when shuffle is false', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            const queue: Queue = createQueue();

            // Act
            queue.setTracks([track1, track2, track3], false);

            // Assert
            expect(queue.tracks.length).toEqual(3);
            expect(queue.tracks[0]).toEqual(track1);
            expect(queue.tracks[1]).toEqual(track2);
            expect(queue.tracks[2]).toEqual(track3);
        });

        it('should set the tracks in the order they were provided when shuffle is true', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            const queue: Queue = createQueue();

            // Act
            queue.setTracks([track1, track2, track3], true);

            // Assert
            expect(queue.tracks.length).toEqual(3);
            expect(queue.tracks[0]).toEqual(track1);
            expect(queue.tracks[1]).toEqual(track2);
            expect(queue.tracks[2]).toEqual(track3);
        });

        it('should set clones of the tracks', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            const queue: Queue = createQueue();

            // Act
            queue.setTracks([track1, track2, track3], false);

            // Assert
            expect(queue.tracks.length).toEqual(3);
            expect(queue.tracks[0]).not.toBe(track1);
            expect(queue.tracks[0]).toEqual(track1);
            expect(queue.tracks[1]).not.toBe(track2);
            expect(queue.tracks[1]).toEqual(track2);
            expect(queue.tracks[2]).not.toBe(track3);
            expect(queue.tracks[2]).toEqual(track3);
        });
    });

    describe('getPreviousTrack', () => {
        it('should return undefined if there are no tracks', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');

            const queue: Queue = createQueue();

            // Act

            // Assert
            expect(queue.getPreviousTrack(track1, false)).toBeUndefined();
        });

        it('should return the first track if currentTrack is undefined and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2], false);

            // Act
            const previousTrack: TrackModel | undefined = queue.getPreviousTrack(undefined, false);

            // Assert
            expect(previousTrack).toEqual(track1);
        });

        it('should return the first track if currentTrack is undefined and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1])).returns(() => [1, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2], true);

            // Act
            const previousTrack: TrackModel | undefined = queue.getPreviousTrack(undefined, false);

            // Assert
            expect(previousTrack).toEqual(track2);
        });

        it('should return the first track if currentTrack is not found and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(
                new Track('/home/user/Music/Track1.mp3'),
                dateTimeMock.object,
                translatorServiceMock.object,
                settingsMock,
            );
            const track2: TrackModel = new TrackModel(
                new Track('/home/user/Music/Track2.mp3'),
                dateTimeMock.object,
                translatorServiceMock.object,
                settingsMock,
            );
            const track3: TrackModel = new TrackModel(
                new Track('/home/user/Music/Track3.mp3'),
                dateTimeMock.object,
                translatorServiceMock.object,
                settingsMock,
            );

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2], false);

            // Act
            const previousTrack: TrackModel | undefined = queue.getPreviousTrack(track3, false);

            // Assert
            expect(previousTrack).toEqual(track1);
        });

        it('should return the first track if currentTrack is not found and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1])).returns(() => [1, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2], true);

            // Act
            const previousTrack: TrackModel | undefined = queue.getPreviousTrack(track3, false);

            // Assert
            expect(previousTrack).toEqual(track2);
        });

        it('should return the previous track if currentTrack is not the first track and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], false);

            // Act
            const previousTrack: TrackModel | undefined = queue.getPreviousTrack(track2, false);

            // Assert
            expect(previousTrack).toEqual(track1);
        });

        it('should return the previous track if currentTrack is not the first track and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [1, 2, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], true);

            // Act
            const previousTrack: TrackModel | undefined = queue.getPreviousTrack(track3, false);

            // Assert
            expect(previousTrack).toEqual(track2);
        });

        it('should return undefined if currentTrack is the first track and allowWrapAround is false and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], false);

            // Act
            const track1Clone: TrackModel = queue.tracks[0];
            const previousTrack: TrackModel | undefined = queue.getPreviousTrack(track1Clone, false);

            // Assert
            expect(previousTrack).toBeUndefined();
        });

        it('should return undefined if currentTrack is the first track and allowWrapAround is false and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [1, 2, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], true);

            // Act
            const track2Clone: TrackModel = queue.tracks[1];
            const previousTrack: TrackModel | undefined = queue.getPreviousTrack(track2Clone, false);

            // Assert
            expect(previousTrack).toBeUndefined();
        });

        it('should return the last track if currentTrack is the first track and allowWrapAround is true and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], false);

            // Act
            const track1Clone: TrackModel = queue.tracks[0];
            const previousTrack: TrackModel | undefined = queue.getPreviousTrack(track1Clone, true);

            // Assert
            expect(previousTrack).toEqual(track3);
        });

        it('should return the last track if currentTrack is the first track and allowWrapAround is true and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [1, 2, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], false);

            // Act
            const previousTrack: TrackModel | undefined = queue.getPreviousTrack(track2, true);

            // Assert
            expect(previousTrack).toEqual(track1);
        });
    });

    describe('getFirstTrack', () => {
        it('should return undefined if there are no tracks', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');

            const queue: Queue = createQueue();

            // Act

            // Assert
            expect(queue.getNextTrack(track1, false)).toBeUndefined();
        });

        it('should return the first track when the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2], false);

            // Act
            const firstTrack: TrackModel | undefined = queue.getFirstTrack();

            // Assert
            expect(firstTrack).toEqual(track1);
        });

        it('should return the first track when the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');

            shufflerMock.setup((x) => x.shuffle([0, 1])).returns(() => [1, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2], true);

            // Act
            const firstTrack: TrackModel | undefined = queue.getFirstTrack();

            // Assert
            expect(firstTrack).toEqual(track2);
        });
    });

    describe('getNextTrack', () => {
        it('should return undefined if there are no tracks', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');

            const queue: Queue = createQueue();

            // Act

            // Assert
            expect(queue.getNextTrack(track1, false)).toBeUndefined();
        });

        it('should return the first track if currentTrack is undefined and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2], false);

            // Act
            const nextTrack: TrackModel | undefined = queue.getNextTrack(undefined, false);

            // Assert
            expect(nextTrack).toEqual(track1);
        });

        it('should return the first track if currentTrack is undefined and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1])).returns(() => [1, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2], true);

            // Act
            const nextTrack: TrackModel | undefined = queue.getNextTrack(undefined, false);

            // Assert
            expect(nextTrack).toEqual(track2);
        });

        it('should return the first track if currentTrack is not found and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2], false);

            // Act
            const nextTrack: TrackModel | undefined = queue.getNextTrack(track3, false);

            // Assert
            expect(nextTrack).toEqual(track1);
        });

        it('should return the first track if currentTrack is not found and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1])).returns(() => [1, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2], true);

            // Act
            const nextTrack: TrackModel | undefined = queue.getNextTrack(track3, false);

            // Assert
            expect(nextTrack).toEqual(track2);
        });

        it('should return the next track if currentTrack is not the last track and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], false);

            // Act
            const track2Clone: TrackModel = queue.tracks[1];
            const nextTrack: TrackModel | undefined = queue.getNextTrack(track2Clone, false);

            // Assert
            expect(nextTrack).toEqual(track3);
        });

        it('should return the next track if currentTrack is not the last track and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [1, 2, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], true);

            // Act
            const track3Clone: TrackModel = queue.tracks[2];
            const nextTrack: TrackModel | undefined = queue.getNextTrack(track3Clone, false);

            // Assert
            expect(nextTrack).toEqual(track1);
        });

        it('should return undefined if currentTrack is the last track and allowWrapAround is false and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], false);

            // Act
            const track3Clone: TrackModel = queue.tracks[2];
            const nextTrack: TrackModel | undefined = queue.getNextTrack(track3Clone, false);

            // Assert
            expect(nextTrack).toBeUndefined();
        });

        it('should return undefined if currentTrack is the last track and allowWrapAround is false and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [1, 2, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], true);

            // Act
            const track1Clone: TrackModel = queue.tracks[0];
            const nextTrack: TrackModel | undefined = queue.getNextTrack(track1Clone, false);

            // Assert
            expect(nextTrack).toBeUndefined();
        });

        it('should return the first track if currentTrack is the last track and allowWrapAround is true and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], false);

            // Act
            const track3Clone: TrackModel = queue.tracks[2];
            const nextTrack: TrackModel | undefined = queue.getNextTrack(track3Clone, true);

            // Assert
            expect(nextTrack).toEqual(track1);
        });

        it('should return the first track if currentTrack is the last track and allowWrapAround is true and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [1, 2, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], true);

            // Act
            const track1Clone: TrackModel = queue.tracks[0];
            const nextTrack: TrackModel | undefined = queue.getNextTrack(track1Clone, true);

            // Assert
            expect(nextTrack).toEqual(track2);
        });

        it('should return the correct next track if the same track is added multiple times', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track1, track2], false);
            const track1Clone: TrackModel = queue.tracks[0];
            const track2Clone: TrackModel = queue.tracks[1];

            // Act
            const nextTrack1: TrackModel | undefined = queue.getNextTrack(track1Clone, false);
            const nextTrack2: TrackModel | undefined = queue.getNextTrack(track2Clone, false);

            // Assert
            expect(nextTrack1).toEqual(track1);
            expect(nextTrack2).toEqual(track2);
        });
    });

    describe('unShuffle', () => {
        it('should keep tracks in unshuffled order when not being shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], false);

            // Act
            queue.unShuffle();
            const track2Clone: TrackModel = queue.tracks[1];
            const nextTrack: TrackModel | undefined = queue.getNextTrack(track2Clone, false);

            // Assert
            expect(nextTrack).toEqual(track3);
        });

        it('should keep tracks in unshuffled order after being shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [2, 1, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], true);

            // Act
            queue.unShuffle();
            const track2Clone: TrackModel = queue.tracks[1];
            const nextTrack: TrackModel | undefined = queue.getNextTrack(track2Clone, false);
            // Assert
            expect(nextTrack).toEqual(track3);
        });
    });

    describe('shuffle', () => {
        it('should put tracks in shuffled order when not being shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [2, 1, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], false);

            // Act
            queue.shuffle();
            const track2Clone: TrackModel = queue.tracks[1];
            const nextTrack: TrackModel | undefined = queue.getNextTrack(track2Clone, false);

            // Assert
            expect(nextTrack).toEqual(track1);
        });

        it('should keep tracks in shuffled order after being shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [2, 1, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], true);

            // Act
            queue.shuffle();
            const track2Clone: TrackModel = queue.tracks[1];
            const nextTrack: TrackModel | undefined = queue.getNextTrack(track2Clone, false);
            // Assert
            expect(nextTrack).toEqual(track1);
        });
    });

    describe('removeTracks', () => {
        it('should not remove tracks from queue if tracksToRemove is undefined', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], false);

            // Act
            queue.removeTracks(undefined);

            // Assert
            expect(queue.tracks.length).toEqual(3);
            expect(queue.tracks[0]).toEqual(track1);
            expect(queue.tracks[1]).toEqual(track2);
            expect(queue.tracks[2]).toEqual(track3);
        });

        it('should not remove tracks from queue if tracksToRemove is empty', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], false);

            // Act
            queue.removeTracks([]);

            // Assert
            expect(queue.tracks.length).toEqual(3);
            expect(queue.tracks[0]).toEqual(track1);
            expect(queue.tracks[1]).toEqual(track2);
            expect(queue.tracks[2]).toEqual(track3);
        });

        it('should remove tracks from queue if tracksToRemove has items', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], false);

            // Act
            const track1Clone: TrackModel = queue.tracks[0];
            const track2Clone: TrackModel = queue.tracks[1];
            const track3Clone: TrackModel = queue.tracks[2];

            queue.removeTracks([track2Clone]);

            // Assert
            expect(queue.tracks.length).toEqual(2);

            expect(queue.tracks[0]).toEqual(track1Clone);
            expect(queue.tracks[1]).toEqual(track3Clone);
        });

        it('should not remove tracks from unshuffled playback order if tracksToRemove is undefined', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
            const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3, track4, track5], false);
            const track1Clone: TrackModel = queue.tracks[0];
            const track2Clone: TrackModel = queue.tracks[1];
            const track3Clone: TrackModel = queue.tracks[2];
            const track4Clone: TrackModel = queue.tracks[3];

            // Act
            queue.removeTracks(undefined);

            // Assert
            expect(queue.getNextTrack(track1Clone, false)).toEqual(track2);
            expect(queue.getNextTrack(track2Clone, false)).toEqual(track3);
            expect(queue.getNextTrack(track3Clone, false)).toEqual(track4);
            expect(queue.getNextTrack(track4Clone, false)).toEqual(track5);
        });

        it('should not remove tracks from unshuffled playback order if tracksToRemove is empty', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
            const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');
            const queue: Queue = createQueue();

            queue.setTracks([track1, track2, track3, track4, track5], false);
            const track1Clone: TrackModel = queue.tracks[0];
            const track2Clone: TrackModel = queue.tracks[1];
            const track3Clone: TrackModel = queue.tracks[2];
            const track4Clone: TrackModel = queue.tracks[3];

            // Act
            queue.removeTracks([]);

            // Assert
            expect(queue.getNextTrack(track1Clone, false)).toEqual(track2);
            expect(queue.getNextTrack(track2Clone, false)).toEqual(track3);
            expect(queue.getNextTrack(track3Clone, false)).toEqual(track4);
            expect(queue.getNextTrack(track4Clone, false)).toEqual(track5);
        });

        it('should remove tracks from unshuffled playback order if tracksToRemove has items', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
            const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3, track4, track5], false);
            const track1Clone: TrackModel = queue.tracks[0];
            const track2Clone: TrackModel = queue.tracks[1];
            const track3Clone: TrackModel = queue.tracks[2];
            const track4Clone: TrackModel = queue.tracks[3];

            // Act
            queue.removeTracks([track2Clone, track4Clone]);

            // Assert
            expect(queue.tracks.length).toEqual(3);
            expect(queue.getNextTrack(track1Clone, false)).toEqual(track3);
            expect(queue.getNextTrack(track3Clone, false)).toEqual(track5);
        });

        it('should not remove tracks from shuffled playback order if tracksToRemove is undefined', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
            const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');

            shufflerMock.setup((x) => x.shuffle([0, 1, 2, 3, 4])).returns(() => [3, 2, 4, 0, 1]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3, track4, track5], true);
            const track1Clone: TrackModel = queue.tracks[0];
            const track2Clone: TrackModel = queue.tracks[1];
            const track3Clone: TrackModel = queue.tracks[2];
            const track4Clone: TrackModel = queue.tracks[3];
            const track5Clone: TrackModel = queue.tracks[4];

            // Act
            queue.removeTracks(undefined);

            // Assert
            expect(queue.getNextTrack(track1Clone, false)).toEqual(track2);
            expect(queue.getNextTrack(track2Clone, false)).toEqual(undefined);
            expect(queue.getNextTrack(track3Clone, false)).toEqual(track5);
            expect(queue.getNextTrack(track4Clone, false)).toEqual(track3);
            expect(queue.getNextTrack(track5Clone, false)).toEqual(track1);
        });

        it('should not remove tracks from shuffled playback order if tracksToRemove is empty', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
            const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');

            shufflerMock.setup((x) => x.shuffle([0, 1, 2, 3, 4])).returns(() => [3, 2, 4, 0, 1]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3, track4, track5], true);
            const track1Clone: TrackModel = queue.tracks[0];
            const track2Clone: TrackModel = queue.tracks[1];
            const track3Clone: TrackModel = queue.tracks[2];
            const track4Clone: TrackModel = queue.tracks[3];
            const track5Clone: TrackModel = queue.tracks[4];

            // Act
            queue.removeTracks([]);

            // Assert
            expect(queue.getNextTrack(track1Clone, false)).toEqual(track2);
            expect(queue.getNextTrack(track2Clone, false)).toEqual(undefined);
            expect(queue.getNextTrack(track3Clone, false)).toEqual(track5);
            expect(queue.getNextTrack(track4Clone, false)).toEqual(track3);
            expect(queue.getNextTrack(track5Clone, false)).toEqual(track1);
        });

        it('should remove tracks from shuffled playback order if tracksToRemove has items', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
            const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');

            shufflerMock.setup((x) => x.shuffle([0, 1, 2, 3, 4])).returns(() => [3, 2, 4, 0, 1]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3, track4, track5], true);
            const track1Clone: TrackModel = queue.tracks[0];
            const track2Clone: TrackModel = queue.tracks[1];
            const track3Clone: TrackModel = queue.tracks[2];
            const track4Clone: TrackModel = queue.tracks[3];
            const track5Clone: TrackModel = queue.tracks[4];

            // Act
            queue.removeTracks([track2Clone, track4Clone]);

            // Assert
            expect(queue.tracks.length).toEqual(3);
            expect(queue.getNextTrack(track1Clone, false)).toEqual(undefined);
            expect(queue.getNextTrack(track3Clone, false)).toEqual(track5);
            expect(queue.getNextTrack(track5Clone, false)).toEqual(track1);
        });
    });

    describe('addTracks', () => {
        it('should add tracks to the end of queue when not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
            const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2], false);

            // Act
            queue.addTracks([track3, track4, track5]);

            // Assert
            expect(queue.tracks.length).toEqual(5);
            expect(queue.tracks[0]).toEqual(track1);
            expect(queue.tracks[1]).toEqual(track2);
            expect(queue.tracks[2]).toEqual(track3);
            expect(queue.tracks[3]).toEqual(track4);
            expect(queue.tracks[4]).toEqual(track5);
        });

        it('should add tracks to the end of queue when shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
            const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');

            shufflerMock.setup((x) => x.shuffle([0, 1])).returns(() => [1, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2], true);

            // Act
            queue.addTracks([track3, track4, track5]);

            // Assert
            expect(queue.tracks.length).toEqual(5);
            expect(queue.tracks[0]).toEqual(track1);
            expect(queue.tracks[1]).toEqual(track2);
            expect(queue.tracks[2]).toEqual(track3);
            expect(queue.tracks[3]).toEqual(track4);
            expect(queue.tracks[4]).toEqual(track5);
        });

        it('should add tracks to the end of unshuffled playback order', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
            const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2], false);

            // Act
            queue.addTracks([track3, track4, track5]);
            const track1Clone: TrackModel = queue.tracks[0];
            const track2Clone: TrackModel = queue.tracks[1];
            const track3Clone: TrackModel = queue.tracks[2];
            const track4Clone: TrackModel = queue.tracks[3];
            const track5Clone: TrackModel = queue.tracks[4];

            // Assert
            expect(queue.tracks.length).toEqual(5);
            expect(queue.getNextTrack(track1Clone, false)).toEqual(track2);
            expect(queue.getNextTrack(track2Clone, false)).toEqual(track3);
            expect(queue.getNextTrack(track3Clone, false)).toEqual(track4);
            expect(queue.getNextTrack(track4Clone, false)).toEqual(track5);
            expect(queue.getNextTrack(track5Clone, false)).toEqual(undefined);
        });

        it('should add tracks to the end of shuffled playback order', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
            const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');

            shufflerMock.setup((x) => x.shuffle([0, 1])).returns(() => [1, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2], true);

            // Act
            queue.addTracks([track3, track4, track5]);

            const track1Clone: TrackModel = queue.tracks[0];
            const track2Clone: TrackModel = queue.tracks[1];
            const track3Clone: TrackModel = queue.tracks[2];
            const track4Clone: TrackModel = queue.tracks[3];
            const track5Clone: TrackModel = queue.tracks[4];

            // Assert
            expect(queue.tracks.length).toEqual(5);
            expect(queue.getNextTrack(track1Clone, false)).toEqual(track3);
            expect(queue.getNextTrack(track2Clone, false)).toEqual(track1);
            expect(queue.getNextTrack(track3Clone, false)).toEqual(track4);
            expect(queue.getNextTrack(track4Clone, false)).toEqual(track5);
            expect(queue.getNextTrack(track5Clone, false)).toEqual(undefined);
        });

        it('should add clones of the tracks', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
            const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2], false);

            // Act
            queue.addTracks([track3, track4, track5]);

            // Assert
            expect(queue.tracks.length).toEqual(5);
            expect(queue.tracks[0]).not.toBe(track1);
            expect(queue.tracks[0].path).toEqual(track1.path);
            expect(queue.tracks[1]).not.toBe(track2);
            expect(queue.tracks[1].path).toEqual(track2.path);
            expect(queue.tracks[2]).not.toBe(track3);
            expect(queue.tracks[2].path).toEqual(track3.path);
            expect(queue.tracks[3]).not.toBe(track4);
            expect(queue.tracks[3].path).toEqual(track4.path);
            expect(queue.tracks[4]).not.toBe(track5);
            expect(queue.tracks[4].path).toEqual(track5.path);
        });
    });

    describe('tracks', () => {
        it('should return the tracks in their original order when not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], false);

            // Act
            const tracks: TrackModel[] = queue.tracks;

            // Assert
            expect(tracks[0].path).toBe(track1.path);
            expect(tracks[1].path).toBe(track2.path);
            expect(tracks[2].path).toBe(track3.path);
        });

        it('should return the tracks in original order when shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [1, 2, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], true);

            // Act
            const tracks: TrackModel[] = queue.tracks;

            // Assert
            expect(tracks[0].path).toBe(track1.path);
            expect(tracks[1].path).toBe(track2.path);
            expect(tracks[2].path).toBe(track3.path);
        });
    });

    describe('tracksInPlaybackOrder', () => {
        it('should return the tracks in original order when not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], false);

            // Act
            const tracks: TrackModel[] = queue.tracksInPlaybackOrder;

            // Assert
            expect(tracks[0].path).toBe(track1.path);
            expect(tracks[1].path).toBe(track2.path);
            expect(tracks[2].path).toBe(track3.path);
        });

        it('should return the tracks in playback order when shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [1, 2, 0]);

            const queue: Queue = createQueue();
            queue.setTracks([track1, track2, track3], true);

            // Act
            const tracks: TrackModel[] = queue.tracksInPlaybackOrder;

            // Assert
            expect(tracks[0].path).toBe(track2.path);
            expect(tracks[1].path).toBe(track3.path);
            expect(tracks[2].path).toBe(track1.path);
        });
    });
});
