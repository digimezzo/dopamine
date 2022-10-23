import { IMock, It, Mock, Times } from 'typemoq';
import { Track } from '../../../../common/data/entities/track';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { BasePlaybackService } from '../../../../services/playback/base-playback.service';
import { TrackModel } from '../../../../services/track/track-model';
import { TrackModels } from '../../../../services/track/track-models';
import { BaseTranslatorService } from '../../../../services/translator/base-translator.service';
import { CollectionTracksTableComponent } from './collection-tracks-table.component';

describe('CollectionTracksTableComponent', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let track1: Track;
    let track2: Track;
    let track3: Track;
    let track4: Track;
    let trackModel1: TrackModel;
    let trackModel2: TrackModel;
    let trackModel3: TrackModel;
    let trackModel4: TrackModel;
    let tracks: TrackModels;

    function createComponent(): CollectionTracksTableComponent {
        const component: CollectionTracksTableComponent = new CollectionTracksTableComponent(
            playbackServiceMock.object,
            mouseSelectionWatcherMock.object
        );

        return component;
    }

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        track1 = new Track('Path 1');
        track1.trackTitle = 'Title 1';
        track1.albumArtists = ';Album artist 1;';
        track1.albumTitle = 'Album title 1';
        track1.trackNumber = 1;
        track1.discNumber = 1;
        track1.rating = 1;

        track2 = new Track('Path 2');
        track2.trackTitle = 'Title 2';
        track2.albumArtists = ';Album artist 1;';
        track2.albumTitle = 'Album title 1';
        track2.trackNumber = 1;
        track2.discNumber = 2;
        track2.rating = 2;

        track3 = new Track('Path 3');
        track3.trackTitle = 'Title 3';
        track3.albumArtists = ';Album artist 2;';
        track3.albumTitle = 'Album title 2';
        track3.trackNumber = 1;
        track3.discNumber = 1;
        track3.rating = 3;

        track4 = new Track('Path 4');
        track4.trackTitle = 'Title 4';
        track4.albumArtists = ';Album artist 2;';
        track4.albumTitle = 'Album title 2';
        track4.trackNumber = 2;
        track4.discNumber = 1;
        track4.rating = 4;

        trackModel1 = new TrackModel(track1, translatorServiceMock.object);
        trackModel2 = new TrackModel(track2, translatorServiceMock.object);
        trackModel3 = new TrackModel(track3, translatorServiceMock.object);
        trackModel4 = new TrackModel(track4, translatorServiceMock.object);
        tracks = new TrackModels();
        tracks.addTrack(trackModel1);
        tracks.addTrack(trackModel2);
        tracks.addTrack(trackModel3);
        tracks.addTrack(trackModel4);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: CollectionTracksTableComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('tracks', () => {
        it('should set and get the tracks', () => {
            // Arrange
            const component: CollectionTracksTableComponent = createComponent();
            component.ngOnInit();

            // Act
            component.tracks = tracks;

            // Assert
            expect(component.tracks).toBe(tracks);
        });

        it('should initialize mouseSelectionWatcher using tracks', () => {
            // Arrange
            const component: CollectionTracksTableComponent = createComponent();
            component.ngOnInit();

            // Act
            component.tracks = tracks;

            // Assert
            // TODO: TypeMoq does not consider the call with track.track to have been performed (The reference to tracks.tracks seems lost).
            // So we use a workaround to ensure that the correct call occurs.
            // mouseSelectionWatcherMock.verify((x) => x.initialize(tracks.tracks, false), Times.exactly(1));
            mouseSelectionWatcherMock.verify(
                (x) =>
                    x.initialize(
                        It.is(
                            (trackModels: TrackModel[]) =>
                                trackModels.length === 4 &&
                                trackModels[0].path === trackModel1.path &&
                                trackModels[1].path === trackModel2.path &&
                                trackModels[2].path === trackModel3.path &&
                                trackModels[3].path === trackModel4.path
                        ),
                        false
                    ),
                Times.exactly(1)
            );
        });

        // it('should order the tracks', () => {
        //     // Arrange
        //     const component: CollectionTracksTableComponent = createComponent();
        //     component.ngOnInit();

        //     // Act
        //     component.tracks = tracks;

        //     // Assert
        //     expect(component.orderedTracks[0]).toBe(trackModel4);
        //     expect(component.orderedTracks[1]).toBe(trackModel3);
        //     expect(component.orderedTracks[2]).toBe(trackModel2);
        //     expect(component.orderedTracks[3]).toBe(trackModel1);
        // });
    });

    describe('setSelectedTracks', () => {
        it('should set the selected item on mouseSelectionWatcher', () => {
            // Arrange
            const component: CollectionTracksTableComponent = createComponent();
            const event: any = {};

            // Act
            component.setSelectedTracks(event, trackModel2);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.setSelectedItems(event, trackModel2), Times.once());
        });
    });
});
