import { Observable, Subject, Subscription } from 'rxjs';
import { ExpectedCallType, IMock, It, Mock, Times } from 'typemoq';
import { AlbumData } from '../../common/data/entities/album-data';
import { Track } from '../../common/data/entities/track';
import { DateTime } from '../../common/date-time';
import { FileAccess } from '../../common/io/file-access';
import { Logger } from '../../common/logger';
import { MathExtensions } from '../../common/math-extensions';
import { TrackOrdering } from '../../common/ordering/track-ordering';
import { Shuffler } from '../../common/shuffler';
import { AlbumModel } from '../album/album-model';
import { ArtistModel } from '../artist/artist-model';
import { ArtistType } from '../artist/artist-type';
import { GenreModel } from '../genre/genre-model';
import { BasePlaylistService } from '../playlist/base-playlist.service';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';
import { BaseTrackService } from '../track/base-track.service';
import { TrackModel } from '../track/track-model';
import { TrackModels } from '../track/track-models';
import { BaseTranslatorService } from '../translator/base-translator.service';
import { BaseAudioPlayer } from './base-audio-player';
import { LoopMode } from './loop-mode';
import { PlaybackProgress } from './playback-progress';
import { PlaybackStarted } from './playback-started';
import { PlaybackService } from './playback.service';
import { ProgressUpdater } from './progress-updater';
import { Queue } from './queue';

