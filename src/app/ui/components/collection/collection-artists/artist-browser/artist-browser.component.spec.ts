import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { AddToPlaylistMenu } from '../../../add-to-playlist-menu';
import { ArtistsPersister } from '../artists-persister';
import { ArtistBrowserComponent } from './artist-browser.component';
import { ArtistOrder } from './artist-order';
import { ArtistModel } from '../../../../../services/artist/artist-model';
import { Logger } from '../../../../../common/logger';
import { ContextMenuOpener } from '../../../context-menu-opener';
import { MouseSelectionWatcher } from '../../../mouse-selection-watcher';
import { SemanticZoomHeaderAdder } from '../../../../../common/semantic-zoom-header-adder';
import { ArtistType } from '../../../../../services/artist/artist-type';
import { Constants } from '../../../../../common/application/constants';
import { PlaybackServiceBase } from '../../../../../services/playback/playback.service.base';
import { SemanticZoomServiceBase } from '../../../../../services/semantic-zoom/semantic-zoom.service.base';
import { ApplicationServiceBase } from '../../../../../services/application/application.service.base';
import { SchedulerBase } from '../../../../../common/scheduling/scheduler.base';
import { TranslatorServiceBase } from '../../../../../services/translator/translator.service.base';
import { GuidFactory } from '../../../../../common/guid.factory';
import { ArtistSorter } from '../../../../../common/sorting/artist-sorter';

export class CdkVirtualScrollViewportMock {
    private _scrollToIndexIndex: number = -1;
    private _scrollToIndexBehavior: ScrollBehavior | undefined;

    public get scrollToIndexIndex(): number {
        return this._scrollToIndexIndex;
    }

    public get scrollToIndexbehavior(): ScrollBehavior | undefined {
        return this._scrollToIndexBehavior;
    }

    public scrollToIndex(index: number, behavior?: ScrollBehavior): void {
        this._scrollToIndexIndex = index;
        this._scrollToIndexBehavior = behavior;
    }
}

