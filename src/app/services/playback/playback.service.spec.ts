import { Observable, Subject, Subscription } from 'rxjs';
import { ExpectedCallType, IMock, It, Mock, Times } from 'typemoq';
import { AlbumData } from '../../common/data/entities/album-data';
import { Track } from '../../common/data/entities/track';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { MathExtensions } from '../../common/math-extensions';
import { TrackOrdering } from '../../common/ordering/track-ordering';
import { AlbumModel } from '../album/album-model';
import { ArtistModel } from '../artist/artist-model';
import { ArtistType } from '../artist/artist-type';
import { GenreModel } from '../genre/genre-model';
import { BasePlaylistService } from '../playlist/base-playlist.service';
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
    let audioPlayerMock: IMock<BaseAudioPlayer>;
    let trackOrderingMock: IMock<TrackOrdering>;
    let fileSystemMock: IMock<FileSystem>;
    let loggerMock: IMock<Logger>;
    let queueMock: IMock<Queue>;
    let progressUpdaterMock: IMock<ProgressUpdater>;
    let mathExtensionsMock: IMock<MathExtensions>;
    let settingsStub: any;
    let service: PlaybackService;
    let playbackFinished: Subject<void>;
    let progressUpdaterProgressChanged: Subject<PlaybackProgress>;
    let subscription: Subscription;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    const albumData1: AlbumData = new AlbumData();
    albumData1.albumKey = 'albumKey1';

    let album1: AlbumModel;

    let track1: Track;
    let track2: Track;
    let track3: Track;
    let track4: Track;
    let trackModel1: TrackModel;
    let trackModel2: TrackModel;
    let trackModel3: TrackModel;
    let trackModel4: TrackModel;

    let trackModels: TrackModel[];
    let orderedTrackModels: TrackModel[];

    let tracks: TrackModels;

    beforeEach(() => {
        trackServiceMock = Mock.ofType<BaseTrackService>();
        playlistServiceMock = Mock.ofType<BasePlaylistService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        audioPlayerMock = Mock.ofType<BaseAudioPlayer>();
        trackOrderingMock = Mock.ofType<TrackOrdering>();
        fileSystemMock = Mock.ofType<FileSystem>();
        loggerMock = Mock.ofType<Logger>();
        queueMock = Mock.ofType<Queue>();
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

        album1 = new AlbumModel(albumData1, translatorServiceMock.object, fileSystemMock.object);

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

        trackModel1 = new TrackModel(track1, translatorServiceMock.object);
        trackModel2 = new TrackModel(track2, translatorServiceMock.object);
        trackModel3 = new TrackModel(track3, translatorServiceMock.object);
        trackModel4 = new TrackModel(track4, translatorServiceMock.object);

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
            audioPlayerMock.object,
            trackOrderingMock.object,
            queueMock.object,
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
            queueMock.setup((x) => x.getNextTrack(It.isAny(), false)).returns(() => undefined);

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
            queueMock.setup((x) => x.getNextTrack(It.isAny(), false)).returns(() => undefined);
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
            service.enqueueAndPlayTracks(trackModels, trackModel1);
            queueMock.setup((x) => x.getNextTrack(It.isAny(), false)).returns(() => undefined);
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
            service.enqueueAndPlayTracks(trackModels, trackModel1);
            queueMock.setup((x) => x.getNextTrack(trackModel1, false)).returns(() => trackModel2);
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

            service.enqueueAndPlayTracks(trackModels, trackModel1);
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

            service.enqueueAndPlayTracks(trackModels, trackModel1);
            queueMock.setup((x) => x.getNextTrack(trackModel1, false)).returns(() => trackModel2);
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

            service.enqueueAndPlayTracks(trackModels, trackModel1);
            queueMock.setup((x) => x.getNextTrack(trackModel1, true)).returns(() => trackModel2);
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

            service.enqueueAndPlayTracks(trackModels, trackModel1);
            queueMock.setup((x) => x.getNextTrack(trackModel1, false)).returns(() => trackModel2);
            audioPlayerMock.reset();

            // Act
            playbackFinished.next();

            // Assert
            audioPlayerMock.verify((x) => x.play(trackModel2.path), Times.exactly(1));
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

        it('should raise an event, on playback finished, that playback has started, containing the current track and if a next track is being played.', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels, trackModel1);
            queueMock.setup((x) => x.getNextTrack(trackModel1, false)).returns(() => trackModel2);

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

    describe('enqueueAndPlayTracks', () => {
        it('should not add tracks to the queue if tracks is undefined', () => {
            // Arrange

            // Act
            service.enqueueAndPlayTracks(undefined, trackModel1);

            // Assert
            queueMock.verify((x) => x.setTracks(It.isAny(), It.isAny()), Times.never());
        });

        it('should not add tracks to the queue if tracks is empty', () => {
            // Arrange

            // Act
            service.enqueueAndPlayTracks(undefined, trackModel1);

            // Assert
            queueMock.verify((x) => x.setTracks(It.isAny(), It.isAny()), Times.never());
        });

        it('should not start playback if tracks is undefined', () => {
            // Arrange

            // Act
            service.enqueueAndPlayTracks(undefined, trackModel1);

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
            service.enqueueAndPlayTracks(undefined, trackModel1);

            // Assert
            audioPlayerMock.verify((x) => x.play(It.isAny()), Times.never());
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.never());
            expect(service.isPlaying).toEqual(false);
            expect(service.canPause).toEqual(false);
            expect(service.canResume).toEqual(true);
        });

        it('should not start playback if trackToPlay is undefined', () => {
            // Arrange

            // Act
            service.enqueueAndPlayTracks(trackModels, undefined);

            // Assert
            audioPlayerMock.verify((x) => x.play(It.isAny()), Times.never());
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.never());
            expect(service.isPlaying).toEqual(false);
            expect(service.canPause).toEqual(false);
            expect(service.canResume).toEqual(true);
        });

        it('should add tracks to the queue unshuffled if shuffle is disabled', () => {
            // Arrange

            // Act
            service.enqueueAndPlayTracks(trackModels, trackModel1);

            // Assert
            queueMock.verify((x) => x.setTracks(trackModels, false), Times.exactly(1));
        });

        it('should add tracks to the queue shuffled if shuffle is enabled', () => {
            // Arrange
            service.toggleIsShuffled();

            // Act
            service.enqueueAndPlayTracks(trackModels, trackModel1);

            // Assert
            queueMock.verify((x) => x.setTracks(trackModels, true), Times.exactly(1));
        });

        it('should start playback', () => {
            // Arrange
            audioPlayerMock.reset();
            audioPlayerMock.setup((x) => x.stop()).verifiable(Times.once(), ExpectedCallType.InSequence);
            audioPlayerMock.setup((x) => x.play(trackModel1.path)).verifiable(Times.once(), ExpectedCallType.InSequence);

            // Act
            service.enqueueAndPlayTracks(trackModels, trackModel1);

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
            service.enqueueAndPlayTracks(trackModels, trackModel1);

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
            const artistToPlay: ArtistModel = new ArtistModel('artist1', translatorServiceMock.object);

            // Act
            service.enqueueAndPlayArtist(artistToPlay, ArtistType.trackArtists);

            // Assert
            queueMock.verify((x) => x.setTracks(orderedTrackModels, It.isAny()), Times.exactly(1));
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
            const genreToPlay: GenreModel = new GenreModel('genre1', translatorServiceMock.object);

            // Act
            service.enqueueAndPlayGenre(genreToPlay);

            // Assert
            queueMock.verify((x) => x.setTracks(orderedTrackModels, It.isAny()), Times.exactly(1));
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

            // Act
            service.enqueueAndPlayAlbum(album1);

            // Assert
            queueMock.verify((x) => x.setTracks(orderedTrackModels, It.isAny()), Times.exactly(1));
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
            service.enqueueAndPlayTracks(trackModels, trackModel1);

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
            service.enqueueAndPlayTracks(trackModels, trackModel1);
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
            service.enqueueAndPlayTracks(trackModels, trackModel1);
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
            service.enqueueAndPlayTracks(trackModels, trackModel1);
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
            service.enqueueAndPlayTracks(trackModels, trackModel1);
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
            service.enqueueAndPlayTracks(trackModels, trackModel1);
            queueMock.setup((x) => x.getPreviousTrack(trackModel1, false)).returns(() => trackModel2);
            audioPlayerMock.reset();
            audioPlayerMock.setup((x) => x.progressSeconds).returns(() => 2.9);
            progressUpdaterMock.reset();

            // Act
            service.playPrevious();
            // Assert
            audioPlayerMock.verify((x) => x.play(trackModel2.path), Times.exactly(1));
            expect(service.isPlaying).toBeTruthy();
            expect(service.canPause).toBeTruthy();
            expect(service.canResume).toBeFalsy();
            progressUpdaterMock.verify((x) => x.startUpdatingProgress(), Times.exactly(1));
            expect(service.currentTrack).toBe(trackModel2);
        });

        it('should stop playback if a previous track was not found and playback lasted for less then 3 seconds', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels, trackModel1);
            queueMock.setup((x) => x.getPreviousTrack(trackModel1, false)).returns(() => undefined);
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
            service.enqueueAndPlayTracks(trackModels, trackModel1);
            queueMock.setup((x) => x.getPreviousTrack(trackModel1, false)).returns(() => undefined);
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
            service.enqueueAndPlayTracks(trackModels, trackModel1);
            queueMock.setup((x) => x.getNextTrack(It.isAny(), false)).returns(() => undefined);
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
            while (service.loopMode !== LoopMode.None) {
                service.toggleLoopMode();
            }

            // Act
            service.playPrevious();

            // Assert
            queueMock.verify((x) => x.getPreviousTrack(It.isAny(), false), Times.exactly(1));
        });

        it('should get the previous track with wrap around if loopMode is All', () => {
            // Arrange
            while (service.loopMode !== LoopMode.All) {
                service.toggleLoopMode();
            }

            // Act
            service.playPrevious();

            // Assert
            queueMock.verify((x) => x.getPreviousTrack(It.isAny(), true), Times.exactly(1));
        });

        it('should get the previous track with wrap around if loopMode is One', () => {
            // Arrange
            while (service.loopMode !== LoopMode.One) {
                service.toggleLoopMode();
            }

            // Act
            service.playPrevious();

            // Assert
            queueMock.verify((x) => x.getPreviousTrack(It.isAny(), false), Times.exactly(1));
        });

        it('should raise an event that playback has started, containing the current track and if a previous track is being played.', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels, trackModel1);
            queueMock.setup((x) => x.getPreviousTrack(trackModel1, false)).returns(() => trackModel2);
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
            expect(receivedTrack).toBe(trackModel2);
            expect(isPlayingPreviousTrack).toBeTruthy();
        });
    });

    describe('playNext', () => {
        it('should stop playback if a next track is not found', () => {
            // Arrange
            queueMock.setup((x) => x.getNextTrack(trackModel1, false)).returns(() => undefined);
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
            service.enqueueAndPlayTracks(trackModels, trackModel1);
            queueMock.setup((x) => x.getNextTrack(trackModel1, false)).returns(() => undefined);
            progressUpdaterMock.reset();
            audioPlayerMock.reset();
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
            service.enqueueAndPlayTracks(trackModels, trackModel1);
            queueMock.setup((x) => x.getNextTrack(trackModel1, false)).returns(() => undefined);
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
            service.enqueueAndPlayTracks(trackModels, trackModel1);
            queueMock.setup((x) => x.getNextTrack(trackModel1, false)).returns(() => trackModel2);
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
            while (service.loopMode !== LoopMode.None) {
                service.toggleLoopMode();
            }

            // Act
            service.playNext();

            // Assert
            queueMock.verify((x) => x.getNextTrack(It.isAny(), false), Times.exactly(1));
        });
        it('should get the next track with wrap around if loopMode is All', () => {
            // Arrange
            while (service.loopMode !== LoopMode.All) {
                service.toggleLoopMode();
            }

            // Act
            service.playNext();

            // Assert
            queueMock.verify((x) => x.getNextTrack(It.isAny(), true), Times.exactly(1));
        });
        it('should get the next track with wrap around if loopMode is One', () => {
            // Arrange
            while (service.loopMode !== LoopMode.One) {
                service.toggleLoopMode();
            }

            // Act
            service.playNext();

            // Assert
            queueMock.verify((x) => x.getNextTrack(It.isAny(), false), Times.exactly(1));
        });

        it('should raise an event that playback has started, containing the current track and if a next track is being played.', () => {
            // Arrange
            service.enqueueAndPlayTracks(trackModels, trackModel1);
            queueMock.setup((x) => x.getNextTrack(trackModel1, false)).returns(() => trackModel2);
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
            queueMock.reset();
            queueMock.setup((x) => x.tracks).returns(() => []);
            service = new PlaybackService(
                trackServiceMock.object,
                playlistServiceMock.object,
                audioPlayerMock.object,
                trackOrderingMock.object,
                queueMock.object,
                progressUpdaterMock.object,
                mathExtensionsMock.object,
                settingsStub,
                loggerMock.object
            );

            // Act
            const queue: TrackModels = service.playbackQueue;

            // Assert
            expect(queue.tracks.length).toEqual(0);
        });

        it('should return the queued tracks if the queue has tracks', () => {
            // Arrange
            queueMock.reset();
            queueMock.setup((x) => x.tracks).returns(() => tracks.tracks);
            service = new PlaybackService(
                trackServiceMock.object,
                playlistServiceMock.object,
                audioPlayerMock.object,
                trackOrderingMock.object,
                queueMock.object,
                progressUpdaterMock.object,
                mathExtensionsMock.object,
                settingsStub,
                loggerMock.object
            );

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
            service.enqueueAndPlayTracks(trackModels, trackModel1);
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
            service.enqueueAndPlayTracks(trackModels, trackModel1);
            audioPlayerMock.reset();

            // Act
            service.togglePlayback();

            // Assert
            expect(service.canPause).toBeFalsy();
            expect(service.canResume).toBeTruthy();
            audioPlayerMock.verify((x) => x.pause(), Times.once());
        });
    });
});
