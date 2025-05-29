import { IMock, Mock, Times } from 'typemoq';
import { TrackServiceBase } from '../../../../services/track/track.service.base';
import { PlaybackService } from '../../../../services/playback/playback.service';
import { NowPlayingNothingPlayingComponent } from './now-playing-nothing-playing.component';
import { TrackModels } from '../../../../services/track/track-models';

describe('NowPlayingNothingPlayingComponent', () => {
    let playbackServiceMock: IMock<PlaybackService>;
    let trackServiceMock: IMock<TrackServiceBase>;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<PlaybackService>();
        trackServiceMock = Mock.ofType<TrackServiceBase>();
    });

    function createSut(): NowPlayingNothingPlayingComponent {
        return new NowPlayingNothingPlayingComponent(playbackServiceMock.object, trackServiceMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const sut: NowPlayingNothingPlayingComponent = createSut();

            // Assert
            expect(sut).toBeDefined();
        });
    });

    describe('playAll', () => {
        it('should enqueue all tracks without shuffle', () => {
            // Arrange
            const tracks: TrackModels = new TrackModels();
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => tracks);
            const sut: NowPlayingNothingPlayingComponent = createSut();

            // Act
            sut.playAll();

            // Assert
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.once());
            playbackServiceMock.verify((x) => x.forceShuffled(), Times.never());
            playbackServiceMock.verify((x) => x.enqueueAndPlayTracks(tracks.tracks), Times.once());
        });
    });

    describe('shuffleAll', () => {
        it('should enqueue all tracks with shuffle', () => {
            // Arrange
            const tracks: TrackModels = new TrackModels();
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => tracks);
            const sut: NowPlayingNothingPlayingComponent = createSut();

            // Act
            sut.shuffleAll();

            // Assert
            trackServiceMock.verify((x) => x.getVisibleTracks(), Times.once());
            playbackServiceMock.verify((x) => x.forceShuffled(), Times.once());
            playbackServiceMock.verify((x) => x.enqueueAndPlayTracks(tracks.tracks), Times.once());
        });
    });
});