describe('ArtistBrowserComponent', () => {
    let playbackServiceMock: IMock<PlaybackServiceBase>;
    let semanticZoomServiceMock: IMock<SemanticZoomServiceBase>;
    let applicationServiceMock: IMock<ApplicationServiceBase>;
    let addToPlaylistMenuMock: IMock<AddToPlaylistMenu>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let contextMenuOpenerMock: IMock<ContextMenuOpener>;
    let artistSorterMock: IMock<ArtistSorter>;
    let guidFactoryMock: IMock<GuidFactory>;
    let schedulerMock: IMock<SchedulerBase>;
    let loggerMock: IMock<Logger>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let semanticZoomHeaderAdderMock: IMock<SemanticZoomHeaderAdder>;
    let artistsPersisterMock: IMock<ArtistsPersister>;
    let semanticZoomService_zoomOutRequested: Subject<void>;
    let semanticZoomService_zoomInRequested: Subject<string>;
    let applicationService_mouseButtonReleased: Subject<void>;

    let artist1: ArtistModel;
    let artist2: ArtistModel;

    function createComponent(): ArtistBrowserComponent {
        const semanticZoomHeaderAdder: SemanticZoomHeaderAdder = new SemanticZoomHeaderAdder(guidFactoryMock.object);

        return new ArtistBrowserComponent(
            playbackServiceMock.object,
            semanticZoomServiceMock.object,
            applicationServiceMock.object,
            addToPlaylistMenuMock.object,
            mouseSelectionWatcherMock.object,
            contextMenuOpenerMock.object,
            artistSorterMock.object,
            semanticZoomHeaderAdder,
            schedulerMock.object,
            loggerMock.object,
        );
    }

    function createComponentWithSemanticZoomAdderMock(): ArtistBrowserComponent {
        return new ArtistBrowserComponent(
            playbackServiceMock.object,
            semanticZoomServiceMock.object,
            applicationServiceMock.object,
            addToPlaylistMenuMock.object,
            mouseSelectionWatcherMock.object,
            contextMenuOpenerMock.object,
            artistSorterMock.object,
            semanticZoomHeaderAdderMock.object,
            schedulerMock.object,
            loggerMock.object,
        );
    }

    const flushPromises = () => new Promise(process.nextTick);

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        semanticZoomServiceMock = Mock.ofType<SemanticZoomServiceBase>();
        applicationServiceMock = Mock.ofType<ApplicationServiceBase>();
        addToPlaylistMenuMock = Mock.ofType<AddToPlaylistMenu>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        contextMenuOpenerMock = Mock.ofType<ContextMenuOpener>();
        artistSorterMock = Mock.ofType<ArtistSorter>();
        semanticZoomHeaderAdderMock = Mock.ofType<SemanticZoomHeaderAdder>();
        guidFactoryMock = Mock.ofType<GuidFactory>();
        schedulerMock = Mock.ofType<SchedulerBase>();
        loggerMock = Mock.ofType<Logger>();
        playbackServiceMock = Mock.ofType<PlaybackServiceBase>();

        guidFactoryMock.setup((x) => x.create()).returns(() => '91c70666-8ad0-4037-8590-47f0c453c97d');

        semanticZoomService_zoomOutRequested = new Subject();
        semanticZoomService_zoomInRequested = new Subject();
        applicationService_mouseButtonReleased = new Subject();

        const semanticZoomService_zoomOutRequested$: Observable<void> = semanticZoomService_zoomOutRequested.asObservable();
        const semanticZoomService_zoomInRequested$: Observable<string> = semanticZoomService_zoomInRequested.asObservable();
        const applicationService_mouseButtonReleased$: Observable<void> = applicationService_mouseButtonReleased.asObservable();

        semanticZoomServiceMock.setup((x) => x.zoomOutRequested$).returns(() => semanticZoomService_zoomOutRequested$);
        semanticZoomServiceMock.setup((x) => x.zoomInRequested$).returns(() => semanticZoomService_zoomInRequested$);
        applicationServiceMock.setup((x) => x.mouseButtonReleased$).returns(() => applicationService_mouseButtonReleased$);

        artistsPersisterMock = Mock.ofType<ArtistsPersister>();
        artist1 = new ArtistModel('One artist', translatorServiceMock.object);
        artist2 = new ArtistModel('Two artist', translatorServiceMock.object);

        artistSorterMock.setup((x) => x.sortAscending([])).returns(() => []);
        artistSorterMock.setup((x) => x.sortDescending([])).returns(() => []);
        artistSorterMock.setup((x) => x.sortAscending(It.isAny())).returns(() => [artist1, artist2]);
        artistSorterMock.setup((x) => x.sortDescending(It.isAny())).returns(() => [artist2, artist1]);
        translatorServiceMock.setup((x) => x.get('unknown-artist')).returns(() => 'Unknown artist');
        artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => [artist2]);
        artistsPersisterMock.setup((x) => x.getSelectedArtistOrder()).returns(() => ArtistOrder.byArtistDescending);

        semanticZoomHeaderAdderMock.setup((x) => x.addZoomHeaders(It.isAny())).returns(() => [artist2, artist1]);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: ArtistBrowserComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define orderedArtists as empty', () => {
            // Arrange

            // Act
            const component: ArtistBrowserComponent = createComponent();

            // Assert
            expect(component.orderedArtists).toBeDefined();
            expect(component.orderedArtists.length).toEqual(0);
        });

        it('should define artistOrderEnum', () => {
            // Arrange

            // Act
            const component: ArtistBrowserComponent = createComponent();

            // Assert
            expect(component.artistOrderEnum).toBeDefined();
        });

        it('should declare selectedArtistOrder', () => {
            // Arrange

            // Act
            const component: ArtistBrowserComponent = createComponent();

            // Assert
            expect(component.selectedArtistOrder).toBeUndefined();
        });

        it('should define artistTypeEnum', () => {
            // Arrange

            // Act
            const component: ArtistBrowserComponent = createComponent();

            // Assert
            expect(component.artistTypeEnum).toBeDefined();
        });

        it('should declare selectedArtistType', () => {
            // Arrange

            // Act
            const component: ArtistBrowserComponent = createComponent();

            // Assert
            expect(component.selectedArtistType).toBeUndefined();
        });

        it('should declare artistsPersister', () => {
            // Arrange

            // Act
            const component: ArtistBrowserComponent = createComponent();

            // Assert
            expect(component.artistsPersister).toBeUndefined();
        });

        it('should define artists', () => {
            // Arrange

            // Act
            const component: ArtistBrowserComponent = createComponent();

            // Assert
            expect(component.artists).toBeDefined();
        });

        it('should define playbackService', () => {
            // Arrange

            // Act
            const component: ArtistBrowserComponent = createComponent();

            // Assert
            expect(component.playbackService).toBeDefined();
        });

        it('should define mouseSelectionWatcher', () => {
            // Arrange

            // Act
            const component: ArtistBrowserComponent = createComponent();

            // Assert
            expect(component.mouseSelectionWatcher).toBeDefined();
        });

        it('should define contextMenuOpener', () => {
            // Arrange

            // Act
            const component: ArtistBrowserComponent = createComponent();

            // Assert
            expect(component.contextMenuOpener).toBeDefined();
        });

        it('should define addToPlaylistMenu', () => {
            // Arrange

            // Act
            const component: ArtistBrowserComponent = createComponent();

            // Assert
            expect(component.addToPlaylistMenu).toBeDefined();
        });

        it('should declare shouldZoomOut as false', () => {
            // Arrange

            // Act
            const component: ArtistBrowserComponent = createComponent();

            // Assert
            expect(component.shouldZoomOut).toBeFalsy();
        });
    });

    describe('ngOnInit', () => {
        it('should set shouldZoomOut to true when zoom out is requested', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.shouldZoomOut = false;

            // Act
            component.ngOnInit();
            semanticZoomService_zoomOutRequested.next();

            // Assert
            expect(component.shouldZoomOut).toBeTruthy();
        });

        it('should scroll to zoom header when zoom in is requested', async () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponentWithSemanticZoomAdderMock();
            artist1.isZoomHeader = true;
            artist2.isZoomHeader = true;
            component.artistsPersister = artistsPersisterMock.object;
            component.artists = [artist1, artist2];
            component.shouldZoomOut = true;

            const viewportMockAny: any = new CdkVirtualScrollViewportMock() as any;
            component.viewPort = viewportMockAny;

            // Act
            component.ngOnInit();
            semanticZoomService_zoomInRequested.next('t');
            await flushPromises();

            // Assert
            expect(component.shouldZoomOut).toBeFalsy();
            schedulerMock.verify((x) => x.sleepAsync(Constants.semanticZoomInDelayMilliseconds), Times.once());

            expect(viewportMockAny.scrollToIndexIndex).toEqual(0);
            expect(viewportMockAny.scrollToIndexbehavior).toEqual('smooth');
        });

        it('should set shouldZoomOut to false when mouse button is released', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.shouldZoomOut = true;

            // Act
            component.ngOnInit();
            applicationService_mouseButtonReleased.next();

            // Assert
            expect(component.shouldZoomOut).toBeFalsy();
        });
    });

    describe('artists', () => {
        it('should set and get the artists', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();

            // Act
            component.artists = [artist1, artist2];

            // Assert
            expect(component.artists).toEqual([artist1, artist2]);
        });

        it('should initialize mouseSelectionWatcher using artists', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();

            // Act
            component.artists = [artist1, artist2];

            // Assert
            mouseSelectionWatcherMock.verify(
                (x) =>
                    x.initialize(
                        It.is(
                            (artists: ArtistModel[]) =>
                                artists.length === 2 &&
                                artists[0].displayName === artist1.displayName &&
                                artists[1].displayName === artist2.displayName,
                        ),
                        false,
                    ),
                Times.once(),
            );
        });

        it('should not order the artists if artistsPersister is undefined', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.selectedArtistOrder = ArtistOrder.byArtistAscending;

            // Act
            component.artists = [artist1, artist2];

            // Assert
            expect(component.orderedArtists.length).toEqual(0);
        });

        it('should order the artists by artist ascending if artistsPersister is not undefined and if the selected artist order is byArtistAscending', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.artistsPersister = artistsPersisterMock.object;
            component.selectedArtistOrder = ArtistOrder.byArtistAscending;

            // Act
            component.artists = [artist1, artist2];

            // Assert
            expect(component.orderedArtists[1]).toEqual(artist1);
            expect(component.orderedArtists[3]).toEqual(artist2);
        });

        it('should order the artists by artist descending if artistsPersister is not undefined and if the selected artist order is byArtistDescending', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.artistsPersister = artistsPersisterMock.object;
            component.selectedArtistOrder = ArtistOrder.byArtistDescending;

            // Act
            component.artists = [artist1, artist2];

            // Assert
            expect(component.orderedArtists[1]).toEqual(artist2);
            expect(component.orderedArtists[3]).toEqual(artist1);
        });

        it('should not show the headers for the ordered artists if artistsPersister is undefined', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponentWithSemanticZoomAdderMock();
            component.selectedArtistOrder = ArtistOrder.byArtistDescending;

            // Act
            component.artists = [artist1, artist2];

            // Assert
            semanticZoomHeaderAdderMock.verify((x) => x.addZoomHeaders(component.orderedArtists), Times.never());
        });

        it('should show the headers for the ordered artists if artistsPersister is not undefined', () => {
            // Arrange
            semanticZoomHeaderAdderMock.setup((x) => x.addZoomHeaders([])).returns(() => []);
            semanticZoomHeaderAdderMock.setup((x) => x.addZoomHeaders([artist2, artist1])).returns(() => [artist2, artist1]);

            const component: ArtistBrowserComponent = createComponentWithSemanticZoomAdderMock();
            component.artistsPersister = artistsPersisterMock.object;
            component.selectedArtistOrder = ArtistOrder.byArtistDescending;

            // Act
            component.artists = [artist1, artist2];

            // Assert
            semanticZoomHeaderAdderMock.verify(
                (x) =>
                    x.addZoomHeaders(
                        It.is(
                            (artists: ArtistModel[]) =>
                                artists.length === 2 &&
                                artists[0].displayName === artist2.displayName &&
                                artists[1].displayName === artist1.displayName,
                        ),
                    ),
                Times.once(),
            );
        });

        it('should not apply the selected artists if artistsPersister is undefined', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.selectedArtistOrder = ArtistOrder.byArtistDescending;

            // Act
            component.artists = [artist1, artist2];

            // Assert
            expect(component.artists[0].isSelected).toBeFalsy();
            expect(component.artists[1].isSelected).toBeFalsy();
        });

        it('should apply the selected artists if artistsPersister is not undefined', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.artistsPersister = artistsPersisterMock.object;
            component.selectedArtistOrder = ArtistOrder.byArtistDescending;

            // Act
            component.artists = [artist1, artist2];

            // Assert
            expect(component.artists[0].isSelected).toBeFalsy();
            expect(component.artists[1].isSelected).toBeTruthy();
        });
    });

    describe('artistsPersister', () => {
        it('should set and return artistsPersister', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.artists = [artist1, artist2];
            component.artistsPersister = artistsPersisterMock.object;

            // Act
            const persister: ArtistsPersister = component.artistsPersister;

            // Assert
            expect(persister).toBe(artistsPersisterMock.object);
        });

        it('should set the selected artist order', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.artists = [artist1, artist2];
            component.selectedArtistOrder = ArtistOrder.byArtistAscending;
            artistsPersisterMock.reset();
            artistsPersisterMock.setup((x) => x.getSelectedArtistOrder()).returns(() => ArtistOrder.byArtistDescending);

            // Act
            component.artistsPersister = artistsPersisterMock.object;

            // Assert
            expect(component.selectedArtistOrder).toEqual(ArtistOrder.byArtistDescending);
        });

        it('should order the artists by artist ascending if the selected artist order is byArtistAscending', () => {
            // Arrange
            artistsPersisterMock.reset();
            artistsPersisterMock.setup((x) => x.getSelectedArtistOrder()).returns(() => ArtistOrder.byArtistAscending);

            const component: ArtistBrowserComponent = createComponent();

            component.artists = [artist1, artist2];

            // Act
            component.artistsPersister = artistsPersisterMock.object;

            // Assert
            expect(component.orderedArtists[1]).toEqual(artist1);
            expect(component.orderedArtists[3]).toEqual(artist2);
        });

        it('should order the artists by artist descending if the selected artist order is byArtistDescending', () => {
            // Arrange
            artistsPersisterMock.reset();
            artistsPersisterMock.setup((x) => x.getSelectedArtistOrder()).returns(() => ArtistOrder.byArtistDescending);

            const component: ArtistBrowserComponent = createComponent();

            component.artists = [artist1, artist2];

            // Act
            component.artistsPersister = artistsPersisterMock.object;

            // Assert
            expect(component.orderedArtists[1]).toEqual(artist2);
            expect(component.orderedArtists[3]).toEqual(artist1);
        });

        it('should show the headers for the ordered artists', () => {
            // Arrange
            semanticZoomHeaderAdderMock.setup((x) => x.addZoomHeaders([artist2, artist1])).returns(() => [artist2, artist1]);

            artistsPersisterMock.reset();
            artistsPersisterMock.setup((x) => x.getSelectedArtistOrder()).returns(() => ArtistOrder.byArtistDescending);

            const component: ArtistBrowserComponent = createComponentWithSemanticZoomAdderMock();

            component.artists = [artist1, artist2];

            // Act
            component.artistsPersister = artistsPersisterMock.object;

            // Assert
            semanticZoomHeaderAdderMock.verify((x) => x.addZoomHeaders(component.orderedArtists), Times.once());
        });

        it('should apply the selected artists', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();

            component.artists = [artist1, artist2];

            // Act
            component.artistsPersister = artistsPersisterMock.object;

            // Assert
            expect(component.artists[0].isSelected).toBeFalsy();
            expect(component.artists[1].isSelected).toBeTruthy();
        });
    });

    describe('setSelectedArtists', () => {
        it('should set the selected items on mouseSelectionWatcher if the artist is a not zoom header', () => {
            // Arrange
            const event: any = {};
            const component: ArtistBrowserComponent = createComponent();
            component.artists = [artist1, artist2];
            artist1.isZoomHeader = false;
            component.artistsPersister = artistsPersisterMock.object;

            // Act
            component.setSelectedArtists(event, artist1);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.setSelectedItems(event, artist1), Times.exactly(1));
        });

        it('should not set the selected items on mouseSelectionWatcher if the artist is a zoom header', () => {
            // Arrange
            const event: any = {};
            const component: ArtistBrowserComponent = createComponent();
            component.artists = [artist1, artist2];
            artist1.isZoomHeader = true;
            component.artistsPersister = artistsPersisterMock.object;

            // Act
            component.setSelectedArtists(event, artist1);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.setSelectedItems(event, artist1), Times.never());
        });

        it('should persist the selected artist if the artist is a not zoom header', () => {
            // Arrange

            mouseSelectionWatcherMock.reset();
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [artist1, artist2]);
            const component: ArtistBrowserComponent = createComponent();

            const event: any = {};
            component.artists = [artist1, artist2];
            artist1.isZoomHeader = false;
            component.artistsPersister = artistsPersisterMock.object;

            // Act
            component.setSelectedArtists(event, artist1);

            // Assert
            artistsPersisterMock.verify((x) => x.setSelectedArtists([artist1, artist2]), Times.exactly(1));
        });

        it('should not persist the selected artist if the artist is a zoom header', () => {
            // Arrange

            mouseSelectionWatcherMock.reset();
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [artist1, artist2]);
            const component: ArtistBrowserComponent = createComponent();

            const event: any = {};
            component.artists = [artist1, artist2];
            artist1.isZoomHeader = true;
            component.artistsPersister = artistsPersisterMock.object;

            // Act
            component.setSelectedArtists(event, artist1);

            // Assert
            artistsPersisterMock.verify((x) => x.setSelectedArtists([artist1, artist2]), Times.never());
        });
    });

    describe('toggleArtistOrder', () => {
        it('should toggle selectedArtistOrder from byArtistAscending to byArtistDescending', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.artists = [artist1, artist2];
            component.artistsPersister = artistsPersisterMock.object;
            component.selectedArtistOrder = ArtistOrder.byArtistAscending;

            // Act
            component.toggleArtistOrder();

            // Assert
            expect(component.selectedArtistOrder).toEqual(ArtistOrder.byArtistDescending);
        });

        it('should toggle selectedArtistOrder from byArtistDescending to byArtistAscending', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.artists = [artist1, artist2];
            component.artistsPersister = artistsPersisterMock.object;
            component.selectedArtistOrder = ArtistOrder.byArtistDescending;

            // Act
            component.toggleArtistOrder();

            // Assert
            expect(component.selectedArtistOrder).toEqual(ArtistOrder.byArtistAscending);
        });

        it('should persist the selected artist order', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.artists = [artist1, artist2];
            component.artistsPersister = artistsPersisterMock.object;
            component.selectedArtistOrder = ArtistOrder.byArtistDescending;

            // Act
            component.toggleArtistOrder();

            // Assert
            artistsPersisterMock.verify((x) => x.setSelectedArtistOrder(component.selectedArtistOrder), Times.once());
        });

        it('should order the artists by artist descending if the selected artist order is byArtistAscending', () => {
            // Arrange
            artistsPersisterMock.reset();
            artistsPersisterMock.setup((x) => x.getSelectedArtistOrder()).returns(() => ArtistOrder.byArtistAscending);

            const component: ArtistBrowserComponent = createComponent();

            component.artists = [artist1, artist2];
            component.artistsPersister = artistsPersisterMock.object;

            // Act
            component.toggleArtistOrder();

            // Assert
            expect(component.orderedArtists[1]).toEqual(artist2);
            expect(component.orderedArtists[3]).toEqual(artist1);
        });

        it('should order the artists by artist ascending if the selected artist order is byArtistDescending', () => {
            // Arrange
            artistsPersisterMock.reset();
            artistsPersisterMock.setup((x) => x.getSelectedArtistOrder()).returns(() => ArtistOrder.byArtistDescending);

            const component: ArtistBrowserComponent = createComponent();

            component.artists = [artist1, artist2];
            component.artistsPersister = artistsPersisterMock.object;

            // Act
            component.toggleArtistOrder();

            // Assert
            expect(component.orderedArtists[1]).toEqual(artist1);
            expect(component.orderedArtists[3]).toEqual(artist2);
        });

        it('should show the headers for the ordered artists', () => {
            // Arrange
            semanticZoomHeaderAdderMock.setup((x) => x.addZoomHeaders([artist2, artist1])).returns(() => [artist2, artist1]);

            artistsPersisterMock.reset();
            artistsPersisterMock.setup((x) => x.getSelectedArtistOrder()).returns(() => ArtistOrder.byArtistDescending);

            const component: ArtistBrowserComponent = createComponentWithSemanticZoomAdderMock();

            component.artists = [artist1, artist2];
            component.artistsPersister = artistsPersisterMock.object;
            semanticZoomHeaderAdderMock.reset();
            semanticZoomHeaderAdderMock.setup((x) => x.addZoomHeaders([artist1, artist2])).returns(() => [artist1, artist2]);

            // Act
            component.toggleArtistOrder();

            // Assert
            semanticZoomHeaderAdderMock.verify((x) => x.addZoomHeaders(component.orderedArtists), Times.once());
        });
    });

    describe('toggleArtistType', () => {
        it('should toggle selectedArtistType from trackArtists to albumArtists', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.artists = [artist1, artist2];
            component.artistsPersister = artistsPersisterMock.object;
            component.selectedArtistType = ArtistType.trackArtists;

            // Act
            component.toggleArtistType();

            // Assert
            expect(component.selectedArtistType).toEqual(ArtistType.albumArtists);
        });

        it('should toggle selectedArtistType from albumArtists to allArtists', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.artists = [artist1, artist2];
            component.artistsPersister = artistsPersisterMock.object;
            component.selectedArtistType = ArtistType.albumArtists;

            // Act
            component.toggleArtistType();

            // Assert
            expect(component.selectedArtistType).toEqual(ArtistType.allArtists);
        });

        it('should toggle selectedArtistType from allArtists to trackArtists', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.artists = [artist1, artist2];
            component.artistsPersister = artistsPersisterMock.object;
            component.selectedArtistType = ArtistType.allArtists;

            // Act
            component.toggleArtistType();

            // Assert
            expect(component.selectedArtistType).toEqual(ArtistType.trackArtists);
        });

        it('should persist the selected artist type', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.artists = [artist1, artist2];
            component.artistsPersister = artistsPersisterMock.object;
            component.selectedArtistType = ArtistType.allArtists;

            // Act
            component.toggleArtistType();

            // Assert
            artistsPersisterMock.verify((x) => x.setSelectedArtistType(component.selectedArtistType), Times.once());
        });
    });

    describe('onAddToQueueAsync', () => {
        it('should add the selected artist for the selected artist type to the queue', async () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.selectedArtistType = ArtistType.albumArtists;

            // Act
            await component.onAddToQueueAsync(artist1);

            // Assert
            playbackServiceMock.verify((x) => x.addArtistToQueueAsync(artist1, ArtistType.albumArtists), Times.once());
        });
    });
});