describe('PlaybackService', () => {
    let trackServiceMock: IMock<BaseTrackService>;
    let playlistServiceMock: IMock<BasePlaylistService>;
    let snackBarServiceMock: IMock<BaseSnackBarService>;
    let audioPlayerMock: IMock<BaseAudioPlayer>;
    let trackOrderingMock: IMock<TrackOrdering>;
    let fileAccessMock: IMock<FileAccess>;
    let loggerMock: IMock<Logger>;
    let progressUpdaterMock: IMock<ProgressUpdater>;
    let mathExtensionsMock: IMock<MathExtensions>;
    let settingsStub: any;
    let service: PlaybackService;
    let playbackFinished: Subject<void>;
    let progressUpdaterProgressChanged: Subject<PlaybackProgress>;
    let subscription: Subscription;
    let dateTimeMock: IMock<DateTime>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let queue: Queue;

    const albumData1: AlbumData = new AlbumData();
    albumData1.albumKey = 'albumKey1';

    let album1: AlbumModel;

    let track1: Track;
    let track2: Track;
    let track3: Track;
    let track4: Track;
    let track5: Track;
    let trackModel1: TrackModel;
    let trackModel2: TrackModel;
    let trackModel3: TrackModel;
    let trackModel4: TrackModel;
    let trackModel5: TrackModel;

    let trackModels: TrackModel[];
    let orderedTrackModels: TrackModel[];

    let tracks: TrackModels;

    beforeEach(() => {
        trackServiceMock = Mock.ofType<BaseTrackService>();
        playlistServiceMock = Mock.ofType<BasePlaylistService>();
        snackBarServiceMock = Mock.ofType<BaseSnackBarService>();
        dateTimeMock = Mock.ofType<DateTime>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        audioPlayerMock = Mock.ofType<BaseAudioPlayer>();
        trackOrderingMock = Mock.ofType<TrackOrdering>();
        fileAccessMock = Mock.ofType<FileAccess>();
        loggerMock = Mock.ofType<Logger>();
        // use an unmocked queue and shuffler to make sure it is working correctly, and to check track orders
        queue = new Queue(new Shuffler(), loggerMock.object);
        progressUpdaterMock = Mock.ofType<ProgressUpdater>();
        mathExtensionsMock = Mock.ofType<MathExtensions>();
        settingsStub = { volume: 0.6 };
        playbackFinished = new Subject();
        progressUpdaterProgressChanged = new Subject();
        const playbackFinished$: Observable<void> = playbackFinished.asObservable();
        const progressUpdaterProgressChanged$: Observable<PlaybackProgress> = progressUpdaterProgressChanged.asObservable();

        audioPlayerMock.setup((x) => x.playbackFinished$).returns(() => playbackFinished$);
        progressUpdaterMock.setup((x) => x.progressChanged$).returns(() => progressUpdaterProgressChanged$);

        subscription = new Subscription();

        album1 = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);

        track1 = new Track('Path 1');
        track1.trackTitle = 'Title 1';
        track1.albumArtists = ';Album artist 1;';
        track1.albumTitle = 'Album title 1';
        track1.trackNumber = 1;
        track1.discNumber = 1;

        track2 = new Track('Path 2');
        track2.trackTitle = 'Title 2';
        track2.albumArtists = ';Album artist 1;';
        track2.albumTitle = 'Album title 1';
        track2.trackNumber = 1;
        track2.discNumber = 2;

        track3 = new Track('Path 3');
        track3.trackTitle = 'Title 3';
        track3.albumArtists = ';Album artist 2;';
        track3.albumTitle = 'Album title 2';
        track3.trackNumber = 1;
        track3.discNumber = 1;

        track4 = new Track('Path 4');
        track4.trackTitle = 'Title 4';
        track4.albumArtists = ';Album artist 2;';
        track4.albumTitle = 'Album title 2';
        track4.trackNumber = 2;
        track4.discNumber = 1;

        track5 = new Track('Path 5');
        track5.trackTitle = 'Title 5';
        track5.albumArtists = ';Album artist 3;';
        track5.albumTitle = 'Album title 3';
        track5.trackNumber = 3;
        track5.discNumber = 1;

        trackModel1 = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object);
        trackModel2 = new TrackModel(track2, dateTimeMock.object, translatorServiceMock.object);
        trackModel3 = new TrackModel(track3, dateTimeMock.object, translatorServiceMock.object);
        trackModel4 = new TrackModel(track4, dateTimeMock.object, translatorServiceMock.object);
        trackModel5 = new TrackModel(track5, dateTimeMock.object, translatorServiceMock.object);

        trackModels = [trackModel1, trackModel2, trackModel3, trackModel4];
        orderedTrackModels = [trackModel2, trackModel1, trackModel3, trackModel4];

        tracks = new TrackModels();
        tracks.addTrack(trackModel1);
        tracks.addTrack(trackModel2);
        tracks.addTrack(trackModel3);
        tracks.addTrack(trackModel4);

        trackServiceMock.setup((x) => x.getTracksForAlbums([album1.albumKey])).returns(() => tracks);
        trackServiceMock.setup((x) => x.getTracksForArtists(It.isAny(), It.isAny())).returns(() => tracks);
        trackServiceMock.setup((x) => x.getTracksForGenres(It.isAny())).returns(() => tracks);
        trackOrderingMock.setup((x) => x.getTracksOrderedByAlbum(tracks.tracks)).returns(() => orderedTrackModels);

        service = new PlaybackService(
            trackServiceMock.object,
            playlistServiceMock.object,
            snackBarServiceMock.object,
            audioPlayerMock.object,
            trackOrderingMock.object,
            queue,
            progressUpdaterMock.object,
            mathExtensionsMock.object,
            settingsStub,
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

        it('should declare currentTrack', () => {
            // Arrange

            // Act

            // Assert
            expect(service.currentTrack).toBeUndefined();
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

        it('should define playbackPaused$', () => {
            // Arrange

            // Act

            // Assert
            expect(service.playbackPaused$).toBeDefined();
        });

        it('should define playbackResumed$', () => {
            // Arrange

            // Act

            // Assert
            expect(service.playbackResumed$).toBeDefined();
        });

        it('should define playbackStopped$', () => {
            // Arrange

            // Act

            // Assert
            expect(service.playbackStopped$).toBeDefined();
        });

        it('should define playbackSkipped$', () => {
            // Arrange

            // Act

            // Assert
            expect(service.playbackSkipped$).toBeDefined();
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

        it('should apply volume from the settings', () => {
            // Arrange

            // Act

            // Assert
            expect(service.volume).toEqual(0.6);
            audioPlayerMock.verify((x) => x.setVolume(0.6), Times.exactly(1));
        });

        it('should stop playback on playback finished if a next track is not found', () => {
            // Arrange

            // Act
            playbackFinished.next();

            // Assert
            audioPlayerMock.verify((x) => x.stop(), Times.exactly(1));
            expect(service.isPlaying).toBeFalsy();
            expect(service.canResume).toBeTruthy();
            expect(service.canPause).toBeFalsy();
            expect(service.progress.progressSeconds).toEqual(0);
            expect(service.progress.totalSeconds).toEqual(0);
            expect(service.currentTrack).toBeUndefined();
            progressUpdaterMock.verify((x) => x.stopUpdatingProgress(), Times.exactly(1));
        });

        it('should raise an event that playback is stopped on playback finished if a next track is not found', () => {
            // Arrange
            service.enqueueAndPlayTracks([trackModel1]);
            let playbackIsStopped: boolean = false;

            subscription.add(
                service.playbackStopped$.subscribe(() => {
                    playbackIsStopped = true;
                })
            );

            // Act
            playbackFinished.next();

            // Assert
            expect(playbackIsStopped).toBeTruthy();
        });

        it('should set the current track to undefined before raising a playback finished event', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);
            let currentTrack: TrackModel;

            subscription.add(
                service.playbackStopped$.subscribe(() => {
                    currentTrack = service.currentTrack;
                })
            );

            // Act
            playbackFinished.next();

            // Assert
            expect(currentTrack).toBeUndefined();
        });

        it('should play the next track on playback finished if a next track is found', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);
            audioPlayerMock.reset();
            progressUpdaterMock.reset();

            // Act
            playbackFinished.next();

            // Assert
            audioPlayerMock.verify((x) => x.stop(), Times.exactly(1));
            expect(service.isPlaying).toBeTruthy();
            expect(service.canResume).toBeFalsy();
            expect(service.canPause).toBeTruthy();
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.exactly(1));
            expect(service.currentTrack).toBe(trackModel2);
        });

        it('should play the same track on playback finished if loopMode is One', () => {
            // Arrange
            while (service.loopMode !== LoopMode.One) {
                service.toggleLoopMode();
            }

            service.enqueueAndPlayTracks(trackModels);
            audioPlayerMock.reset();

            // Act
            playbackFinished.next();

            // Assert
            audioPlayerMock.verify((x) => x.play(trackModel1.path), Times.exactly(1));
        });

        it('should not play the next track on playback finished if found and if loopMode is One', () => {
            // Arrange
            while (service.loopMode !== LoopMode.One) {
                service.toggleLoopMode();
            }

            service.enqueueAndPlayTracks(trackModels);
            audioPlayerMock.reset();

            // Act
            playbackFinished.next();

            // Assert
            audioPlayerMock.verify((x) => x.play(trackModel2.path), Times.never());
        });

        it('should play the next track on playback finished if found and if loopMode is All', () => {
            // Arrange
            while (service.loopMode !== LoopMode.All) {
                service.toggleLoopMode();
            }

            service.enqueueAndPlayTracks(trackModels);
            audioPlayerMock.reset();

            // Act
            playbackFinished.next();

            // Assert
            audioPlayerMock.verify((x) => x.play(trackModel2.path), Times.exactly(1));
        });

        it('should play the next track on playback finished if found and if loopMode is None', () => {
            // Arrange
            while (service.loopMode !== LoopMode.None) {
                service.toggleLoopMode();
            }

            service.enqueueAndPlayTracks(trackModels);
            audioPlayerMock.reset();

            // Act
            playbackFinished.next();

            // Assert
            audioPlayerMock.verify((x) => x.play(trackModel2.path), Times.exactly(1));
        });

        it('should get the next track without wrap around on playback finished if loopMode is None', () => {
            // Arrange
            const getNextTrackSpy = jest.spyOn(queue, 'getNextTrack');
            service.enqueueAndPlayTracks([trackModel1, trackModel2]);

            // Act
            playbackFinished.next();

            // Assert
            expect(getNextTrackSpy).toHaveBeenCalledTimes(1);
            expect(getNextTrackSpy).toHaveBeenCalledWith(trackModel1, false);
            expect(service.currentTrack).toBe(trackModel2);
        });

        it('should get the next track with wrap around on playback finished if loopMode is All', () => {
            // Arrange
            const getNextTrackSpy = jest.spyOn(queue, 'getNextTrack');
            while (service.loopMode !== LoopMode.All) {
                service.toggleLoopMode();
            }
            // set a queue of 2 tracks and start playing from second track
            service.enqueueAndPlayTracksFromDoubleClick([trackModel1, trackModel2], trackModel2);

            // Act
            playbackFinished.next();

            // Assert
            // should loop back to the first track
            expect(getNextTrackSpy).toHaveBeenCalledTimes(1);
            expect(getNextTrackSpy).toHaveBeenCalledWith(trackModel2, true);
            expect(service.currentTrack).toBe(trackModel1);
        });

        it('should increase play count and date last played for the current track on playback finished', () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            service.enqueueAndPlayTracks([trackModelMock.object]);

            // Act
            playbackFinished.next();

            // Assert
            trackModelMock.verify((x) => x.increasePlayCountAndDateLastPlayed(), Times.once());
        });

        it('should save play count and date last played for the current track on playback finished', () => {
            // Arrange
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            service.enqueueAndPlayTracks([trackModelMock.object]);

            // Act
            playbackFinished.next();

            // Assert
            trackServiceMock.verify((x) => x.savePlayCountAndDateLastPlayed(trackModelMock.object), Times.once());
        });

        it('should raise an event, on playback finished, that playback has started, containing the current track and if a next track is being played.', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);

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
            expect(receivedTrack).toBe(trackModel2);
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
            service.enqueueAndPlayTracks(trackModels);
            const shuffleSpy = jest.spyOn(queue, 'shuffle');

            // Act
            service.toggleIsShuffled();

            // Assert
            expect(shuffleSpy).toHaveBeenCalledTimes(1);
            let playbackQueueString: string = '';
            let trackModelString: string = '';
            for (const track of service.playbackQueue.tracks) {
                playbackQueueString = playbackQueueString + track.sortableTitle;
            }
            for (const track of trackModels) {
                trackModelString = trackModelString + track.sortableTitle;
            }
            expect(playbackQueueString).not.toBe(trackModelString);
        });

        it('should not unshuffle the queue when shuffle is disabled', () => {
            // Arrange
            while (service.isShuffled !== false) {
                service.toggleIsShuffled();
            }
            service.enqueueAndPlayTracks(trackModels);
            const unShuffleSpy = jest.spyOn(queue, 'unShuffle');

            // Act
            service.toggleIsShuffled();

            // Assert
            expect(unShuffleSpy).not.toHaveBeenCalled();
            let playbackQueueString: string = '';
            let trackModelString: string = '';
            for (const track of service.playbackQueue.tracks) {
                playbackQueueString = playbackQueueString + track.sortableTitle;
            }
            for (const track of trackModels) {
                trackModelString = trackModelString + track.sortableTitle;
            }
            expect(playbackQueueString).not.toBe(trackModelString);
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
            const shuffleSpy = jest.spyOn(queue, 'shuffle');
            while (service.isShuffled !== true) {
                service.toggleIsShuffled();
            }

            // Act
            service.toggleIsShuffled();

            // Assert
            expect(shuffleSpy).toHaveBeenCalledTimes(1);
        });

        it('should unshuffle the queue when shuffle is enabled', () => {
            // Arrange
            const unShuffleSpy = jest.spyOn(queue, 'unShuffle');
            while (service.isShuffled !== true) {
                service.toggleIsShuffled();
            }
            service.enqueueAndPlayTracks(trackModels);

            // Act
            service.toggleIsShuffled();

            // Assert
            expect(unShuffleSpy).toHaveBeenCalledTimes(1);
            let playbackQueueString: string = '';
            let trackModelString: string = '';
            for (const track of service.playbackQueue.tracks) {
                playbackQueueString = playbackQueueString + track.sortableTitle;
            }
            for (const track of trackModels) {
                trackModelString = trackModelString + track.sortableTitle;
            }
            expect(playbackQueueString).toBe(trackModelString);
        });
    });

    describe('enqueueAndPlayTracks', () => {
        it('should not add tracks to the queue if tracks is undefined', () => {
            // Arrange
            const setTracksSpy = jest.spyOn(queue, 'setTracks');

            // Act
            service.enqueueAndPlayTracks(undefined);

            // Assert
            expect(setTracksSpy).not.toHaveBeenCalled();
            expect(service.playbackQueue.tracks.length).toBe(0);
        });

        it('should not add tracks to the queue if tracks is empty', () => {
            // Arrange
            const setTracksSpy = jest.spyOn(queue, 'setTracks');

            // Act
            service.enqueueAndPlayTracks(undefined);

            // Assert
            expect(setTracksSpy).not.toHaveBeenCalled();
            expect(service.playbackQueue.tracks.length).toBe(0);
        });

        it('should not start playback if tracks is undefined', () => {
            // Arrange

            // Act
            service.enqueueAndPlayTracks(undefined);

            // Assert
            audioPlayerMock.verify((x) => x.play(It.isAny()), Times.never());
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.never());
            expect(service.isPlaying).toEqual(false);
            expect(service.canPause).toEqual(false);
            expect(service.canResume).toEqual(true);
        });

        it('should not start playback if tracks is empty', () => {
            // Arrange

            // Act
            service.enqueueAndPlayTracks(undefined);

            // Assert
            audioPlayerMock.verify((x) => x.play(It.isAny()), Times.never());
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.never());
            expect(service.isPlaying).toEqual(false);
            expect(service.canPause).toEqual(false);
            expect(service.canResume).toEqual(true);
        });

        it('should add tracks to the queue unshuffled if shuffle is disabled', () => {
            // Arrange
            const setTracksSpy = jest.spyOn(queue, 'setTracks');

            // Act
            service.enqueueAndPlayTracks(trackModels);

            // Assert
            expect(setTracksSpy).toHaveBeenCalledTimes(1);
            expect(setTracksSpy).toHaveBeenCalledWith(trackModels, false);
            let playbackQueueString: string = '';
            let trackModelString: string = '';
            for (const track of service.playbackQueue.tracks) {
                playbackQueueString = playbackQueueString + track.sortableTitle;
            }
            for (const track of trackModels) {
                trackModelString = trackModelString + track.sortableTitle;
            }
            expect(playbackQueueString).toBe(trackModelString);
        });

        it('should add tracks to the queue shuffled if shuffle is enabled', () => {
            // Arrange
            const setTracksSpy = jest.spyOn(queue, 'setTracks');
            service.toggleIsShuffled();

            // Act
            service.enqueueAndPlayTracks(trackModels);

            // Assert
            expect(setTracksSpy).toHaveBeenCalledTimes(1);
            expect(setTracksSpy).toHaveBeenCalledWith(trackModels, true);
            let playbackQueueString: string = '';
            let trackModelString: string = '';
            for (const track of service.playbackQueue.tracks) {
                playbackQueueString = playbackQueueString + track.sortableTitle;
            }
            for (const track of trackModels) {
                trackModelString = trackModelString + track.sortableTitle;
            }
            expect(playbackQueueString).not.toBe(trackModelString);
        });

        it('should start playback', () => {
            // Arrange
            audioPlayerMock.reset();
            audioPlayerMock.setup((x) => x.stop()).verifiable(Times.once(), ExpectedCallType.InSequence);
            audioPlayerMock.setup((x) => x.play(trackModel1.path)).verifiable(Times.once(), ExpectedCallType.InSequence);

            // Act
            service.enqueueAndPlayTracks(trackModels);

            // Assert
            audioPlayerMock.verifyAll();
            expect(service.currentTrack).toBe(trackModel1);
            expect(service.canPause).toBeTruthy();
            expect(service.canResume).toBeFalsy();
            expect(service.isPlaying).toBeTruthy();
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.exactly(1));
        });

        it('should raise an event that playback has started, containing the current track and if a next track is being played.', () => {
            // Arrange
            let receivedTrack: TrackModel;
            let isPlayingPreviousTrack: boolean;
            subscription.add(
                service.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                    receivedTrack = playbackStarted.currentTrack;
                    isPlayingPreviousTrack = playbackStarted.isPlayingPreviousTrack;
                })
            );

            // Act
            service.enqueueAndPlayTracks(trackModels);

            // Assert
            expect(receivedTrack).toBe(trackModel1);
            expect(isPlayingPreviousTrack).toBeFalsy();
        });
    });

    describe('enqueueAndPlayArtist', () => {
        it('should not get tracks for the artist if artistToPlay is undefined', () => {
            // Arrange

            // Act
            service.enqueueAndPlayArtist(undefined, It.isAny());

            // Assert
            trackServiceMock.verify((x) => x.getTracksForArtists(It.isAny(), It.isAny()), Times.never());
        });

        it('should not get tracks for the artist if artistType is undefined', () => {
            // Arrange
            const artistToPlay: ArtistModel = new ArtistModel('artist1', translatorServiceMock.object);

            // Act
            service.enqueueAndPlayArtist(artistToPlay, undefined);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForArtists(It.isAny(), It.isAny()), Times.never());
        });

        it('should get tracks for the artist if artistToPlay and artistType are not undefined', () => {
            // Arrange
            const artistToPlay: ArtistModel = new ArtistModel('artist1', translatorServiceMock.object);

            // Act
            service.enqueueAndPlayArtist(artistToPlay, ArtistType.trackArtists);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForArtists([artistToPlay.displayName], ArtistType.trackArtists), Times.exactly(1));
        });

        it('should order tracks for the artist byAlbum', () => {
            // Arrange
            const artistToPlay: ArtistModel = new ArtistModel('artist1', translatorServiceMock.object);

            // Act
            service.enqueueAndPlayArtist(artistToPlay, ArtistType.trackArtists);

            // Assert
            trackOrderingMock.verify((x) => x.getTracksOrderedByAlbum(tracks.tracks), Times.exactly(1));
        });

        it('should add tracks to the queue ordered by album', () => {
            // Arrange
            const setTracksSpy = jest.spyOn(queue, 'setTracks');
            const artistToPlay: ArtistModel = new ArtistModel('artist1', translatorServiceMock.object);

            // Act
            service.enqueueAndPlayArtist(artistToPlay, ArtistType.trackArtists);

            // Assert
            expect(setTracksSpy).toHaveBeenCalledTimes(1);
            expect(setTracksSpy).toHaveBeenCalledWith(orderedTrackModels, false);
            service.playbackQueue.tracks.forEach((track, index) => {
                expect(track).toBe(orderedTrackModels[index]);
            });
        });

        it('should start playback with a random track if shuffle is on', () => {
            // Arrange
            while (service.isShuffled !== true) {
                service.toggleIsShuffled();
            }
            const artistToPlay: ArtistModel = new ArtistModel('artist1', translatorServiceMock.object);

            // Act
            service.enqueueAndPlayArtist(artistToPlay, ArtistType.trackArtists);

            // randomness means the test could fail (service could "randomly" assign first track to first position)
            // so we run it a few times
            for (var i = 0; i < 10; i++) {
                if (service.playbackQueue[0] === tracks.tracks[0]) {
                    service.enqueueAndPlayArtist(artistToPlay, ArtistType.trackArtists);
                } else {
                    break;
                }
            }

            // Assert
            expect(service.playbackQueue[0]).not.toBe(tracks.tracks[0]);
        });

        it('should start playback', () => {
            // Arrange
            const artistToPlay: ArtistModel = new ArtistModel('artist1', translatorServiceMock.object);
            audioPlayerMock.reset();
            audioPlayerMock.setup((x) => x.stop()).verifiable(Times.once(), ExpectedCallType.InSequence);
            audioPlayerMock.setup((x) => x.play(trackModel2.path)).verifiable(Times.once(), ExpectedCallType.InSequence);

            // Act
            service.enqueueAndPlayArtist(artistToPlay, ArtistType.trackArtists);

            // Assert
            audioPlayerMock.verifyAll();
            expect(service.currentTrack).toBe(trackModel2);
            expect(service.canPause).toBeTruthy();
            expect(service.canResume).toBeFalsy();
            expect(service.isPlaying).toBeTruthy();
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.exactly(1));
        });

        it('should raise an event that playback has started, containing the current track and if a next track is being played.', () => {
            // Arrange
            const artistToPlay: ArtistModel = new ArtistModel('artist1', translatorServiceMock.object);
            let receivedTrack: TrackModel;
            let isPlayingPreviousTrack: boolean;
            subscription.add(
                service.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                    receivedTrack = playbackStarted.currentTrack;
                    isPlayingPreviousTrack = playbackStarted.isPlayingPreviousTrack;
                })
            );

            // Act
            service.enqueueAndPlayArtist(artistToPlay, ArtistType.trackArtists);

            // Assert
            expect(receivedTrack).toBe(trackModel2);
            expect(isPlayingPreviousTrack).toBeFalsy();
        });
    });

    describe('enqueueAndPlayGenre', () => {
        it('should not get tracks for the genre if genreToPlay is undefined', () => {
            // Arrange

            // Act
            service.enqueueAndPlayGenre(undefined);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForArtists(It.isAny(), It.isAny()), Times.never());
        });

        it('should get tracks for the genre if genreToPlay is not undefined', () => {
            // Arrange
            const genreToPlay: GenreModel = new GenreModel('genre1', translatorServiceMock.object);

            // Act
            service.enqueueAndPlayGenre(genreToPlay);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForGenres([genreToPlay.displayName]), Times.exactly(1));
        });

        it('should order tracks for the artist byAlbum', () => {
            // Arrange
            const genreToPlay: GenreModel = new GenreModel('genre1', translatorServiceMock.object);

            // Act
            service.enqueueAndPlayGenre(genreToPlay);

            // Assert
            trackOrderingMock.verify((x) => x.getTracksOrderedByAlbum(tracks.tracks), Times.exactly(1));
        });

        it('should add tracks to the queue ordered by album', () => {
            // Arrange
            const setTracksSpy = jest.spyOn(queue, 'setTracks');
            const genreToPlay: GenreModel = new GenreModel('genre1', translatorServiceMock.object);

            // Act
            service.enqueueAndPlayGenre(genreToPlay);

            // Assert
            expect(setTracksSpy).toHaveBeenCalledTimes(1);
            expect(setTracksSpy).toHaveBeenCalledWith(orderedTrackModels, false);
            service.playbackQueue.tracks.forEach((track, index) => {
                expect(track).toBe(orderedTrackModels[index]);
            });
        });

        it('should start playback', () => {
            // Arrange
            const genreToPlay: GenreModel = new GenreModel('genre1', translatorServiceMock.object);

            audioPlayerMock.reset();
            audioPlayerMock.setup((x) => x.stop()).verifiable(Times.once(), ExpectedCallType.InSequence);
            audioPlayerMock.setup((x) => x.play(trackModel2.path)).verifiable(Times.once(), ExpectedCallType.InSequence);

            // Act
            service.enqueueAndPlayGenre(genreToPlay);

            // Assert
            audioPlayerMock.verifyAll();
            expect(service.currentTrack).toBe(trackModel2);
            expect(service.canPause).toBeTruthy();
            expect(service.canResume).toBeFalsy();
            expect(service.isPlaying).toBeTruthy();
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.exactly(1));
        });

        it('should start playback with a random track if shuffle is on', () => {
            // Arrange
            while (service.isShuffled !== true) {
                service.toggleIsShuffled();
            }
            const genreToPlay: GenreModel = new GenreModel('genre1', translatorServiceMock.object);

            // Act
            service.enqueueAndPlayGenre(genreToPlay);

            // randomness means the test could fail (service could "randomly" assign first track to first position)
            // so we run it a few times
            for (var i = 0; i < 10; i++) {
                if (service.playbackQueue[0] === tracks.tracks[0]) {
                    service.enqueueAndPlayGenre(genreToPlay);
                } else {
                    break;
                }
            }

            // Assert
            expect(service.playbackQueue[0]).not.toBe(tracks.tracks[0]);
        });

        it('should raise an event that playback has started, containing the current track and if a next track is being played.', () => {
            // Arrange
            const genreToPlay: GenreModel = new GenreModel('genre1', translatorServiceMock.object);
            audioPlayerMock.reset();
            const artistToPlay: ArtistModel = new ArtistModel('artist1', translatorServiceMock.object);
            let receivedTrack: TrackModel;
            let isPlayingPreviousTrack: boolean;
            subscription.add(
                service.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                    receivedTrack = playbackStarted.currentTrack;
                    isPlayingPreviousTrack = playbackStarted.isPlayingPreviousTrack;
                })
            );

            service.enqueueAndPlayGenre(genreToPlay);

            // Assert
            expect(receivedTrack).toBe(trackModel2);
            expect(isPlayingPreviousTrack).toBeFalsy();
        });
    });

    describe('enqueueAndPlayAlbum', () => {
        it('should not get tracks for the album if albumToPlay is undefined', () => {
            // Arrange

            // Act
            service.enqueueAndPlayAlbum(undefined);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForAlbums(It.isAny()), Times.never());
        });

        it('should get tracks for the album if albumToPlay is not undefined', () => {
            // Arrange

            // Act
            service.enqueueAndPlayAlbum(album1);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForAlbums([album1.albumKey]), Times.exactly(1));
        });

        it('should order tracks for the album byAlbum', () => {
            // Arrange

            // Act
            service.enqueueAndPlayAlbum(album1);

            // Assert
            trackOrderingMock.verify((x) => x.getTracksOrderedByAlbum(tracks.tracks), Times.exactly(1));
        });

        it('should add tracks to the queue ordered by album', () => {
            // Arrange
            const setTracksSpy = jest.spyOn(queue, 'setTracks');

            // Act
            service.enqueueAndPlayAlbum(album1);

            // Assert
            expect(setTracksSpy).toHaveBeenCalledTimes(1);
            expect(setTracksSpy).toHaveBeenCalledWith(orderedTrackModels, false);
            service.playbackQueue.tracks.forEach((track, index) => {
                expect(track).toBe(orderedTrackModels[index]);
            });
        });

        it('should start playback', () => {
            // Arrange
            audioPlayerMock.reset();
            audioPlayerMock.setup((x) => x.stop()).verifiable(Times.once(), ExpectedCallType.InSequence);
            audioPlayerMock.setup((x) => x.play(trackModel2.path)).verifiable(Times.once(), ExpectedCallType.InSequence);

            // Act
            service.enqueueAndPlayAlbum(album1);

            // Assert
            audioPlayerMock.verifyAll();
            expect(service.currentTrack).toBe(trackModel2);
            expect(service.canPause).toBeTruthy();
            expect(service.canResume).toBeFalsy();
            expect(service.isPlaying).toBeTruthy();
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.exactly(1));
        });

        it('should start playback with a random track if shuffle is on', () => {
            // Arrange
            while (service.isShuffled !== true) {
                service.toggleIsShuffled();
            }

            // Act
            service.enqueueAndPlayAlbum(album1);

            // randomness means the test could fail (service could "randomly" assign first track to first position)
            // so we run it a few times
            for (var i = 0; i < 10; i++) {
                if (service.playbackQueue[0] === tracks.tracks[0]) {
                    service.enqueueAndPlayAlbum(album1);
                } else {
                    break;
                }
            }

            // Assert
            expect(service.playbackQueue[0]).not.toBe(tracks.tracks[0]);
        });

        it('should raise an event that playback has started, containing the current track and if a next track is being played.', () => {
            // Arrange
            let receivedTrack: TrackModel;
            let isPlayingPreviousTrack: boolean;
            subscription.add(
                service.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                    receivedTrack = playbackStarted.currentTrack;
                    isPlayingPreviousTrack = playbackStarted.isPlayingPreviousTrack;
                })
            );

            // Act
            service.enqueueAndPlayAlbum(album1);

            // Assert
            expect(receivedTrack).toBe(trackModel2);
            expect(isPlayingPreviousTrack).toBeFalsy();
        });
    });

    describe('enqueueAndPlayPlaylistAsync', () => {
        test.todo('should write tests');
    });

    describe('pause', () => {
        it('should pause playback', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);

            // Act
            service.pause();

            // Assert
            audioPlayerMock.verify((x) => x.pause(), Times.exactly(1));
            expect(service.isPlaying).toBeTruthy();
            expect(service.canPause).toBeFalsy();
            expect(service.canResume).toBeTruthy();
            progressUpdaterMock.verify((x) => x.pauseUpdatingProgress(), Times.exactly(1));
        });

        it('should raise an event that playback is paused.', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);
            let playbackIsPaused: boolean = false;

            subscription.add(
                service.playbackPaused$.subscribe(() => {
                    playbackIsPaused = true;
                })
            );

            // Act
            service.pause();

            // Assert
            expect(playbackIsPaused).toBeTruthy();
        });
    });

    describe('resume', () => {
        it('should resume playback if playing', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);
            audioPlayerMock.reset();
            progressUpdaterMock.reset();

            // Act
            service.resume();

            // Assert
            audioPlayerMock.verify((x) => x.resume(), Times.exactly(1));
            expect(service.isPlaying).toBeTruthy();
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
            expect(service.isPlaying).toBeFalsy();
            expect(service.canPause).toBeFalsy();
            expect(service.canResume).toBeTruthy();
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.never());
        });

        it('should raise an event that playback is resumed if playing', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);
            audioPlayerMock.reset();
            progressUpdaterMock.reset();
            let playbackIsResumed: boolean = false;

            subscription.add(
                service.playbackResumed$.subscribe(() => {
                    playbackIsResumed = true;
                })
            );

            // Act
            service.resume();

            // Assert
            expect(playbackIsResumed).toBeTruthy();
        });

        it('should raise an event that playback is resumed if not playing', () => {
            // Arrange
            let playbackIsResumed: boolean = false;

            subscription.add(
                service.playbackResumed$.subscribe(() => {
                    playbackIsResumed = true;
                })
            );

            // Act
            service.resume();

            // Assert
            expect(playbackIsResumed).toBeFalsy();
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

        it('should immediately set progress', () => {
            // Arrange
            audioPlayerMock.setup((x) => x.totalSeconds).returns(() => 60);
            const progress: PlaybackProgress = new PlaybackProgress(20, 200);
            progressUpdaterMock.setup((x) => x.getCurrentProgress()).returns(() => progress);

            // Act
            service.skipByFractionOfTotalSeconds(0.5);

            // Assert
            progressUpdaterMock.verify((x) => x.getCurrentProgress(), Times.exactly(1));
            expect(service.progress).toBe(progress);
        });

        it('should raise an event that playback was skipped', () => {
            // Arrange
            audioPlayerMock.setup((x) => x.totalSeconds).returns(() => 60);
            progressUpdaterMock.setup((x) => x.getCurrentProgress()).returns(() => new PlaybackProgress(20, 200));

            let receivedPlaybackSkipped: boolean = false;
            subscription.add(
                service.playbackSkipped$.subscribe(() => {
                    receivedPlaybackSkipped = true;
                })
            );

            // Act
            service.skipByFractionOfTotalSeconds(0.5);

            // Assert
            expect(receivedPlaybackSkipped).toBeTruthy();
        });
    });

    describe('playPrevious', () => {
        it('should play the current track if there is a current track and playback lasted for more than 3 seconds', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);
            audioPlayerMock.reset();
            audioPlayerMock.setup((x) => x.progressSeconds).returns(() => 3.1);
            progressUpdaterMock.reset();

            // Act
            service.playPrevious();

            // Assert
            audioPlayerMock.verify((x) => x.play(track1.path), Times.exactly(1));
            expect(service.isPlaying).toBeTruthy();
            expect(service.canPause).toBeTruthy();
            expect(service.canResume).toBeFalsy();
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.exactly(1));
        });

        it('should play the previous track if found and playback lasted for less then 3 seconds', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);
            // set up a "previous" track by playing next track, otherwise "play previous" will be undefined
            service.playNext();

            // reset audio player and progress updater to make sure playback is less than 3s
            audioPlayerMock.reset();
            audioPlayerMock.setup((x) => x.progressSeconds).returns(() => 2.9);
            progressUpdaterMock.reset();

            // Act
            service.playPrevious();

            // Assert
            audioPlayerMock.verify((x) => x.play(trackModel1.path), Times.exactly(1));
            expect(service.isPlaying).toBeTruthy();
            expect(service.canPause).toBeTruthy();
            expect(service.canResume).toBeFalsy();
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.exactly(1));
            expect(service.currentTrack).toBe(trackModel1);
        });

        it('should restart the current track if playback lasted for more than 3 seconds', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);

            // reset audio player and progress updater to make sure playback is more than
            audioPlayerMock.reset();
            audioPlayerMock.setup((x) => x.progressSeconds).returns(() => 3.1);
            progressUpdaterMock.reset();

            // Act
            service.playPrevious();

            // Assert
            audioPlayerMock.verify((x) => x.play(trackModel1.path), Times.exactly(1));
            expect(service.isPlaying).toBeTruthy();
            expect(service.canPause).toBeTruthy();
            expect(service.canResume).toBeFalsy();
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.exactly(1));
            expect(service.currentTrack).toBe(trackModel1);
        });

        it('should stop playback if a previous track was not found and playback lasted for less then 3 seconds', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);
            audioPlayerMock.reset();
            audioPlayerMock.setup((x) => x.progressSeconds).returns(() => 2.9);

            // Act
            service.playPrevious();

            // Assert
            audioPlayerMock.verify((x) => x.stop(), Times.exactly(1));
            expect(service.isPlaying).toBeFalsy();
            expect(service.canPause).toBeFalsy();
            expect(service.canResume).toBeTruthy();
            progressUpdaterMock.verify((x) => x.stopUpdatingProgress(), Times.exactly(1));
            expect(service.currentTrack).toBeUndefined();
        });

        it('should raise an event that playback is stopped if a previous track was not found and playback lasted for less then 3 seconds.', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);
            audioPlayerMock.reset();
            audioPlayerMock.setup((x) => x.progressSeconds).returns(() => 2.9);
            let playbackIsStopped: boolean = false;

            subscription.add(
                service.playbackStopped$.subscribe(() => {
                    playbackIsStopped = true;
                })
            );

            // Act
            service.playPrevious();

            // Assert
            expect(playbackIsStopped).toBeTruthy();
        });

        it('should set the current track to undefined before raising a stop event', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);
            let currentTrack: TrackModel;

            subscription.add(
                service.playbackStopped$.subscribe(() => {
                    currentTrack = service.currentTrack;
                })
            );

            // Act
            service.playPrevious();

            // Assert
            expect(currentTrack).toBeUndefined();
        });

        it('should get the previous track without wrap around if loopMode is None', () => {
            // Arrange
            const getPreviousTrackSpy = jest.spyOn(queue, 'getPreviousTrack');
            while (service.loopMode !== LoopMode.None) {
                service.toggleLoopMode();
            }
            service.enqueueAndPlayTracks([trackModel1, trackModel2]);

            // Act
            service.playPrevious();

            // Assert
            expect(getPreviousTrackSpy).toHaveBeenCalledTimes(1);
            expect(getPreviousTrackSpy).toHaveBeenCalledWith(trackModel1, false);
            expect(service.currentTrack).toBe(undefined);
        });

        it('should get the previous track with wrap around if loopMode is All', () => {
            // Arrange
            const getPreviousTrackSpy = jest.spyOn(queue, 'getPreviousTrack');
            while (service.loopMode !== LoopMode.All) {
                service.toggleLoopMode();
            }
            service.enqueueAndPlayTracks([trackModel1, trackModel2]);

            // Act
            service.playPrevious();

            // Assert
            expect(getPreviousTrackSpy).toHaveBeenCalledTimes(1);
            expect(getPreviousTrackSpy).toHaveBeenCalledWith(trackModel1, true);
            expect(service.currentTrack).toBe(trackModel2);
        });

        it('should get the previous track with wrap around if loopMode is One', () => {
            // Arrange
            const getPreviousTrackSpy = jest.spyOn(queue, 'getPreviousTrack');
            while (service.loopMode !== LoopMode.One) {
                service.toggleLoopMode();
            }
            service.enqueueAndPlayTracks([trackModel1, trackModel2]);
            // playPrevious doesn't work on first track, need to have a previous that has been played, so:
            service.playNext(); // play next, should still be track 1
            // do it twice to make sure
            service.playNext(); // play next, should still be track 1

            // Act
            service.playPrevious();

            // Assert
            expect(getPreviousTrackSpy).toHaveBeenCalledTimes(1);
            expect(getPreviousTrackSpy).toHaveBeenCalledWith(undefined, false);
            expect(service.currentTrack).toBe(trackModel1);
        });

        it('should raise an event that playback has started, containing the current track and if a previous track is being played.', () => {
            // Arrange
            service.enqueueAndPlayTracks([trackModel1, trackModel2]);
            // set up a "previous" track by playing next track, otherwise "play previous" will be undefined
            service.playNext();
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
            expect(receivedTrack).toBe(trackModel1);
            expect(isPlayingPreviousTrack).toBeTruthy();
        });
    });

    describe('playNext', () => {
        it('should stop playback if a next track is not found', () => {
            // Arrange
            progressUpdaterMock.reset();
            audioPlayerMock.reset();

            // Act
            service.playNext();

            // Assert
            audioPlayerMock.verify((x) => x.stop(), Times.exactly(1));
            audioPlayerMock.verify((x) => x.play(It.isAny()), Times.never());
            expect(service.isPlaying).toBeFalsy();
            expect(service.canPause).toBeFalsy();
            expect(service.canResume).toBeTruthy();
            expect(service.progress.progressSeconds).toEqual(0);
            expect(service.progress.totalSeconds).toEqual(0);
            expect(service.currentTrack).toBeUndefined();
            progressUpdaterMock.verify((x) => x.stopUpdatingProgress(), Times.exactly(1));
        });

        it('should raise an event that playback is stopped if a next track is not found', () => {
            // Arrange
            service.enqueueAndPlayTracks([trackModel1]);
            let playbackIsStopped: boolean = false;

            subscription.add(
                service.playbackStopped$.subscribe(() => {
                    playbackIsStopped = true;
                })
            );

            // Act
            service.playNext();

            // Assert
            expect(playbackIsStopped).toBeTruthy();
        });

        it('should set the current track to undefined before raising a stop event', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);
            progressUpdaterMock.reset();
            audioPlayerMock.reset();
            let currentTrack: TrackModel;

            subscription.add(
                service.playbackStopped$.subscribe(() => {
                    currentTrack = service.currentTrack;
                })
            );

            // Act
            service.playNext();

            // Assert
            expect(currentTrack).toBeUndefined();
        });

        it('should play the next track if found', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);
            progressUpdaterMock.reset();
            audioPlayerMock.reset();

            // Act
            service.playNext();

            // Assert
            audioPlayerMock.verify((x) => x.stop(), Times.exactly(1));
            audioPlayerMock.verify((x) => x.play(trackModel2.path), Times.exactly(1));
            expect(service.isPlaying).toBeTruthy();
            expect(service.canPause).toBeTruthy();
            expect(service.canResume).toBeFalsy();
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.exactly(1));
            expect(service.currentTrack).toBe(trackModel2);
        });

        it('should get the next track without wrap around if loopMode is None', () => {
            // Arrange
            const getNextTrackSpy = jest.spyOn(queue, 'getNextTrack');

            while (service.loopMode !== LoopMode.None) {
                service.toggleLoopMode();
            }

            service.enqueueAndPlayTracks([trackModel1, trackModel2]);

            // Act
            service.playNext();

            // Assert
            expect(getNextTrackSpy).toHaveBeenCalledTimes(1);
            expect(getNextTrackSpy).toHaveBeenCalledWith(trackModel1, false);
            expect(service.currentTrack).toBe(trackModel2);
        });

        it('should get the next track with wrap around if loopMode is All', () => {
            // Arrange
            const getNextTrackSpy = jest.spyOn(queue, 'getNextTrack');

            while (service.loopMode !== LoopMode.All) {
                service.toggleLoopMode();
            }

            service.enqueueAndPlayTracks([trackModel1, trackModel2]);
            service.playNext(); // Move playback to second track (last track in queue)
            getNextTrackSpy.mockClear()

            // Act
            service.playNext();

            // Assert
            expect(getNextTrackSpy).toHaveBeenCalledTimes(1);
            expect(getNextTrackSpy).toHaveBeenCalledWith(trackModel2, true);
            expect(service.currentTrack).toBe(trackModel1);
        });

        it('should get the next track with wrap around if loopMode is One', () => {
            // Arrange
            const getNextTrackSpy = jest.spyOn(queue, 'getNextTrack');
            
            while (service.loopMode !== LoopMode.One) {
                service.toggleLoopMode();
            }

            service.enqueueAndPlayTracks([trackModel1, trackModel2]);

            // Act
            service.playNext();

            // Assert
            expect(getNextTrackSpy).toHaveBeenCalledTimes(1);
            expect(getNextTrackSpy).toHaveBeenCalledWith(trackModel1, false);
            expect(service.currentTrack).toBe(trackModel2);
        });

        it('should raise an event that playback has started, containing the current track and if a next track is being played.', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);
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
            expect(receivedTrack).toBe(trackModel2);
            expect(isPlayingPreviousTrack).toBeFalsy();
        });

        it('should increase play count and date last played for the current track if progress is more than 80%', () => {
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            service.enqueueAndPlayTracks([trackModelMock.object]);
            progressUpdaterProgressChanged.next(new PlaybackProgress(81, 100));

            // Act
            service.playNext();

            // Assert
            trackModelMock.verify((x) => x.increasePlayCountAndDateLastPlayed(), Times.once());
        });

        it('should save play count and date last played for the current track if progress is more than 80%', () => {
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            service.enqueueAndPlayTracks([trackModelMock.object]);
            progressUpdaterProgressChanged.next(new PlaybackProgress(81, 100));

            // Act
            service.playNext();

            // Assert
            trackServiceMock.verify((x) => x.savePlayCountAndDateLastPlayed(trackModelMock.object), Times.once());
        });

        it('should increase skip count for the current track if progress is less than 80%', () => {
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            service.enqueueAndPlayTracks([trackModelMock.object]);
            progressUpdaterProgressChanged.next(new PlaybackProgress(79, 100));

            // Act
            service.playNext();

            // Assert
            trackModelMock.verify((x) => x.increaseSkipCount(), Times.once());
        });

        it('should save skip count for the current track if progress is less than 80%', () => {
            const trackModelMock: IMock<TrackModel> = Mock.ofType<TrackModel>();
            service.enqueueAndPlayTracks([trackModelMock.object]);
            progressUpdaterProgressChanged.next(new PlaybackProgress(79, 100));

            // Act
            service.playNext();

            // Assert
            trackServiceMock.verify((x) => x.saveSkipCount(trackModelMock.object), Times.once());
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

        it('should set the provided volume if a volume between 0 and 1 exclusive is provided', () => {
            // Arrange
            mathExtensionsMock.setup((x) => x.clamp(0.8, 0, 1)).returns(() => 0.8);

            // Act
            service.volume = 0.8;

            // Assert
            expect(service.volume).toEqual(0.8);
        });

        it('should set the audio player volume to the provided volume if a volume between 0 and 1 exclusive is provided', () => {
            // Arrange
            mathExtensionsMock.setup((x) => x.clamp(0.8, 0, 1)).returns(() => 0.8);

            // Act
            service.volume = 0.8;

            // Assert
            audioPlayerMock.verify((x) => x.setVolume(0.8), Times.exactly(1));
        });

        it('should save the provided volume in the settings if a volume between 0 and 1 exclusive is provided', () => {
            // Arrange
            mathExtensionsMock.setup((x) => x.clamp(0.8, 0, 1)).returns(() => 0.8);

            // Act
            service.volume = 0.8;

            // Assert
            expect(settingsStub.volume).toEqual(0.8);
        });

        it('should set the provided volume if a volume of 0 is provided', () => {
            // Arrange
            mathExtensionsMock.setup((x) => x.clamp(0, 0, 1)).returns(() => 0);

            // Act
            service.volume = 0;

            // Assert
            expect(service.volume).toEqual(0);
        });

        it('should set the audio player volume to the provided volume if a volume of 0 is provided', () => {
            // Arrange
            mathExtensionsMock.setup((x) => x.clamp(0, 0, 1)).returns(() => 0);

            // Act
            service.volume = 0;

            // Assert
            audioPlayerMock.verify((x) => x.setVolume(0), Times.exactly(1));
        });

        it('should save the provided volume in the settings if a volume of 0 is provided', () => {
            // Arrange
            mathExtensionsMock.setup((x) => x.clamp(0, 0, 1)).returns(() => 0);

            // Act
            service.volume = 0;

            // Assert
            expect(settingsStub.volume).toEqual(0);
        });

        it('should set the provided volume if a volume of 1 is provided', () => {
            // Arrange
            mathExtensionsMock.setup((x) => x.clamp(1, 0, 1)).returns(() => 1);

            // Act
            service.volume = 1;

            // Assert
            expect(service.volume).toEqual(1);
        });

        it('should set the audio player volume to the provided volume if a volume of 1 is provided', () => {
            // Arrange
            mathExtensionsMock.setup((x) => x.clamp(1, 0, 1)).returns(() => 1);

            // Act
            service.volume = 1;

            // Assert
            audioPlayerMock.verify((x) => x.setVolume(1), Times.exactly(1));
        });

        it('should save the provided volume in the settings if a volume of 1 is provided', () => {
            // Arrange
            mathExtensionsMock.setup((x) => x.clamp(1, 0, 1)).returns(() => 1);

            // Act
            service.volume = 1;

            // Assert
            expect(settingsStub.volume).toEqual(1);
        });

        it('should set the volume to 0 if a volume smaller than 0 is provided', () => {
            // Arrange
            mathExtensionsMock.setup((x) => x.clamp(-0.5, 0, 1)).returns(() => 0);

            // Act
            service.volume = -0.5;

            // Assert
            expect(service.volume).toEqual(0);
        });

        it('should set the audio player volume to 0 if a volume smaller than 0 is provided', () => {
            // Arrange
            mathExtensionsMock.setup((x) => x.clamp(-0.5, 0, 1)).returns(() => 0);

            // Act
            service.volume = -0.5;

            // Assert
            audioPlayerMock.verify((x) => x.setVolume(0), Times.exactly(1));
        });

        it('should save a volume of 0 in the settings if a volume smaller than 0 is provided', () => {
            // Arrange
            mathExtensionsMock.setup((x) => x.clamp(-0.5, 0, 1)).returns(() => 0);

            // Act
            service.volume = -0.5;

            // Assert
            expect(settingsStub.volume).toEqual(0);
        });

        it('should set the volume to 1 if a volume greater than 1 is provided', () => {
            // Arrange
            mathExtensionsMock.setup((x) => x.clamp(1.5, 0, 1)).returns(() => 1);

            // Act
            service.volume = 1.5;

            // Assert
            expect(service.volume).toEqual(1);
        });

        it('should set the audio player volume to 1 if a volume greater than 1 is provided', () => {
            // Arrange
            mathExtensionsMock.setup((x) => x.clamp(1.5, 0, 1)).returns(() => 1);

            // Act
            service.volume = 1.5;

            // Assert
            audioPlayerMock.verify((x) => x.setVolume(1), Times.exactly(1));
        });

        it('should save a volume of 1 in the settings if a volume greater than 1 is provided', () => {
            // Arrange
            mathExtensionsMock.setup((x) => x.clamp(1.5, 0, 1)).returns(() => 1);

            // Act
            service.volume = 1.5;

            // Assert
            expect(settingsStub.volume).toEqual(1);
        });
    });

    describe('playbackQueue', () => {
        it('should return an empty queue if it has no tracks', () => {
            // Arrange
            service.enqueueAndPlayTracks([]);

            // Act
            const queue: TrackModels = service.playbackQueue;

            // Assert
            expect(queue.tracks.length).toEqual(0);
        });

        it('should return the queued tracks if the queue has tracks', () => {
            // Arrange
            service.enqueueAndPlayTracks(tracks.tracks);

            // Act
            const queue: TrackModels = service.playbackQueue;

            // Assert
            expect(queue.tracks.length).toEqual(4);
            expect(queue.tracks[0]).toBe(tracks.tracks[0]);
            expect(queue.tracks[1]).toBe(tracks.tracks[1]);
            expect(queue.tracks[2]).toBe(tracks.tracks[2]);
            expect(queue.tracks[3]).toBe(tracks.tracks[3]);
        });
    });

    describe('playQueuedTrack', () => {
        it('should start playback', () => {
            // Arrange
            audioPlayerMock.reset();
            audioPlayerMock.setup((x) => x.stop()).verifiable(Times.once(), ExpectedCallType.InSequence);
            audioPlayerMock.setup((x) => x.play(trackModel2.path)).verifiable(Times.once(), ExpectedCallType.InSequence);

            // Act
            service.playQueuedTrack(trackModel2);

            // Assert
            audioPlayerMock.verifyAll();
            expect(service.currentTrack).toBe(trackModel2);
            expect(service.canPause).toBeTruthy();
            expect(service.canResume).toBeFalsy();
            expect(service.isPlaying).toBeTruthy();
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.exactly(1));
        });

        it('should raise an event that playback has started, containing the current track and if a next track is being played.', () => {
            // Arrange
            let receivedTrack: TrackModel;
            let isPlayingPreviousTrack: boolean;
            subscription.add(
                service.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                    receivedTrack = playbackStarted.currentTrack;
                    isPlayingPreviousTrack = playbackStarted.isPlayingPreviousTrack;
                })
            );

            // Act
            service.playQueuedTrack(trackModel2);

            // Assert
            expect(receivedTrack).toBe(trackModel2);
            expect(isPlayingPreviousTrack).toBeFalsy();
        });
    });

    describe('togglePlayback', () => {
        it('should resume playback if paused', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);
            audioPlayerMock.reset();
            service.pause();

            // Act
            service.togglePlayback();

            // Assert
            expect(service.canPause).toBeTruthy();
            expect(service.canResume).toBeFalsy();
            audioPlayerMock.verify((x) => x.resume(), Times.once());
        });

        it('should pause playback if playing', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);
            audioPlayerMock.reset();

            // Act
            service.togglePlayback();

            // Assert
            expect(service.canPause).toBeFalsy();
            expect(service.canResume).toBeTruthy();
            audioPlayerMock.verify((x) => x.pause(), Times.once());
        });
    });

    describe('removeFromQueue', () => {
        let removeTracksSpy: jest.SpyInstance<void, [TrackModel[]]>;
        beforeEach(() => {
            removeTracksSpy = jest.spyOn(queue, 'removeTracks');
        });

        it('should not remove tracks when tracksToRemove is undefined', () => {
            // Arrange
            service.enqueueAndPlayTracks([trackModel1, trackModel2]);

            // Act
            service.removeFromQueue(undefined);

            // Assert
            expect(removeTracksSpy).not.toHaveBeenCalled();
            expect(service.playbackQueue.tracks[0]).toBe(trackModel1);
            expect(service.playbackQueue.tracks[1]).toBe(trackModel2);
        });

        it('should not remove tracks when tracksToRemove is empty', () => {
            // Arrange
            service.enqueueAndPlayTracks([trackModel1, trackModel2]);

            // Act
            service.removeFromQueue([]);

            // Assert
            expect(removeTracksSpy).not.toHaveBeenCalled();
            expect(service.playbackQueue.tracks[0]).toBe(trackModel1);
            expect(service.playbackQueue.tracks[1]).toBe(trackModel2);
        });

        it('should remove tracks when tracksToRemove has items', () => {
            // Arrange
            service.enqueueAndPlayTracks([trackModel1, trackModel2]);

            // Act
            service.removeFromQueue([trackModel1]);

            // Assert
            expect(removeTracksSpy).toHaveBeenCalledTimes(1);
            expect(removeTracksSpy).toHaveBeenCalledWith([trackModel1]);
            expect(service.playbackQueue.tracks[0]).toBe(trackModel2);
            expect(service.playbackQueue.tracks.length).toBe(1);
        });
    });

    describe('addTracksToQueueAsync', () => {
        let addTracksSpy: jest.SpyInstance<void, [TrackModel[]]>;
        beforeEach(() => {
            addTracksSpy = jest.spyOn(queue, 'addTracks');
        });

        it('should not add tracks to the queue if tracksToAdd is undefined', async () => {
            // Arrange

            // Act
            await service.addTracksToQueueAsync(undefined);

            // Assert
            expect(addTracksSpy).not.toHaveBeenCalled();
            snackBarServiceMock.verify((x) => x.singleTrackAddedToPlaybackQueueAsync(), Times.never());
            snackBarServiceMock.verify((x) => x.multipleTracksAddedToPlaybackQueueAsync(It.isAny()), Times.never());
        });

        it('should not add tracks to the queue if tracksToAdd is empty', async () => {
            // Arrange

            // Act
            await service.addTracksToQueueAsync([]);

            // Assert
            expect(addTracksSpy).not.toHaveBeenCalled();
            snackBarServiceMock.verify((x) => x.singleTrackAddedToPlaybackQueueAsync(), Times.never());
            snackBarServiceMock.verify((x) => x.multipleTracksAddedToPlaybackQueueAsync(It.isAny()), Times.never());
        });

        it('should add tracks to the queue if tracksToAdd has tracks', async () => {
            // Arrange

            // Act
            await service.addTracksToQueueAsync([trackModel1]);

            // Assert
            expect(addTracksSpy).toHaveBeenCalledTimes(1);
            expect(addTracksSpy).toHaveBeenCalledWith([trackModel1]);
            snackBarServiceMock.verify((x) => x.singleTrackAddedToPlaybackQueueAsync(), Times.exactly(1));
        });
    });

    describe('addArtistToQueueAsync', () => {
        it('should not get tracks for the artist if artistToAdd is undefined', async () => {
            // Arrange

            // Act
            await service.addArtistToQueueAsync(undefined, It.isAny());

            // Assert
            trackServiceMock.verify((x) => x.getTracksForArtists(It.isAny(), It.isAny()), Times.never());
            snackBarServiceMock.verify((x) => x.singleTrackAddedToPlaybackQueueAsync(), Times.never());
            snackBarServiceMock.verify((x) => x.multipleTracksAddedToPlaybackQueueAsync(It.isAny()), Times.never());
        });

        it('should not get tracks for the artist if artistType is undefined', async () => {
            // Arrange
            const artistToAdd: ArtistModel = new ArtistModel('artist1', translatorServiceMock.object);

            // Act
            await service.addArtistToQueueAsync(artistToAdd, undefined);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForArtists(It.isAny(), It.isAny()), Times.never());
            snackBarServiceMock.verify((x) => x.singleTrackAddedToPlaybackQueueAsync(), Times.never());
            snackBarServiceMock.verify((x) => x.multipleTracksAddedToPlaybackQueueAsync(It.isAny()), Times.never());
        });

        it('should get tracks for the artist if artistToAdd and artistType are not undefined', async () => {
            // Arrange
            const addTracksSpy = jest.spyOn(queue, 'addTracks');
            const artistToAdd: ArtistModel = new ArtistModel('artist1', translatorServiceMock.object);

            // Act
            await service.addArtistToQueueAsync(artistToAdd, ArtistType.trackArtists);

            // Assert
            expect(addTracksSpy).toHaveBeenCalledTimes(1);
            expect(addTracksSpy).toHaveBeenCalledWith(orderedTrackModels);
            trackServiceMock.verify((x) => x.getTracksForArtists([artistToAdd.displayName], ArtistType.trackArtists), Times.exactly(1));
        });

        it('should order tracks for the artist byAlbum', async () => {
            // Arrange
            const addTracksSpy = jest.spyOn(queue, 'addTracks');
            const artistToAdd: ArtistModel = new ArtistModel('artist1', translatorServiceMock.object);

            // Act
            await service.addArtistToQueueAsync(artistToAdd, ArtistType.trackArtists);

            // Assert
            expect(addTracksSpy).toHaveBeenCalledTimes(1);
            expect(addTracksSpy).toHaveBeenCalledWith(orderedTrackModels);
            trackOrderingMock.verify((x) => x.getTracksOrderedByAlbum(tracks.tracks), Times.exactly(1));
        });

        it('should add tracks to the queue ordered by album', async () => {
            // Arrange
            const addTracksSpy = jest.spyOn(queue, 'addTracks');
            const artistToAdd: ArtistModel = new ArtistModel('artist1', translatorServiceMock.object);

            // Act
            await service.addArtistToQueueAsync(artistToAdd, ArtistType.trackArtists);

            // Assert
            expect(addTracksSpy).toHaveBeenCalledTimes(1);
            expect(addTracksSpy).toHaveBeenCalledWith(orderedTrackModels);
            snackBarServiceMock.verify((x) => x.multipleTracksAddedToPlaybackQueueAsync(4), Times.exactly(1));
        });
    });

    describe('addGenreToQueueAsync', () => {
        it('should not get tracks for the genre if genreToAdd is undefined', async () => {
            // Arrange

            // Act
            await service.addGenreToQueueAsync(undefined);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForArtists(It.isAny(), It.isAny()), Times.never());
            snackBarServiceMock.verify((x) => x.singleTrackAddedToPlaybackQueueAsync(), Times.never());
            snackBarServiceMock.verify((x) => x.multipleTracksAddedToPlaybackQueueAsync(It.isAny()), Times.never());
        });

        it('should get tracks for the genre if genreToAdd is not undefined', async () => {
            // Arrange
            const genreToAdd: GenreModel = new GenreModel('genre1', translatorServiceMock.object);

            // Act
            await service.addGenreToQueueAsync(genreToAdd);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForGenres([genreToAdd.displayName]), Times.exactly(1));
        });

        it('should order tracks for the artist byAlbum', async () => {
            // Arrange
            const genreToAdd: GenreModel = new GenreModel('genre1', translatorServiceMock.object);

            // Act
            await service.addGenreToQueueAsync(genreToAdd);

            // Assert
            trackOrderingMock.verify((x) => x.getTracksOrderedByAlbum(tracks.tracks), Times.exactly(1));
        });

        it('should add tracks to the queue ordered by album', async () => {
            // Arrange
            const addTracksSpy = jest.spyOn(queue, 'addTracks');
            const genreToAdd: GenreModel = new GenreModel('genre1', translatorServiceMock.object);

            // Act
            await service.addGenreToQueueAsync(genreToAdd);

            // Assert
            expect(addTracksSpy).toHaveBeenCalledTimes(1);
            expect(addTracksSpy).toHaveBeenCalledWith(orderedTrackModels);
            snackBarServiceMock.verify((x) => x.multipleTracksAddedToPlaybackQueueAsync(4), Times.exactly(1));
        });
    });

    describe('addAlbumToQueueAsync', () => {
        it('should not get tracks for the album if albumToAdd is undefined', () => {
            // Arrange

            // Act
            service.addAlbumToQueueAsync(undefined);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForAlbums(It.isAny()), Times.never());
            snackBarServiceMock.verify((x) => x.singleTrackAddedToPlaybackQueueAsync(), Times.never());
            snackBarServiceMock.verify((x) => x.multipleTracksAddedToPlaybackQueueAsync(It.isAny()), Times.never());
        });

        it('should get tracks for the album if albumToAdd is not undefined', () => {
            // Arrange

            // Act
            service.addAlbumToQueueAsync(album1);

            // Assert
            trackServiceMock.verify((x) => x.getTracksForAlbums([album1.albumKey]), Times.exactly(1));
        });

        it('should order tracks for the album byAlbum', () => {
            // Arrange

            // Act
            service.addAlbumToQueueAsync(album1);

            // Assert
            trackOrderingMock.verify((x) => x.getTracksOrderedByAlbum(tracks.tracks), Times.exactly(1));
        });

        it('should add tracks to the queue ordered by album', () => {
            // Arrange
            const addTracksSpy = jest.spyOn(queue, 'addTracks');

            // Act
            service.addAlbumToQueueAsync(album1);

            // Assert
            expect(addTracksSpy).toHaveBeenCalledTimes(1);
            expect(addTracksSpy).toHaveBeenCalledWith(orderedTrackModels);
            snackBarServiceMock.verify((x) => x.multipleTracksAddedToPlaybackQueueAsync(4), Times.exactly(1));
        });
    });

    describe('addPlaylistToQueueAsync', () => {
        test.todo('should write tests');
    });

    describe('stopIfPlaying', () => {
        it('should not stop playback if there is no track playing', () => {
            // Arrange

            // Act
            service.stopIfPlaying(trackModel2);

            // Assert
            audioPlayerMock.verify((x) => x.stop(), Times.never());
        });

        it('should not play the next track if there is no track playing', () => {
            // Arrange
            const getNextTrackSpy = jest.spyOn(queue, 'getNextTrack');

            // Act
            service.stopIfPlaying(trackModel2);

            // Assert
            expect(getNextTrackSpy).not.toHaveBeenCalled();
            audioPlayerMock.verify((x) => x.play(It.isAny()), Times.never());
        });

        it('should not stop playback if the given track is not playing', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels);
            audioPlayerMock.reset();

            // Act
            service.stopIfPlaying(trackModel2);

            // Assert
            audioPlayerMock.verify((x) => x.stop(), Times.never());
        });

        it('should not play the next track if the given track is not playing', () => {
            // Arrange
            const getNextTrackSpy = jest.spyOn(queue, 'getNextTrack');
            service.enqueueAndPlayTracks(trackModels);
            audioPlayerMock.reset();

            // Act
            service.stopIfPlaying(trackModel2);

            // Assert
            expect(getNextTrackSpy).not.toHaveBeenCalled();
            audioPlayerMock.verify((x) => x.play(It.isAny()), Times.never());
        });

        it('should stop playback if the given track is playing and it is the only track in the queue', () => {
            // Arrange
            const getNextTrackSpy = jest.spyOn(queue, 'getNextTrack');
            service.enqueueAndPlayTracks([trackModel1]);
            audioPlayerMock.reset();

            // Act
            service.stopIfPlaying(trackModel1);

            // Assert
            expect(getNextTrackSpy).not.toHaveBeenCalled();
            audioPlayerMock.verify((x) => x.stop(), Times.once());
        });

        it('should play the next track if the given track is playing and it not the only track in the queue', async () => {
            // Arrange
            const getNextTrackSpy = jest.spyOn(queue, 'getNextTrack');
            service.enqueueAndPlayTracks(trackModels);
            audioPlayerMock.reset();
            // Act
            await service.stopIfPlaying(trackModel1);

            // Assert
            expect(getNextTrackSpy).toHaveBeenCalledTimes(1);
            expect(getNextTrackSpy).toHaveBeenCalledWith(trackModel1, false);
            audioPlayerMock.verify((x) => x.play(trackModel2.path), Times.once());
        });
    });
});
