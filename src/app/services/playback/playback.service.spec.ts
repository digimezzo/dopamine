import { Observable, Subject, Subscription } from 'rxjs';
import { ExpectedCallType, IMock, It, Mock, Times } from 'typemoq';
import { Logger } from '../../core/logger';
import { SettingsStub } from '../../core/settings/settings-stub';
import { Track } from '../../data/entities/track';
import { TrackModel } from '../track/track-model';
import { BaseAudioPlayer } from './base-audio-player';
import { LoopMode } from './loop-mode';
import { PlaybackProgress } from './playback-progress';
import { PlaybackStarted } from './playback-started';
import { PlaybackService } from './playback.service';
import { ProgressUpdater } from './progress-updater';
import { Queue } from './queue';

describe('PlaybackService', () => {
    let audioPlayerMock: IMock<BaseAudioPlayer>;
    let loggerMock: IMock<Logger>;
    let queueMock: IMock<Queue>;
    let progressUpdaterMock: IMock<ProgressUpdater>;
    let settingsMock: SettingsStub;
    let service: PlaybackService;
    let playbackFinished: Subject<void>;
    let progressUpdaterProgressChanged: Subject<PlaybackProgress>;
    let subscription: Subscription;

    beforeEach(() => {
        audioPlayerMock = Mock.ofType<BaseAudioPlayer>();
        loggerMock = Mock.ofType<Logger>();
        queueMock = Mock.ofType<Queue>();
        progressUpdaterMock = Mock.ofType<ProgressUpdater>();
        settingsMock = new SettingsStub();
        playbackFinished = new Subject();
        progressUpdaterProgressChanged = new Subject();
        const playbackFinished$: Observable<void> = playbackFinished.asObservable();
        const progressUpdaterProgressChanged$: Observable<PlaybackProgress> = progressUpdaterProgressChanged.asObservable();

        audioPlayerMock.setup((x) => x.playbackFinished$).returns(() => playbackFinished$);
        progressUpdaterMock.setup((x) => x.progressChanged$).returns(() => progressUpdaterProgressChanged$);

        subscription = new Subscription();

        service = new PlaybackService(
            audioPlayerMock.object,
            queueMock.object,
            progressUpdaterMock.object,
            settingsMock,
            loggerMock.object
        );
    });

    afterEach(() => {
        subscription.unsubscribe();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });

        it('should define progressChanged$', () => {
            // Arrange

            // Act

            // Assert
            expect(service.progressChanged$).toBeDefined();
        });

        it('should define progress with progressSeconds as 0 and totalSeconds as 0', () => {
            // Arrange

            // Act

            // Assert
            expect(service.progress.progressSeconds).toEqual(0);
            expect(service.progress.totalSeconds).toEqual(0);
        });

        it('should define playbackStarted$', () => {
            // Arrange

            // Act

            // Assert
            expect(service.playbackStarted$).toBeDefined();
        });

        it('should initialize loopMode as LoopMode.None', () => {
            // Arrange

            // Act

            // Assert
            expect(service.loopMode).toEqual(LoopMode.None);
        });

        it('should initialize isPlaying as false', () => {
            // Arrange

            // Act

            // Assert
            expect(service.isShuffled).toBeFalsy();
        });

        it('should initialize isShuffled as false', () => {
            // Arrange

            // Act

            // Assert
            expect(service.isShuffled).toBeFalsy();
        });

        it('should initialize canPause as false', () => {
            // Arrange

            // Act

            // Assert
            expect(service.canPause).toBeFalsy();
        });

        it('should initialize canResume as true', () => {
            // Arrange

            // Act

            // Assert
            expect(service.canResume).toBeTruthy();
        });
        it('should stop playback on playback finished if a next track is not found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));

            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => undefined);

            // Act
            playbackFinished.next();

            // Assert
            audioPlayerMock.verify((x) => x.stop(), Times.exactly(1));
        });

        it('should ensure that it is possible to resume on playback finished if a next track is not found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];
            service.enqueueAndPlay(tracks, track1);

            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => undefined);

            // Act
            playbackFinished.next();

            // Assert
            expect(service.canResume).toBeTruthy();
        });

        it('should ensure that it is not possible to pause on playback finished if a next track is not found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];
            service.enqueueAndPlay(tracks, track1);

            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => undefined);

            // Act
            playbackFinished.next();

            // Assert
            expect(service.canPause).toBeFalsy();
        });

        it('should play the same track on playback finished if loopMode is One', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];

            while (service.loopMode !== LoopMode.One) {
                service.toggleLoopMode();
            }

            service.enqueueAndPlay(tracks, track1);
            audioPlayerMock.reset();

            // Act
            playbackFinished.next();

            // Assert
            audioPlayerMock.verify((x) => x.play(track1.path), Times.exactly(1));
        });

        it('should not play the next track on playback finished if found and if loopMode is One', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];

            while (service.loopMode !== LoopMode.One) {
                service.toggleLoopMode();
            }

            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => track2);
            audioPlayerMock.reset();

            // Act
            playbackFinished.next();

            // Assert
            audioPlayerMock.verify((x) => x.play(track2.path), Times.never());
        });

        it('should play the next track on playback finished if found and if loopMode is All', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];

            while (service.loopMode !== LoopMode.All) {
                service.toggleLoopMode();
            }

            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getNextTrack(track1, true)).returns(() => track2);
            audioPlayerMock.reset();

            // Act
            playbackFinished.next();

            // Assert
            audioPlayerMock.verify((x) => x.play(track2.path), Times.exactly(1));
        });

        it('should play the next track on playback finished if found and if loopMode is None', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];

            while (service.loopMode !== LoopMode.None) {
                service.toggleLoopMode();
            }

            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => track2);
            audioPlayerMock.reset();

            // Act
            playbackFinished.next();

            // Assert
            audioPlayerMock.verify((x) => x.play(track2.path), Times.exactly(1));
        });

        it('should only stop playback a single time on playback finished if a next track is found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];

            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => track2);
            audioPlayerMock.reset();

            // Act
            playbackFinished.next();

            // Assert
            audioPlayerMock.verify((x) => x.stop(), Times.exactly(1));
        });

        it('should get the next track without wrap around on playback finished if loopMode is None', () => {
            // Arrange

            // Act
            playbackFinished.next();

            // Assert
            queueMock.verify((x) => x.getNextTrack(It.isAny(), false), Times.exactly(1));
        });

        it('should get the next track with wrap around on playback finished if loopMode is All', () => {
            // Arrange
            while (service.loopMode !== LoopMode.All) {
                service.toggleLoopMode();
            }

            // Act
            playbackFinished.next();

            // Assert
            queueMock.verify((x) => x.getNextTrack(It.isAny(), true), Times.exactly(1));
        });

        it('should stop updating progress on playback finished if a next track is not found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));

            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => undefined);

            // Act
            playbackFinished.next();

            // Assert
            progressUpdaterMock.verify((x) => x.stopUpdatingProgress(), Times.exactly(1));
        });

        it('should start updating progress on playback finished if a next track is found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const tracks: TrackModel[] = [track1, track2];
            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => track2);
            progressUpdaterMock.reset();

            // Act
            playbackFinished.next();

            // Assert
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.exactly(1));
        });

        it('should set the current track to the next track that was found on playback finished', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const tracks: TrackModel[] = [track1, track2];
            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => track2);

            // Act
            playbackFinished.next();

            // Assert
            expect(service.currentTrack).toBe(track2);
        });

        it('should raise playbackStarted, containing the current track and information that a next track is being played, on playback finished.', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const tracks: TrackModel[] = [track1, track2];
            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => track2);

            let receivedTrack: TrackModel;
            let isPlayingPreviousTrack: boolean;

            subscription.add(
                service.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                    receivedTrack = playbackStarted.currentTrack;
                    isPlayingPreviousTrack = playbackStarted.isPlayingPreviousTrack;
                })
            );

            // Act
            playbackFinished.next();

            // Assert
            expect(receivedTrack).toBe(track2);
            expect(isPlayingPreviousTrack).toBeFalsy();
        });

        it('should listen to progress changes, set the progress in the service and publish progress changed.', () => {
            let subscribedProgress: PlaybackProgress;

            subscription.add(
                service.progressChanged$.subscribe((playbackProgress: PlaybackProgress) => {
                    subscribedProgress = playbackProgress;
                })
            );

            // Act
            progressUpdaterProgressChanged.next(new PlaybackProgress(40, 300));

            // Assert
            expect(service.progress).toBeDefined();
            expect(service.progress.progressSeconds).toEqual(40);
            expect(service.progress.totalSeconds).toEqual(300);
            expect(subscribedProgress).toBeDefined();
            expect(subscribedProgress.progressSeconds).toEqual(40);
            expect(subscribedProgress.totalSeconds).toEqual(300);
        });

        it('should indicate that playback is stopped on playback finished if a next track is not found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const tracks: TrackModel[] = [track1];
            service.enqueueAndPlay(tracks, track1);

            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => undefined);

            // Act
            playbackFinished.next();

            // Assert
            expect(service.isPlaying).toBeFalsy();
        });

        it('should indicate that playback is in progress on playback finished if a next track is found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const tracks: TrackModel[] = [track1, track2];
            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => track2);
            progressUpdaterMock.reset();

            // Act
            playbackFinished.next();

            // Assert
            expect(service.isPlaying).toBeTruthy();
        });

        it('should apply volume from the settings', () => {
            // Arrange

            // Act

            // Assert
            expect(service.volume).toEqual(0.6);
            audioPlayerMock.verify((x) => x.setVolume(0.6), Times.exactly(1));
        });
    });

    describe('toggleLoopMode', () => {
        it('should set loopMode to All when loopMode is None', () => {
            // Arrange
            while (service.loopMode !== LoopMode.None) {
                service.toggleLoopMode();
            }

            // Act
            service.toggleLoopMode();

            // Assert
            expect(service.loopMode).toEqual(LoopMode.All);
        });

        it('should set loopMode to One when loopMode is All', () => {
            // Arrange
            while (service.loopMode !== LoopMode.All) {
                service.toggleLoopMode();
            }

            // Act
            service.toggleLoopMode();

            // Assert
            expect(service.loopMode).toEqual(LoopMode.One);
        });

        it('should set loopMode to None when loopMode is One', () => {
            // Arrange
            while (service.loopMode !== LoopMode.One) {
                service.toggleLoopMode();
            }

            // Act
            service.toggleLoopMode();

            // Assert
            expect(service.loopMode).toEqual(LoopMode.None);
        });
    });

    describe('toggleIsShuffled', () => {
        it('should enable shuffle when shuffle is disabled', () => {
            // Arrange
            while (service.isShuffled !== false) {
                service.toggleIsShuffled();
            }

            // Act
            service.toggleIsShuffled();

            // Assert
            expect(service.isShuffled).toBeTruthy();
        });

        it('should shuffle the queue when shuffle is disabled', () => {
            // Arrange
            while (service.isShuffled !== false) {
                service.toggleIsShuffled();
            }

            // Act
            service.toggleIsShuffled();

            // Assert
            queueMock.verify((x) => x.shuffle(), Times.exactly(1));
        });

        it('should not unshuffle the queue when shuffle is disabled', () => {
            // Arrange
            while (service.isShuffled !== false) {
                service.toggleIsShuffled();
            }

            // Act
            service.toggleIsShuffled();

            // Assert
            queueMock.verify((x) => x.unShuffle(), Times.never());
        });

        it('should disable shuffle when shuffle is enabled', () => {
            // Arrange
            while (service.isShuffled !== true) {
                service.toggleIsShuffled();
            }

            // Act
            service.toggleIsShuffled();

            // Assert
            expect(service.isShuffled).toBeFalsy();
        });

        it('should have shuffled the queue when shuffle is enabled', () => {
            // Arrange
            while (service.isShuffled !== true) {
                service.toggleIsShuffled();
            }

            // Act
            service.toggleIsShuffled();

            // Assert
            queueMock.verify((x) => x.shuffle(), Times.exactly(1));
        });

        it('should unshuffle the queue when shuffle is enabled', () => {
            // Arrange
            while (service.isShuffled !== true) {
                service.toggleIsShuffled();
            }

            // Act
            service.toggleIsShuffled();

            // Assert
            queueMock.verify((x) => x.unShuffle(), Times.exactly(1));
        });
    });

    describe('enqueueAndPlay', () => {
        it('should not add tracks to the queue if tracks is undefined', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const tracks: TrackModel[] = undefined;

            // Act
            service.enqueueAndPlay(undefined, track1);

            // Assert
            queueMock.verify((x) => x.setTracks(It.isAny(), It.isAny()), Times.never());
        });

        it('should not add tracks to the queue if tracks is empty', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const tracks: TrackModel[] = [];

            // Act
            service.enqueueAndPlay(undefined, track1);

            // Assert
            queueMock.verify((x) => x.setTracks(It.isAny(), It.isAny()), Times.never());
        });

        it('should not start playback if tracks is undefined', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const tracks: TrackModel[] = undefined;

            // Act
            service.enqueueAndPlay(undefined, track1);

            // Assert
            audioPlayerMock.verify((x) => x.play(It.isAny()), Times.never());
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.never());
            expect(service.isPlaying).toEqual(false);
            expect(service.canPause).toEqual(false);
            expect(service.canResume).toEqual(true);
        });

        it('should not start playback if tracks is empty', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const tracks: TrackModel[] = [];

            // Act
            service.enqueueAndPlay(undefined, track1);

            // Assert
            audioPlayerMock.verify((x) => x.play(It.isAny()), Times.never());
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.never());
            expect(service.isPlaying).toEqual(false);
            expect(service.canPause).toEqual(false);
            expect(service.canResume).toEqual(true);
        });

        it('should not start playback if trackToPlay is undefined', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const tracks: TrackModel[] = [track1, track2];

            // Act
            service.enqueueAndPlay(tracks, undefined);

            // Assert
            audioPlayerMock.verify((x) => x.play(It.isAny()), Times.never());
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.never());
            expect(service.isPlaying).toEqual(false);
            expect(service.canPause).toEqual(false);
            expect(service.canResume).toEqual(true);
        });

        it('should add tracks to the queue unshuffled if shuffle is disabled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];

            // Act
            service.enqueueAndPlay(tracks, track1);

            // Assert
            queueMock.verify((x) => x.setTracks(tracks, false), Times.exactly(1));
        });

        it('should add tracks to the queue shuffled if shuffle is enabled', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];
            service.toggleIsShuffled();

            // Act
            service.enqueueAndPlay(tracks, track1);

            // Assert
            queueMock.verify((x) => x.setTracks(tracks, true), Times.exactly(1));
        });

        it('should stop playback and then play the given track', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];

            audioPlayerMock.reset();

            audioPlayerMock.setup((x) => x.stop()).verifiable(Times.once(), ExpectedCallType.InSequence);
            audioPlayerMock.setup((x) => x.play(track1.path)).verifiable(Times.once(), ExpectedCallType.InSequence);

            // Act
            service.enqueueAndPlay(tracks, track1);

            // Assert
            audioPlayerMock.verifyAll();
        });

        it('should set the current track to the given track', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];

            // Act
            service.enqueueAndPlay(tracks, track1);

            // Assert
            expect(service.currentTrack).toBe(track1);
        });

        it('should raise playbackStarted, containing the current track and information that a next track is being played.', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];

            let receivedTrack: TrackModel;
            let isPlayingPreviousTrack: boolean;

            subscription.add(
                service.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                    receivedTrack = playbackStarted.currentTrack;
                    isPlayingPreviousTrack = playbackStarted.isPlayingPreviousTrack;
                })
            );

            // Act
            service.enqueueAndPlay(tracks, track1);

            // Assert
            expect(receivedTrack).toBe(track1);
            expect(isPlayingPreviousTrack).toBeFalsy();
        });

        it('should ensure that it is possible to pause', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];

            // Act
            service.enqueueAndPlay(tracks, track1);

            // Assert
            expect(service.canPause).toBeTruthy();
        });

        it('should ensure that it is not possible to resume', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];

            // Act
            service.enqueueAndPlay(tracks, track1);

            // Assert
            expect(service.canResume).toBeFalsy();
        });

        it('should start updating progress', () => {
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];

            // Act
            service.enqueueAndPlay(tracks, track1);

            // Assert
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.exactly(1));
        });

        it('should indicate that playback is in progress', () => {
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];

            // Act
            service.enqueueAndPlay(tracks, track1);

            // Assert
            expect(service.isPlaying).toBeTruthy();
        });
    });

    describe('pause', () => {
        it('should pause playback', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];
            service.enqueueAndPlay(tracks, track1);

            // Act
            service.pause();

            // Assert
            audioPlayerMock.verify((x) => x.pause(), Times.exactly(1));
        });

        it('should ensure that it is not possible to pause', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];
            service.enqueueAndPlay(tracks, track1);

            // Act
            service.pause();

            // Assert
            expect(service.canPause).toBeFalsy();
        });

        it('should ensure that it is possible to resume', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];
            service.enqueueAndPlay(tracks, track1);

            // Act
            service.pause();

            // Assert
            expect(service.canResume).toBeTruthy();
        });

        it('should pause updating progress', () => {
            // Arrange

            // Act
            service.pause();

            // Assert
            progressUpdaterMock.verify((x) => x.pauseUpdatingProgress(), Times.exactly(1));
        });
    });

    describe('resume', () => {
        it('should resume playback if playing', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];
            service.enqueueAndPlay(tracks, track1);
            audioPlayerMock.reset();
            progressUpdaterMock.reset();

            // Act
            service.resume();

            // Assert
            audioPlayerMock.verify((x) => x.resume(), Times.exactly(1));
            expect(service.canPause).toBeTruthy();
            expect(service.canResume).toBeFalsy();
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.exactly(1));
        });

        it('should not resume playback if not playing', () => {
            // Arrange

            // Act
            service.resume();

            // Assert
            audioPlayerMock.verify((x) => x.resume(), Times.never());
            expect(service.canPause).toBeFalsy();
            expect(service.canResume).toBeTruthy();
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.never());
        });
    });

    describe('skipByFractionOfTotalSeconds', () => {
        it('should skip to a fraction of the total seconds', () => {
            // Arrange
            audioPlayerMock.setup((x) => x.totalSeconds).returns(() => 60);

            // Act
            service.skipByFractionOfTotalSeconds(0.5);

            // Assert
            audioPlayerMock.verify((x) => x.skipToSeconds(30), Times.exactly(1));
        });
    });

    describe('playPrevious', () => {
        it('should stop playback if a previous track is not found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));

            queueMock.setup((x) => x.getPreviousTrack(track1, false)).returns(() => undefined);

            // Act
            service.playPrevious();

            // Assert
            audioPlayerMock.verify((x) => x.stop(), Times.exactly(1));
        });

        it('should ensure that it is possible to resume if a previous track is not found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];
            service.enqueueAndPlay(tracks, track1);

            queueMock.setup((x) => x.getPreviousTrack(track1, false)).returns(() => undefined);

            // Act
            service.playPrevious();

            // Assert
            expect(service.canResume).toBeTruthy();
        });

        it('should ensure that it is not possible to pause if a previous track is not found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];
            service.enqueueAndPlay(tracks, track1);

            queueMock.setup((x) => x.getPreviousTrack(track1, false)).returns(() => undefined);

            // Act
            service.playPrevious();

            // Assert
            expect(service.canPause).toBeFalsy();
        });

        it('should play the previous track if found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];
            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getPreviousTrack(track1, false)).returns(() => track2);

            // Act
            service.playPrevious();

            // Assert
            audioPlayerMock.verify((x) => x.play(track2.path), Times.exactly(1));
        });

        it('should only stop playback a single time if a previous track is found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];
            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getPreviousTrack(track1, false)).returns(() => track2);
            audioPlayerMock.reset();

            // Act
            service.playPrevious();

            // Assert
            audioPlayerMock.verify((x) => x.stop(), Times.exactly(1));
        });

        it('should get the previous track without wrap around if loopMode is None', () => {
            // Arrange

            // Act
            service.playPrevious();

            // Assert
            queueMock.verify((x) => x.getPreviousTrack(It.isAny(), false), Times.exactly(1));
        });

        it('should get the previous track with wrap around if loopMode is All', () => {
            // Arrange
            service.toggleLoopMode();

            // Act
            service.playPrevious();

            // Assert
            queueMock.verify((x) => x.getPreviousTrack(It.isAny(), true), Times.exactly(1));
        });

        it('should get the previous track with wrap around if loopMode is One', () => {
            // Arrange
            service.toggleLoopMode();
            service.toggleLoopMode();

            // Act
            service.playPrevious();

            // Assert
            queueMock.verify((x) => x.getPreviousTrack(It.isAny(), false), Times.exactly(1));
        });

        it('should stop updating progress if a previous track is not found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));

            queueMock.setup((x) => x.getPreviousTrack(track1, false)).returns(() => undefined);

            // Act
            service.playPrevious();

            // Assert
            progressUpdaterMock.verify((x) => x.stopUpdatingProgress(), Times.exactly(1));
        });

        it('should start updating progress if a previous track is found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const tracks: TrackModel[] = [track1, track2];
            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getPreviousTrack(track1, false)).returns(() => track2);
            progressUpdaterMock.reset();

            // Act
            service.playPrevious();

            // Assert
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.exactly(1));
        });

        it('should indicate that playback is in progress if a previous track is found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const tracks: TrackModel[] = [track1, track2];
            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getPreviousTrack(track1, false)).returns(() => track2);
            progressUpdaterMock.reset();

            // Act
            service.playPrevious();

            // Assert
            expect(service.isPlaying).toBeTruthy();
        });

        it('should indicate that playback is stopped if a previous track is not found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const tracks: TrackModel[] = [track1];
            service.enqueueAndPlay(tracks, track1);

            queueMock.setup((x) => x.getPreviousTrack(track1, false)).returns(() => undefined);

            // Act
            service.playPrevious();

            // Assert
            expect(service.isPlaying).toBeFalsy();
        });

        it('should set the current track to the previous track that was found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const tracks: TrackModel[] = [track1, track2];
            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getPreviousTrack(track1, false)).returns(() => track2);

            // Act
            service.playPrevious();

            // Assert
            expect(service.currentTrack).toBe(track2);
        });

        it('should raise playbackStarted, containing the current track and information that a previous track is being played.', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const tracks: TrackModel[] = [track1, track2];
            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getPreviousTrack(track1, false)).returns(() => track2);

            let receivedTrack: TrackModel;
            let isPlayingPreviousTrack: boolean;

            subscription.add(
                service.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                    receivedTrack = playbackStarted.currentTrack;
                    isPlayingPreviousTrack = playbackStarted.isPlayingPreviousTrack;
                })
            );

            // Act
            service.playPrevious();

            // Assert
            expect(receivedTrack).toBe(track2);
            expect(isPlayingPreviousTrack).toBeTruthy();
        });
    });

    describe('playNext', () => {
        it('should stop playback if a next track is not found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));

            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => undefined);

            // Act
            service.playNext();

            // Assert
            audioPlayerMock.verify((x) => x.stop(), Times.exactly(1));
        });

        it('should ensure that it is possible to resume if a next track is not found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];
            service.enqueueAndPlay(tracks, track1);

            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => undefined);

            // Act
            service.playNext();

            // Assert
            expect(service.canResume).toBeTruthy();
        });

        it('should ensure that it is not possible to pause if a next track is not found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            service.toggleIsShuffled();

            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];
            service.enqueueAndPlay(tracks, track1);

            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => undefined);

            // Act
            service.playNext();

            // Assert
            expect(service.canPause).toBeFalsy();
        });

        it('should play the next track if found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];
            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => track2);

            // Act
            service.playNext();

            // Assert
            audioPlayerMock.verify((x) => x.play(track2.path), Times.exactly(1));
        });

        it('should only stop playback a single time if a next track is found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const track3: TrackModel = new TrackModel(new Track('/home/user/Music/Track3.mp3'));
            const tracks: TrackModel[] = [track1, track2, track3];
            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => track2);
            audioPlayerMock.reset();

            // Act
            service.playNext();

            // Assert
            audioPlayerMock.verify((x) => x.stop(), Times.exactly(1));
        });

        it('should get the next track without wrap around if loopMode is None', () => {
            // Arrange

            // Act
            service.playNext();

            // Assert
            queueMock.verify((x) => x.getNextTrack(It.isAny(), false), Times.exactly(1));
        });

        it('should get the next track with wrap around if loopMode is All', () => {
            // Arrange
            service.toggleLoopMode();

            // Act
            service.playNext();

            // Assert
            queueMock.verify((x) => x.getNextTrack(It.isAny(), true), Times.exactly(1));
        });

        it('should get the next track with wrap around if loopMode is One', () => {
            // Arrange
            service.toggleLoopMode();
            service.toggleLoopMode();

            // Act
            service.playNext();

            // Assert
            queueMock.verify((x) => x.getNextTrack(It.isAny(), false), Times.exactly(1));
        });

        it('should stop updating progress if a next track is not found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));

            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => undefined);

            // Act
            service.playNext();

            // Assert
            progressUpdaterMock.verify((x) => x.stopUpdatingProgress(), Times.exactly(1));
        });

        it('should start updating progress if a next track is found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const tracks: TrackModel[] = [track1, track2];
            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => track2);
            progressUpdaterMock.reset();

            // Act
            service.playNext();

            // Assert
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.exactly(1));
        });

        it('should indicate that playback is stopped if a next track is not found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const tracks: TrackModel[] = [track1];
            service.enqueueAndPlay(tracks, track1);

            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => undefined);

            // Act
            service.playNext();

            // Assert
            expect(service.isPlaying).toBeFalsy();
        });

        it('should indicate that playback is in progress if a next track is found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const tracks: TrackModel[] = [track1, track2];
            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => track2);
            progressUpdaterMock.reset();

            // Act
            service.playNext();

            // Assert
            expect(service.isPlaying).toBeTruthy();
        });

        it('should set the current track to the next track that was found', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const tracks: TrackModel[] = [track1, track2];
            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => track2);

            // Act
            service.playNext();

            // Assert
            expect(service.currentTrack).toBe(track2);
        });

        it('should raise playbackStarted, containing the current track and information that a next track is being played.', () => {
            // Arrange
            const track1: TrackModel = new TrackModel(new Track('/home/user/Music/Track1.mp3'));
            const track2: TrackModel = new TrackModel(new Track('/home/user/Music/Track2.mp3'));
            const tracks: TrackModel[] = [track1, track2];
            service.enqueueAndPlay(tracks, track1);
            queueMock.setup((x) => x.getNextTrack(track1, false)).returns(() => track2);

            let receivedTrack: TrackModel;
            let isPlayingPreviousTrack: boolean;

            subscription.add(
                service.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                    receivedTrack = playbackStarted.currentTrack;
                    isPlayingPreviousTrack = playbackStarted.isPlayingPreviousTrack;
                })
            );

            // Act
            service.playNext();

            // Assert
            expect(receivedTrack).toBe(track2);
            expect(isPlayingPreviousTrack).toBeFalsy();
        });
    });

    describe('volume', () => {
        it('should return the volume', () => {
            // Arrange

            // Act
            const volume: number = service.volume;

            // Assert
            expect(volume).toEqual(0.6);
        });

        it('should set the volume', () => {
            // Arrange

            // Act
            service.volume = 1.0;

            // Assert
            expect(service.volume).toEqual(1.0);
        });

        it('should set the audio player volume', () => {
            // Arrange

            // Act
            service.volume = 1.0;

            // Assert
            audioPlayerMock.verify((x) => x.setVolume(1.0), Times.exactly(1));
        });

        it('should save the volume in the settings', () => {
            // Arrange

            // Act
            service.volume = 1.0;

            // Assert
            expect(settingsMock.volume).toEqual(1.0);
        });
    });
});
