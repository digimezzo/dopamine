import { IMock, Mock } from 'typemoq';
import { ListRandomizer } from '../../core/list-randomizer';
import { Logger } from '../../core/logger';
import { Track } from '../../data/entities/track';
import { TrackModel } from '../track/track-model';
import { Queue } from './queue';

describe('Queue', () => {
    let queue: Queue;
    let listRandomizerMock: IMock<ListRandomizer>;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        listRandomizerMock = Mock.ofType<ListRandomizer>();
        loggerMock = Mock.ofType<Logger>();
        queue = new Queue(listRandomizerMock.object, loggerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(queue).toBeDefined();
        });

        it('should define tracks as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(queue.tracks.length).toEqual(0);
        });
    });

    describe('setTracks', () => {
        it('should set the tracks in the order they were provided when shuffle is false', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));

            // Act
            queue.setTracks([track1, track2, track3], false);

            // Assert
            expect(queue.tracks.length).toEqual(3);
            expect(queue.tracks[0]).toBe(track1);
            expect(queue.tracks[1]).toBe(track2);
            expect(queue.tracks[2]).toBe(track3);
        });

        it('should set the tracks in the order they were provided when shuffle is true', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));

            // Act
            queue.setTracks([track1, track2, track3], true);

            // Assert
            expect(queue.tracks.length).toEqual(3);
            expect(queue.tracks[0]).toBe(track1);
            expect(queue.tracks[1]).toBe(track2);
            expect(queue.tracks[2]).toBe(track3);
        });
    });

    describe('getPreviousTrack', () => {
        it('should return undefined if there are no tracks', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));

            // Act

            // Assert
            expect(queue.getPreviousTrack(track1, false)).toBeUndefined();
        });

        it('should return the first track if currentTrack is undefined and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            queue.setTracks([track1, track2], false);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(undefined, false);

            // Assert
            expect(previousTrack).toBe(track1);
        });

        it('should return the first track if currentTrack is undefined and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            listRandomizerMock.setup((x) => x.randomizeNumbers([0, 1])).returns(() => [1, 0]);
            queue = new Queue(listRandomizerMock.object, loggerMock.object);
            queue.setTracks([track1, track2], true);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(undefined, false);

            // Assert
            expect(previousTrack).toBe(track2);
        });

        it('should return the first track if currentTrack is not found and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            queue.setTracks([track1, track2], false);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(track3, false);

            // Assert
            expect(previousTrack).toBe(track1);
        });

        it('should return the first track if currentTrack is not found and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            listRandomizerMock.setup((x) => x.randomizeNumbers([0, 1])).returns(() => [1, 0]);
            queue = new Queue(listRandomizerMock.object, loggerMock.object);
            queue.setTracks([track1, track2], true);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(track3, false);

            // Assert
            expect(previousTrack).toBe(track2);
        });

        it('should return the previous track if currentTrack is not the first track and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            queue.setTracks([track1, track2, track3], false);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(track2, false);

            // Assert
            expect(previousTrack).toBe(track1);
        });

        it('should return the previous track if currentTrack is not the first track and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            listRandomizerMock.setup((x) => x.randomizeNumbers([0, 1, 2])).returns(() => [1, 2, 0]);
            queue.setTracks([track1, track2, track3], true);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(track3, false);

            // Assert
            expect(previousTrack).toBe(track2);
        });

        it('should return undefined if currentTrack is the first track and allowWrapAround is false and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            queue.setTracks([track1, track2, track3], false);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(track1, false);

            // Assert
            expect(previousTrack).toBeUndefined();
        });

        it('should return undefined if currentTrack is the first track and allowWrapAround is false and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            listRandomizerMock.setup((x) => x.randomizeNumbers([0, 1, 2])).returns(() => [1, 2, 0]);
            queue.setTracks([track1, track2, track3], true);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(track2, false);

            // Assert
            expect(previousTrack).toBeUndefined();
        });

        it('should return the last track if currentTrack is the first track and allowWrapAround is true and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            queue.setTracks([track1, track2, track3], false);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(track1, true);

            // Assert
            expect(previousTrack).toBe(track3);
        });

        it('should return the last track if currentTrack is the first track and allowWrapAround is true and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            listRandomizerMock.setup((x) => x.randomizeNumbers([0, 1, 2])).returns(() => [1, 2, 0]);
            queue.setTracks([track1, track2, track3], false);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(track2, true);

            // Assert
            expect(previousTrack).toBe(track1);
        });
    });

    describe('getNextTrack', () => {
        it('should return undefined if there are no tracks', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));

            // Act

            // Assert
            expect(queue.getNextTrack(track1, false)).toBeUndefined();
        });

        it('should return the first track if currentTrack is undefined and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            queue.setTracks([track1, track2], false);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(undefined, false);

            // Assert
            expect(nextTrack).toBe(track1);
        });

        it('should return the first track if currentTrack is undefined and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            listRandomizerMock.setup((x) => x.randomizeNumbers([0, 1])).returns(() => [1, 0]);
            queue.setTracks([track1, track2], true);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(undefined, false);

            // Assert
            expect(nextTrack).toBe(track2);
        });

        it('should return the first track if currentTrack is not found and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            queue.setTracks([track1, track2], false);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(track3, false);

            // Assert
            expect(nextTrack).toBe(track1);
        });

        it('should return the first track if currentTrack is not found and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            listRandomizerMock.setup((x) => x.randomizeNumbers([0, 1])).returns(() => [1, 0]);
            queue.setTracks([track1, track2], true);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(track3, false);

            // Assert
            expect(nextTrack).toBe(track2);
        });

        it('should return the next track if currentTrack is not the last track and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            queue.setTracks([track1, track2, track3], false);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(track2, false);

            // Assert
            expect(nextTrack).toBe(track3);
        });

        it('should return the next track if currentTrack is not the last track and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            listRandomizerMock.setup((x) => x.randomizeNumbers([0, 1, 2])).returns(() => [1, 2, 0]);
            queue.setTracks([track1, track2, track3], true);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(track3, false);

            // Assert
            expect(nextTrack).toBe(track1);
        });

        it('should return undefined if currentTrack is the last track and allowWrapAround is false and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            queue.setTracks([track1, track2, track3], false);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(track3, false);

            // Assert
            expect(nextTrack).toBeUndefined();
        });

        it('should return undefined if currentTrack is the last track and allowWrapAround is false and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            listRandomizerMock.setup((x) => x.randomizeNumbers([0, 1, 2])).returns(() => [1, 2, 0]);
            queue.setTracks([track1, track2, track3], true);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(track1, false);

            // Assert
            expect(nextTrack).toBeUndefined();
        });

        it('should return the first track if currentTrack is the last track and allowWrapAround is true and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            queue.setTracks([track1, track2, track3], false);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(track3, true);

            // Assert
            expect(nextTrack).toBe(track1);
        });

        it('should return the first track if currentTrack is the last track and allowWrapAround is true and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            listRandomizerMock.setup((x) => x.randomizeNumbers([0, 1, 2])).returns(() => [1, 2, 0]);
            queue.setTracks([track1, track2, track3], true);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(track1, true);

            // Assert
            expect(nextTrack).toBe(track2);
        });
    });

    describe('unShuffle', () => {
        it('should keep tracks in unshuffled order when not being shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            queue.setTracks([track1, track2, track3], false);

            // Act
            queue.unShuffle();
            const nextTrack: TrackModel = queue.getNextTrack(track2, false);

            // Assert
            expect(nextTrack).toBe(track3);
        });

        it('should keep tracks in unshuffled order after being shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            listRandomizerMock.setup((x) => x.randomizeNumbers([0, 1, 2])).returns(() => [2, 1, 0]);
            queue.setTracks([track1, track2, track3], true);

            // Act
            queue.unShuffle();
            const nextTrack: TrackModel = queue.getNextTrack(track2, false);
            // Assert
            expect(nextTrack).toBe(track3);
        });
    });

    describe('shuffle', () => {
        it('should put tracks in shuffled order when not being shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            listRandomizerMock.setup((x) => x.randomizeNumbers([0, 1, 2])).returns(() => [2, 1, 0]);
            queue.setTracks([track1, track2, track3], false);

            // Act
            queue.shuffle();
            const nextTrack: TrackModel = queue.getNextTrack(track2, false);

            // Assert
            expect(nextTrack).toBe(track1);
        });

        it('should keep tracks in shuffled order after being shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            listRandomizerMock.setup((x) => x.randomizeNumbers([0, 1, 2])).returns(() => [2, 1, 0]);
            queue.setTracks([track1, track2, track3], true);

            // Act
            queue.shuffle();
            const nextTrack: TrackModel = queue.getNextTrack(track2, false);
            // Assert
            expect(nextTrack).toBe(track1);
        });
    });
});
