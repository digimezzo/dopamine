import { IMock, Mock } from 'typemoq';
import { Track } from '../../common/data/entities/track';
import { DateTime } from '../../common/date-time';
import { Logger } from '../../common/logger';
import { Shuffler } from '../../common/shuffler';
import { TrackModel } from '../track/track-model';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { Queue } from './queue';

describe('Queue', () => {
    let queue: Queue;
    let shufflerMock: IMock<Shuffler>;
    let loggerMock: IMock<Logger>;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    beforeEach(() => {
        shufflerMock = Mock.ofType<Shuffler>();
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        loggerMock = Mock.ofType<Logger>();

        shufflerMock.setup((x) => x.shuffle([0, 1, 2, 3, 4])).returns(() => [3, 2, 4, 0, 1]);
        shufflerMock.setup((x) => x.shuffle([0, 1])).returns(() => [1, 0]);

        queue = new Queue(shufflerMock.object, loggerMock.object);
    });

    function createTrackModel(path: string): TrackModel {
        return new TrackModel(new Track(path), dateTimeMock.object, translatorServiceMock.object);
    }

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

    describe('numberOfTracks', () => {
        it('should return the number of tracks', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
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
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

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
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');

            // Act

            // Assert
            expect(queue.getPreviousTrack(track1, false)).toBeUndefined();
        });

        it('should return the first track if currentTrack is undefined and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            queue.setTracks([track1, track2], false);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(undefined, false);

            // Assert
            expect(previousTrack).toBe(track1);
        });

        it('should return the first track if currentTrack is undefined and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1])).returns(() => [1, 0]);
            queue = new Queue(shufflerMock.object, loggerMock.object);
            queue.setTracks([track1, track2], true);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(undefined, false);

            // Assert
            expect(previousTrack).toBe(track2);
        });

        it('should return the first track if currentTrack is not found and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(
                new Track('/home/user/Music/Track1.mp3'),
                dateTimeMock.object,
                translatorServiceMock.object
            );
            const track2: TrackModel = new TrackModel(
                new Track('/home/user/Music/Track2.mp3'),
                dateTimeMock.object,
                translatorServiceMock.object
            );
            const track3: TrackModel = new TrackModel(
                new Track('/home/user/Music/Track3.mp3'),
                dateTimeMock.object,
                translatorServiceMock.object
            );
            queue.setTracks([track1, track2], false);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(track3, false);

            // Assert
            expect(previousTrack).toBe(track1);
        });

        it('should return the first track if currentTrack is not found and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1])).returns(() => [1, 0]);
            queue = new Queue(shufflerMock.object, loggerMock.object);
            queue.setTracks([track1, track2], true);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(track3, false);

            // Assert
            expect(previousTrack).toBe(track2);
        });

        it('should return the previous track if currentTrack is not the first track and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            queue.setTracks([track1, track2, track3], false);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(track2, false);

            // Assert
            expect(previousTrack).toBe(track1);
        });

        it('should return the previous track if currentTrack is not the first track and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [1, 2, 0]);
            queue.setTracks([track1, track2, track3], true);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(track3, false);

            // Assert
            expect(previousTrack).toBe(track2);
        });

        it('should return undefined if currentTrack is the first track and allowWrapAround is false and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            queue.setTracks([track1, track2, track3], false);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(track1, false);

            // Assert
            expect(previousTrack).toBeUndefined();
        });

        it('should return undefined if currentTrack is the first track and allowWrapAround is false and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [1, 2, 0]);
            queue.setTracks([track1, track2, track3], true);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(track2, false);

            // Assert
            expect(previousTrack).toBeUndefined();
        });

        it('should return the last track if currentTrack is the first track and allowWrapAround is true and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            queue.setTracks([track1, track2, track3], false);

            // Act
            const previousTrack: TrackModel = queue.getPreviousTrack(track1, true);

            // Assert
            expect(previousTrack).toBe(track3);
        });

        it('should return the last track if currentTrack is the first track and allowWrapAround is true and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [1, 2, 0]);
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
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');

            // Act

            // Assert
            expect(queue.getNextTrack(track1, false)).toBeUndefined();
        });

        it('should return the first track if currentTrack is undefined and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            queue.setTracks([track1, track2], false);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(undefined, false);

            // Assert
            expect(nextTrack).toBe(track1);
        });

        it('should return the first track if currentTrack is undefined and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1])).returns(() => [1, 0]);
            queue.setTracks([track1, track2], true);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(undefined, false);

            // Assert
            expect(nextTrack).toBe(track2);
        });

        it('should return the first track if currentTrack is not found and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            queue.setTracks([track1, track2], false);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(track3, false);

            // Assert
            expect(nextTrack).toBe(track1);
        });

        it('should return the first track if currentTrack is not found and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1])).returns(() => [1, 0]);
            queue.setTracks([track1, track2], true);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(track3, false);

            // Assert
            expect(nextTrack).toBe(track2);
        });

        it('should return the next track if currentTrack is not the last track and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            queue.setTracks([track1, track2, track3], false);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(track2, false);

            // Assert
            expect(nextTrack).toBe(track3);
        });

        it('should return the next track if currentTrack is not the last track and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [1, 2, 0]);
            queue.setTracks([track1, track2, track3], true);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(track3, false);

            // Assert
            expect(nextTrack).toBe(track1);
        });

        it('should return undefined if currentTrack is the last track and allowWrapAround is false and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            queue.setTracks([track1, track2, track3], false);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(track3, false);

            // Assert
            expect(nextTrack).toBeUndefined();
        });

        it('should return undefined if currentTrack is the last track and allowWrapAround is false and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [1, 2, 0]);
            queue.setTracks([track1, track2, track3], true);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(track1, false);

            // Assert
            expect(nextTrack).toBeUndefined();
        });

        it('should return the first track if currentTrack is the last track and allowWrapAround is true and the queue is not shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            queue.setTracks([track1, track2, track3], false);

            // Act
            const nextTrack: TrackModel = queue.getNextTrack(track3, true);

            // Assert
            expect(nextTrack).toBe(track1);
        });

        it('should return the first track if currentTrack is the last track and allowWrapAround is true and the queue is shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [1, 2, 0]);
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
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            queue.setTracks([track1, track2, track3], false);

            // Act
            queue.unShuffle();
            const nextTrack: TrackModel = queue.getNextTrack(track2, false);

            // Assert
            expect(nextTrack).toBe(track3);
        });

        it('should keep tracks in unshuffled order after being shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [2, 1, 0]);
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
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [2, 1, 0]);
            queue.setTracks([track1, track2, track3], false);

            // Act
            queue.shuffle();
            const nextTrack: TrackModel = queue.getNextTrack(track2, false);

            // Assert
            expect(nextTrack).toBe(track1);
        });

        it('should keep tracks in shuffled order after being shuffled', () => {
            // Arrange
            const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
            const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
            const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
            shufflerMock.setup((x) => x.shuffle([0, 1, 2])).returns(() => [2, 1, 0]);
            queue.setTracks([track1, track2, track3], true);

            // Act
            queue.shuffle();
            const nextTrack: TrackModel = queue.getNextTrack(track2, false);
            // Assert
            expect(nextTrack).toBe(track1);
        });

        describe('removeTracks', () => {
            it('should not remove tracks from queue if tracksToRemove is undefined', () => {
                // Arrange
                const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
                const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
                const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');

                queue.setTracks([track1, track2, track3], false);

                // Act
                queue.removeTracks(undefined);

                // Assert
                expect(queue.tracks.length).toEqual(3);
                expect(queue.tracks[0]).toBe(track1);
                expect(queue.tracks[1]).toBe(track2);
                expect(queue.tracks[2]).toBe(track3);
            });

            it('should not remove tracks from queue if tracksToRemove is empty', () => {
                // Arrange
                const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
                const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
                const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
                queue.setTracks([track1, track2, track3], false);

                // Act
                queue.removeTracks([]);

                // Assert
                expect(queue.tracks.length).toEqual(3);
                expect(queue.tracks[0]).toBe(track1);
                expect(queue.tracks[1]).toBe(track2);
                expect(queue.tracks[2]).toBe(track3);
            });

            it('should remove tracks from queue if tracksToRemove has items', () => {
                // Arrange
                const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
                const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
                const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
                queue.setTracks([track1, track2, track3], false);

                // Act
                queue.removeTracks([track2]);

                // Assert
                expect(queue.tracks.length).toEqual(2);
                expect(queue.tracks[0]).toBe(track1);
                expect(queue.tracks[1]).toBe(track3);
            });

            it('should not remove tracks from unshuffled playback order if tracksToRemove is undefined', () => {
                // Arrange
                const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
                const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
                const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
                const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
                const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');
                queue.setTracks([track1, track2, track3, track4, track5], false);

                // Act
                queue.removeTracks(undefined);

                // Assert
                expect(queue.getNextTrack(track1, false)).toEqual(track2);
                expect(queue.getNextTrack(track2, false)).toEqual(track3);
                expect(queue.getNextTrack(track3, false)).toEqual(track4);
                expect(queue.getNextTrack(track4, false)).toEqual(track5);
            });

            it('should not remove tracks from unshuffled playback order if tracksToRemove is empty', () => {
                // Arrange
                const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
                const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
                const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
                const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
                const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');
                queue.setTracks([track1, track2, track3, track4, track5], false);

                // Act
                queue.removeTracks([]);

                // Assert
                expect(queue.getNextTrack(track1, false)).toEqual(track2);
                expect(queue.getNextTrack(track2, false)).toEqual(track3);
                expect(queue.getNextTrack(track3, false)).toEqual(track4);
                expect(queue.getNextTrack(track4, false)).toEqual(track5);
            });

            it('should remove tracks from unshuffled playback order if tracksToRemove has items', () => {
                // Arrange
                const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
                const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
                const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
                const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
                const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');
                queue.setTracks([track1, track2, track3, track4, track5], false);

                // Act
                queue.removeTracks([track2, track4]);

                // Assert
                expect(queue.tracks.length).toEqual(3);
                expect(queue.getNextTrack(track1, false)).toEqual(track3);
                expect(queue.getNextTrack(track3, false)).toEqual(track5);
            });

            it('should not remove tracks from shuffled playback order if tracksToRemove is undefined', () => {
                // Arrange
                const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
                const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
                const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
                const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
                const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');
                queue.setTracks([track1, track2, track3, track4, track5], true);

                // Act
                queue.removeTracks(undefined);

                // Assert
                expect(queue.getNextTrack(track1, false)).toEqual(track2);
                expect(queue.getNextTrack(track2, false)).toEqual(undefined);
                expect(queue.getNextTrack(track3, false)).toEqual(track5);
                expect(queue.getNextTrack(track4, false)).toEqual(track3);
                expect(queue.getNextTrack(track5, false)).toEqual(track1);
            });

            it('should not remove tracks from shuffled playback order if tracksToRemove is empty', () => {
                // Arrange
                const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
                const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
                const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
                const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
                const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');
                queue.setTracks([track1, track2, track3, track4, track5], true);

                // Act
                queue.removeTracks([]);

                // Assert
                expect(queue.getNextTrack(track1, false)).toEqual(track2);
                expect(queue.getNextTrack(track2, false)).toEqual(undefined);
                expect(queue.getNextTrack(track3, false)).toEqual(track5);
                expect(queue.getNextTrack(track4, false)).toEqual(track3);
                expect(queue.getNextTrack(track5, false)).toEqual(track1);
            });

            it('should remove tracks from shuffled playback order if tracksToRemove has items', () => {
                // Arrange
                const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
                const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
                const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
                const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
                const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');
                queue.setTracks([track1, track2, track3, track4, track5], true);

                // Act
                queue.removeTracks([track2, track4]);

                // Assert
                expect(queue.tracks.length).toEqual(3);
                expect(queue.getNextTrack(track1, false)).toEqual(undefined);
                expect(queue.getNextTrack(track3, false)).toEqual(track5);
                expect(queue.getNextTrack(track5, false)).toEqual(track1);
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
                queue.setTracks([track1, track2], false);

                // Act
                queue.addTracks([track3, track4, track5]);

                // Assert
                expect(queue.tracks.length).toEqual(5);
                expect(queue.getNextTrack(track1, false)).toEqual(track2);
                expect(queue.getNextTrack(track2, false)).toEqual(track3);
                expect(queue.getNextTrack(track3, false)).toEqual(track4);
                expect(queue.getNextTrack(track4, false)).toEqual(track5);
                expect(queue.getNextTrack(track5, false)).toEqual(undefined);
            });

            it('should add tracks to the end of shuffled playback order', () => {
                // Arrange
                const track1: TrackModel = createTrackModel('/home/user/Music/Track1.mp3');
                const track2: TrackModel = createTrackModel('/home/user/Music/Track2.mp3');
                const track3: TrackModel = createTrackModel('/home/user/Music/Track3.mp3');
                const track4: TrackModel = createTrackModel('/home/user/Music/Track4.mp3');
                const track5: TrackModel = createTrackModel('/home/user/Music/Track5.mp3');
                queue.setTracks([track1, track2], true);

                // Act
                queue.addTracks([track3, track4, track5]);

                // Assert
                expect(queue.tracks.length).toEqual(5);
                expect(queue.getNextTrack(track1, false)).toEqual(track3);
                expect(queue.getNextTrack(track2, false)).toEqual(track1);
                expect(queue.getNextTrack(track3, false)).toEqual(track4);
                expect(queue.getNextTrack(track4, false)).toEqual(track5);
                expect(queue.getNextTrack(track5, false)).toEqual(undefined);
            });
        });
    });
});
