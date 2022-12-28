import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { ContextMenuOpener } from '../../../common/context-menu-opener';
import { Track } from '../../../common/data/entities/track';
import { DateTime } from '../../../common/date-time';
import { BaseDesktop } from '../../../common/io/base-desktop';
import { Logger } from '../../../common/logger';
import { MouseSelectionWatcher } from '../../../common/mouse-selection-watcher';
import { TrackOrdering } from '../../../common/ordering/track-ordering';
import { BaseCollectionService } from '../../../services/collection/base-collection.service';
import { BaseDialogService } from '../../../services/dialog/base-dialog.service';
import { BaseMetadataService } from '../../../services/metadata/base-metadata.service';
import { BasePlaybackIndicationService } from '../../../services/playback-indication/base-playback-indication.service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../../services/playback/playback-started';
import { TrackModel } from '../../../services/track/track-model';
import { TrackModels } from '../../../services/track/track-models';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AddToPlaylistMenu } from '../../add-to-playlist-menu';
import { BaseTracksPersister } from '../base-tracks-persister';
import { TrackOrder } from '../track-order';
import { TrackBrowserComponent } from './track-browser.component';

describe('TrackBrowserComponent', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let addToPlaylistMenuMock: IMock<AddToPlaylistMenu>;
    let contextMenuOpenerMock: IMock<ContextMenuOpener>;
    let playbackIndicationServiceMock: IMock<BasePlaybackIndicationService>;
    let metadataServiceMock: IMock<BaseMetadataService>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let trackOrderingMock: IMock<TrackOrdering>;
    let desktopMock: IMock<BaseDesktop>;
    let loggerMock: IMock<Logger>;
    let tracksPersisterMock: IMock<BaseTracksPersister>;
    let collectionServiceMock: IMock<BaseCollectionService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let dialogServiceMock: IMock<BaseDialogService>;
    let dateTimeMock: IMock<DateTime>;

    let playbackStartedMock: Subject<PlaybackStarted>;
    let playbackStartedMock$: Observable<PlaybackStarted>;

    let playbackStoppedMock: Subject<void>;
    let playbackStoppedMock$: Observable<void>;

    let metadataService_ratingSaved: Subject<TrackModel>;
    let metadataService_loveSaved: Subject<TrackModel>;

    let track1: Track;
    let track2: Track;
    let track3: Track;
    let track4: Track;
    let trackModel1: TrackModel;
    let trackModel2: TrackModel;
    let trackModel3: TrackModel;
    let trackModel4: TrackModel;
    let tracks: TrackModels;

    beforeEach(() => {
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        addToPlaylistMenuMock = Mock.ofType<AddToPlaylistMenu>();
        contextMenuOpenerMock = Mock.ofType<ContextMenuOpener>();
        playbackIndicationServiceMock = Mock.ofType<BasePlaybackIndicationService>();
        metadataServiceMock = Mock.ofType<BaseMetadataService>();
        collectionServiceMock = Mock.ofType<BaseCollectionService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        dialogServiceMock = Mock.ofType<BaseDialogService>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        trackOrderingMock = Mock.ofType<TrackOrdering>();
        desktopMock = Mock.ofType<BaseDesktop>();
        loggerMock = Mock.ofType<Logger>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        tracksPersisterMock = Mock.ofType<BaseTracksPersister>();
        dateTimeMock = Mock.ofType<DateTime>();

        playbackStartedMock = new Subject();
        playbackStartedMock$ = playbackStartedMock.asObservable();
        playbackStoppedMock = new Subject();
        playbackStoppedMock$ = playbackStoppedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackStartedMock$);
        playbackServiceMock.setup((x) => x.playbackStopped$).returns(() => playbackStoppedMock$);
        playbackServiceMock.setup((x) => x.currentTrack).returns(() => trackModel1);
        tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleDescending);

        metadataService_ratingSaved = new Subject();
        const metadataService_ratingSaved$: Observable<TrackModel> = metadataService_ratingSaved.asObservable();
        metadataServiceMock.setup((x) => x.ratingSaved$).returns(() => metadataService_ratingSaved$);

        metadataService_loveSaved = new Subject();
        const metadataService_loveSaved$: Observable<TrackModel> = metadataService_loveSaved.asObservable();
        metadataServiceMock.setup((x) => x.loveSaved$).returns(() => metadataService_loveSaved$);

        translatorServiceMock.setup((x) => x.getAsync('delete-song')).returns(async () => 'delete-song');
        translatorServiceMock.setup((x) => x.getAsync('confirm-delete-song')).returns(async () => 'confirm-delete-song');
        translatorServiceMock.setup((x) => x.getAsync('delete-songs')).returns(async () => 'delete-songs');
        translatorServiceMock.setup((x) => x.getAsync('confirm-delete-songs')).returns(async () => 'confirm-delete-songs');

        track1 = new Track('Path 1');
        track1.trackTitle = 'Title 1';
        track1.albumArtists = ';Album artist 1;';
        track1.albumTitle = 'Album title 1';
        track1.trackNumber = 1;
        track1.discNumber = 1;
        track1.rating = 1;
        track1.love = 0;

        track2 = new Track('Path 2');
        track2.trackTitle = 'Title 2';
        track2.albumArtists = ';Album artist 1;';
        track2.albumTitle = 'Album title 1';
        track2.trackNumber = 1;
        track2.discNumber = 2;
        track2.rating = 2;
        track2.love = 0;

        track3 = new Track('Path 3');
        track3.trackTitle = 'Title 3';
        track3.albumArtists = ';Album artist 2;';
        track3.albumTitle = 'Album title 2';
        track3.trackNumber = 1;
        track3.discNumber = 1;
        track3.rating = 3;
        track3.love = 0;

        track4 = new Track('Path 4');
        track4.trackTitle = 'Title 4';
        track4.albumArtists = ';Album artist 2;';
        track4.albumTitle = 'Album title 2';
        track4.trackNumber = 2;
        track4.discNumber = 1;
        track4.rating = 4;
        track4.love = 0;

        trackModel1 = new TrackModel(track1, dateTimeMock.object, translatorServiceMock.object);
        trackModel2 = new TrackModel(track2, dateTimeMock.object, translatorServiceMock.object);
        trackModel3 = new TrackModel(track3, dateTimeMock.object, translatorServiceMock.object);
        trackModel4 = new TrackModel(track4, dateTimeMock.object, translatorServiceMock.object);
        tracks = new TrackModels();
        tracks.addTrack(trackModel1);
        tracks.addTrack(trackModel2);
        tracks.addTrack(trackModel3);
        tracks.addTrack(trackModel4);

        trackOrderingMock
            .setup((x) => x.getTracksOrderedByTitleAscending(It.isAny()))
            .returns(() => [trackModel1, trackModel2, trackModel3, trackModel4]);
        trackOrderingMock
            .setup((x) => x.getTracksOrderedByTitleDescending(It.isAny()))
            .returns(() => [trackModel4, trackModel3, trackModel2, trackModel1]);
        trackOrderingMock
            .setup((x) => x.getTracksOrderedByAlbum(It.isAny()))
            .returns(() => [trackModel1, trackModel2, trackModel3, trackModel4]);
    });

    function createComponent(): TrackBrowserComponent {
        return new TrackBrowserComponent(
            playbackServiceMock.object,
            addToPlaylistMenuMock.object,
            contextMenuOpenerMock.object,
            mouseSelectionWatcherMock.object,
            metadataServiceMock.object,
            playbackIndicationServiceMock.object,
            collectionServiceMock.object,
            translatorServiceMock.object,
            dialogServiceMock.object,
            trackOrderingMock.object,
            desktopMock.object,
            loggerMock.object
        );
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: TrackBrowserComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define trackOrderEnum', () => {
            // Arrange

            // Act
            const component: TrackBrowserComponent = createComponent();

            // Assert
            expect(component.trackOrderEnum).toBeDefined();
        });

        it('should define tracks as empty', () => {
            // Arrange

            // Act
            const component: TrackBrowserComponent = createComponent();

            // Assert
            expect(component.tracks).toBeDefined();
            expect(component.tracks.tracks.length).toEqual(0);
        });

        it('should declare selectedTrackOrder', () => {
            // Arrange

            // Act
            const component: TrackBrowserComponent = createComponent();

            // Assert
            expect(component.selectedTrackOrder).toBeUndefined();
        });

        it('should declare tracksPersister', () => {
            // Arrange

            // Act
            const component: TrackBrowserComponent = createComponent();

            // Assert
            expect(component.tracksPersister).toBeUndefined();
        });

        it('should declare trackContextMenu', () => {
            // Arrange

            // Act
            const component: TrackBrowserComponent = createComponent();

            // Assert
            expect(component.trackContextMenu).toBeUndefined();
        });
    });

    describe('tracks', () => {
        it('should set and get the tracks', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.tracksPersister = tracksPersisterMock.object;
            component.ngOnInit();

            // Act
            component.tracks = tracks;

            // Assert
            expect(component.tracks).toBe(tracks);
        });

        it('should initialize mouseSelectionWatcher using tracks', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.tracksPersister = tracksPersisterMock.object;
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

        it('should order the tracks by the selected track order', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracksPersister = tracksPersisterMock.object;
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.ngOnInit();

            // Act
            component.tracks = tracks;

            // Assert
            expect(component.orderedTracks[0]).toBe(trackModel4);
            expect(component.orderedTracks[1]).toBe(trackModel3);
            expect(component.orderedTracks[2]).toBe(trackModel2);
            expect(component.orderedTracks[3]).toBe(trackModel1);
        });

        it('should set the playing track', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.tracksPersister = tracksPersisterMock.object;
            component.ngOnInit();

            playbackIndicationServiceMock.reset();

            // Act
            component.tracks = tracks;

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(component.orderedTracks, trackModel1), Times.exactly(1));
        });
    });

    describe('ngOnInit', () => {
        it('should set the playing track on playback started', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.tracksPersister = tracksPersisterMock.object;
            playbackIndicationServiceMock.reset();

            // Act
            component.ngOnInit();
            playbackStartedMock.next(new PlaybackStarted(trackModel1, false));

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(component.orderedTracks, trackModel1), Times.exactly(1));
        });

        it('should clear the playing track on playback stopped', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.tracksPersister = tracksPersisterMock.object;

            // Act
            component.ngOnInit();
            playbackStoppedMock.next();

            // Assert
            playbackIndicationServiceMock.verify((x) => x.clearPlayingTrack(component.orderedTracks), Times.exactly(1));
        });

        it('should update the rating for a track that has the same path as the track for which rating was saved', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracks = tracks;

            const track5 = new Track('Path 1');
            track5.rating = 5;

            const trackModel5: TrackModel = new TrackModel(track5, dateTimeMock.object, translatorServiceMock.object);

            // Act
            component.ngOnInit();
            metadataService_ratingSaved.next(trackModel5);

            // Assert
            expect(track1.rating).toEqual(5);
            expect(track2.rating).toEqual(2);
            expect(track3.rating).toEqual(3);
            expect(track4.rating).toEqual(4);
        });

        it('should update the love for a track that has the same path as the track for which love was saved', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracks = tracks;

            const track5 = new Track('Path 1');
            track5.love = 1;

            const trackModel5: TrackModel = new TrackModel(track5, dateTimeMock.object, translatorServiceMock.object);

            // Act
            component.ngOnInit();
            metadataService_loveSaved.next(trackModel5);

            // Assert
            expect(track1.love).toEqual(1);
            expect(track2.love).toEqual(0);
            expect(track3.love).toEqual(0);
            expect(track4.love).toEqual(0);
        });
    });

    describe('setSelectedTracks', () => {
        it('should set the selected item on mouseSelectionWatcher', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.tracksPersister = tracksPersisterMock.object;
            const event: any = {};

            // Act
            component.setSelectedTracks(event, trackModel2);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.setSelectedItems(event, trackModel2), Times.exactly(1));
        });
    });

    describe('toggleTrackOrder', () => {
        it('should change TrackOrder from byTrackTitleAscending to byTrackTitleDescending', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracksPersister = tracksPersisterMock.object;
            component.selectedTrackOrder = TrackOrder.byTrackTitleAscending;
            component.tracks = tracks;

            // Act
            component.toggleTrackOrder();

            // Assert
            expect(component.selectedTrackOrder).toEqual(TrackOrder.byTrackTitleDescending);
            expect(component.orderedTracks[0]).toBe(trackModel4);
            expect(component.orderedTracks[0].showHeader).toBeFalsy();
            expect(component.orderedTracks[1]).toBe(trackModel3);
            expect(component.orderedTracks[1].showHeader).toBeFalsy();
            expect(component.orderedTracks[2]).toBe(trackModel2);
            expect(component.orderedTracks[2].showHeader).toBeFalsy();
            expect(component.orderedTracks[3]).toBe(trackModel1);
            expect(component.orderedTracks[3].showHeader).toBeFalsy();
        });

        it('should change TrackOrder from byTrackTitleDescending to byAlbum', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracksPersister = tracksPersisterMock.object;
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            component.tracks = tracks;

            // Act
            component.toggleTrackOrder();

            // Assert
            expect(component.selectedTrackOrder).toEqual(TrackOrder.byAlbum);
            expect(component.orderedTracks[0]).toBe(trackModel1);
            expect(component.orderedTracks[0].showHeader).toBeTruthy();
            expect(component.orderedTracks[1]).toBe(trackModel2);
            expect(component.orderedTracks[1].showHeader).toBeTruthy();
            expect(component.orderedTracks[2]).toBe(trackModel3);
            expect(component.orderedTracks[2].showHeader).toBeTruthy();
            expect(component.orderedTracks[3]).toBe(trackModel4);
            expect(component.orderedTracks[3].showHeader).toBeFalsy();
        });

        it('should change TrackOrder from byAlbum to byTrackTitleAscending', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracksPersister = tracksPersisterMock.object;
            component.selectedTrackOrder = TrackOrder.byAlbum;
            component.tracks = tracks;

            // Act
            component.toggleTrackOrder();

            // Assert
            expect(component.selectedTrackOrder).toEqual(TrackOrder.byTrackTitleAscending);
            expect(component.orderedTracks[0]).toBe(trackModel1);
            expect(component.orderedTracks[0].showHeader).toBeFalsy();
            expect(component.orderedTracks[1]).toBe(trackModel2);
            expect(component.orderedTracks[1].showHeader).toBeFalsy();
            expect(component.orderedTracks[2]).toBe(trackModel3);
            expect(component.orderedTracks[2].showHeader).toBeFalsy();
            expect(component.orderedTracks[3]).toBe(trackModel4);
            expect(component.orderedTracks[3].showHeader).toBeFalsy();
        });

        it('should persist the selected track order', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracksPersister = tracksPersisterMock.object;
            component.selectedTrackOrder = TrackOrder.byAlbum;

            // Act
            component.toggleTrackOrder();

            // Assert
            tracksPersisterMock.verify((x) => x.setSelectedTrackOrder(TrackOrder.byTrackTitleAscending), Times.exactly(1));
        });

        it('should set the playing track', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracksPersister = tracksPersisterMock.object;
            component.selectedTrackOrder = TrackOrder.byAlbum;

            // Act
            component.toggleTrackOrder();

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(component.orderedTracks, trackModel1), Times.exactly(1));
        });
    });

    describe('tracksPersister', () => {
        it('should set and return tracksPersister', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracksPersister = tracksPersisterMock.object;

            // Act
            const persister: BaseTracksPersister = component.tracksPersister;

            // Assert
            expect(persister).toBe(tracksPersisterMock.object);
        });

        it('should set the selected track order', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.selectedTrackOrder = TrackOrder.byTrackTitleAscending;
            tracksPersisterMock.reset();
            tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byAlbum);

            // Act
            component.tracksPersister = tracksPersisterMock.object;

            // Assert
            expect(component.selectedTrackOrder).toEqual(TrackOrder.byAlbum);
        });

        it('should change TrackOrder from byTrackTitleAscending to byTrackTitleDescending', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracks = tracks;
            component.selectedTrackOrder = TrackOrder.byTrackTitleAscending;
            tracksPersisterMock.reset();
            tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleDescending);

            // Act
            component.tracksPersister = tracksPersisterMock.object;

            // Assert
            expect(component.selectedTrackOrder).toEqual(TrackOrder.byTrackTitleDescending);
            expect(component.orderedTracks[0]).toBe(trackModel4);
            expect(component.orderedTracks[0].showHeader).toBeFalsy();
            expect(component.orderedTracks[1]).toBe(trackModel3);
            expect(component.orderedTracks[1].showHeader).toBeFalsy();
            expect(component.orderedTracks[2]).toBe(trackModel2);
            expect(component.orderedTracks[2].showHeader).toBeFalsy();
            expect(component.orderedTracks[3]).toBe(trackModel1);
            expect(component.orderedTracks[3].showHeader).toBeFalsy();
        });

        it('should change TrackOrder from byTrackTitleDescending to byAlbum', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracks = tracks;
            component.selectedTrackOrder = TrackOrder.byTrackTitleAscending;
            tracksPersisterMock.reset();
            tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byAlbum);

            // Act
            component.tracksPersister = tracksPersisterMock.object;

            // Assert
            expect(component.selectedTrackOrder).toEqual(TrackOrder.byAlbum);
            expect(component.orderedTracks[0]).toBe(trackModel1);
            expect(component.orderedTracks[0].showHeader).toBeTruthy();
            expect(component.orderedTracks[1]).toBe(trackModel2);
            expect(component.orderedTracks[1].showHeader).toBeTruthy();
            expect(component.orderedTracks[2]).toBe(trackModel3);
            expect(component.orderedTracks[2].showHeader).toBeTruthy();
            expect(component.orderedTracks[3]).toBe(trackModel4);
            expect(component.orderedTracks[3].showHeader).toBeFalsy();
        });

        it('should change TrackOrder from byAlbum to byTrackTitleAscending', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            component.tracks = tracks;
            component.selectedTrackOrder = TrackOrder.byTrackTitleDescending;
            tracksPersisterMock.reset();
            tracksPersisterMock.setup((x) => x.getSelectedTrackOrder()).returns(() => TrackOrder.byTrackTitleAscending);

            // Act
            component.tracksPersister = tracksPersisterMock.object;

            // Assert
            expect(component.selectedTrackOrder).toEqual(TrackOrder.byTrackTitleAscending);
            expect(component.orderedTracks[0]).toBe(trackModel1);
            expect(component.orderedTracks[0].showHeader).toBeFalsy();
            expect(component.orderedTracks[1]).toBe(trackModel2);
            expect(component.orderedTracks[1].showHeader).toBeFalsy();
            expect(component.orderedTracks[2]).toBe(trackModel3);
            expect(component.orderedTracks[2].showHeader).toBeFalsy();
            expect(component.orderedTracks[3]).toBe(trackModel4);
            expect(component.orderedTracks[3].showHeader).toBeFalsy();
        });

        it('should set the playing track', () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();

            // Act
            component.tracksPersister = tracksPersisterMock.object;

            // Assert
            playbackIndicationServiceMock.verify((x) => x.setPlayingTrack(component.orderedTracks, trackModel1), Times.exactly(1));
        });
    });

    describe('onAddToQueueAsync', () => {
        it('should add the selected tracks to the queue', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel1, trackModel2]);
            const component: TrackBrowserComponent = createComponent();

            // Act
            await component.onAddToQueueAsync();

            // Assert
            playbackServiceMock.verify((x) => x.addTracksToQueueAsync([trackModel1, trackModel2]), Times.once());
        });
    });

    describe('onTrackContextMenuAsync', () => {
        it('should open the track context menu', async () => {
            // Arrange
            const component: TrackBrowserComponent = createComponent();
            const event: any = {};

            // Act
            component.onTrackContextMenuAsync(event, trackModel2);

            // Assert
            contextMenuOpenerMock.verify((x) => x.open(component.trackContextMenu, event, trackModel2), Times.once());
        });
    });

    describe('onDeleteAsync', () => {
        it('should show confirmation dialog with singular text when 1 track is provided', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel1]);
            const component: TrackBrowserComponent = createComponent();

            // Act
            await component.onDeleteAsync();

            // Assert
            dialogServiceMock.verify((x) => x.showConfirmationDialogAsync('delete-song', 'confirm-delete-song'), Times.once());
        });

        it('should show confirmation dialog with plural text when more than 1 track is provided', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel1, trackModel2]);
            const component: TrackBrowserComponent = createComponent();

            // Act
            await component.onDeleteAsync();

            // Assert
            dialogServiceMock.verify((x) => x.showConfirmationDialogAsync('delete-songs', 'confirm-delete-songs'), Times.once());
        });

        it('should not delete tracks if the user has not confirmed', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel1, trackModel2]);
            dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('delete-songs', 'confirm-delete-songs'))
                .returns(async () => false);
            const component: TrackBrowserComponent = createComponent();

            // Act
            await component.onDeleteAsync();

            // Assert
            collectionServiceMock.verify((x) => x.deleteTracksAsync(It.isAny()), Times.never());
        });

        it('should delete tracks if the user has confirmed', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel1, trackModel2]);
            dialogServiceMock.setup((x) => x.showConfirmationDialogAsync('delete-songs', 'confirm-delete-songs')).returns(async () => true);
            const component: TrackBrowserComponent = createComponent();

            // Act
            await component.onDeleteAsync();

            // Assert
            collectionServiceMock.verify((x) => x.deleteTracksAsync([trackModel1, trackModel2]), Times.once());
        });
    });

    describe('onShowInFolder', () => {
        it('should not show in folder if there are no tracks selected', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => []);
            const component: TrackBrowserComponent = createComponent();

            // Act
            await component.onShowInFolder();

            // Assert
            desktopMock.verify((x) => x.showFileInDirectory(It.isAny()), Times.never());
        });

        it('should show the first selected track in folder if there are tracks selected', async () => {
            // Arrange
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [trackModel1, trackModel2]);
            const component: TrackBrowserComponent = createComponent();

            // Act
            await component.onShowInFolder();

            // Assert
            desktopMock.verify((x) => x.showFileInDirectory(trackModel1.path), Times.once());
        });
    });
});
