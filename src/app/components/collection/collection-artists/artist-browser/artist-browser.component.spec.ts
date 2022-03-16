import { IMock, It, Mock, Times } from 'typemoq';
import { ContextMenuOpener } from '../../../../common/context-menu-opener';
import { HeaderShower } from '../../../../common/header-shower';
import { Logger } from '../../../../common/logger';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { ArtistOrdering } from '../../../../common/ordering/artist-ordering';
import { ArtistModel } from '../../../../services/artist/artist-model';
import { ArtistType } from '../../../../services/artist/artist-type';
import { BasePlaybackService } from '../../../../services/playback/base-playback.service';
import { BaseTranslatorService } from '../../../../services/translator/base-translator.service';
import { AddToPlaylistMenu } from '../../../add-to-playlist-menu';
import { ArtistsPersister } from '../artists-persister';
import { ArtistBrowserComponent } from './artist-browser.component';
import { ArtistOrder } from './artist-order';

describe('ArtistBrowserComponent', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let addToPlaylistMenuMock: IMock<AddToPlaylistMenu>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let contextMenuOpenerMock: IMock<ContextMenuOpener>;
    let artistOrderingMock: IMock<ArtistOrdering>;
    let headerShowerMock: IMock<HeaderShower>;
    let loggerMock: IMock<Logger>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let artistsPersisterMock: IMock<ArtistsPersister>;

    let artist1: ArtistModel;
    let artist2: ArtistModel;

    function createComponent(): ArtistBrowserComponent {
        return new ArtistBrowserComponent(
            playbackServiceMock.object,
            addToPlaylistMenuMock.object,
            mouseSelectionWatcherMock.object,
            contextMenuOpenerMock.object,
            artistOrderingMock.object,
            headerShowerMock.object,
            loggerMock.object
        );
    }

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        addToPlaylistMenuMock = Mock.ofType<AddToPlaylistMenu>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        contextMenuOpenerMock = Mock.ofType<ContextMenuOpener>();
        artistOrderingMock = Mock.ofType<ArtistOrdering>();
        headerShowerMock = Mock.ofType<HeaderShower>();
        loggerMock = Mock.ofType<Logger>();
        playbackServiceMock = Mock.ofType<BasePlaybackService>();

        artistsPersisterMock = Mock.ofType<ArtistsPersister>();
        artist1 = new ArtistModel('artist1', translatorServiceMock.object);
        artist2 = new ArtistModel('artist2', translatorServiceMock.object);

        artistOrderingMock.setup((x) => x.getArtistsOrderedAscending([])).returns(() => []);
        artistOrderingMock.setup((x) => x.getArtistsOrderedDescending([])).returns(() => []);
        artistOrderingMock.setup((x) => x.getArtistsOrderedAscending(It.isAny())).returns(() => [artist1, artist2]);
        artistOrderingMock.setup((x) => x.getArtistsOrderedDescending(It.isAny())).returns(() => [artist2, artist1]);
        translatorServiceMock.setup((x) => x.get('unknown-artist')).returns(() => 'Unknown artist');
        artistsPersisterMock.setup((x) => x.getSelectedArtists([artist1, artist2])).returns(() => [artist2]);
        artistsPersisterMock.setup((x) => x.getSelectedArtistOrder()).returns(() => ArtistOrder.byArtistDescending);
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
                                artists[1].displayName === artist2.displayName
                        ),
                        false
                    ),
                Times.once()
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
            expect(component.orderedArtists[0]).toEqual(artist1);
            expect(component.orderedArtists[1]).toEqual(artist2);
        });

        it('should order the artists by artist descending if artistsPersister is not undefined and if the selected artist order is byArtistDescending', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.artistsPersister = artistsPersisterMock.object;
            component.selectedArtistOrder = ArtistOrder.byArtistDescending;

            // Act
            component.artists = [artist1, artist2];

            // Assert
            expect(component.orderedArtists[0]).toEqual(artist2);
            expect(component.orderedArtists[1]).toEqual(artist1);
        });

        it('should not show the headers for the ordered artists if artistsPersister is undefined', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.selectedArtistOrder = ArtistOrder.byArtistDescending;

            // Act
            component.artists = [artist1, artist2];

            // Assert
            headerShowerMock.verify((x) => x.showHeaders(component.orderedArtists), Times.never());
        });

        it('should show the headers for the ordered artists if artistsPersister is not undefined', () => {
            // Arrange
            const component: ArtistBrowserComponent = createComponent();
            component.artistsPersister = artistsPersisterMock.object;
            component.selectedArtistOrder = ArtistOrder.byArtistDescending;

            // Act
            component.artists = [artist1, artist2];

            // Assert
            headerShowerMock.verify(
                (x) =>
                    x.showHeaders(
                        It.is(
                            (artists: ArtistModel[]) =>
                                artists.length === 2 &&
                                artists[0].displayName === artist2.displayName &&
                                artists[1].displayName === artist1.displayName
                        )
                    ),
                Times.once()
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
            expect(component.orderedArtists[0]).toEqual(artist1);
            expect(component.orderedArtists[1]).toEqual(artist2);
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
            expect(component.orderedArtists[0]).toEqual(artist2);
            expect(component.orderedArtists[1]).toEqual(artist1);
        });

        it('should show the headers for the ordered artists', () => {
            // Arrange
            artistsPersisterMock.reset();
            artistsPersisterMock.setup((x) => x.getSelectedArtistOrder()).returns(() => ArtistOrder.byArtistDescending);

            const component: ArtistBrowserComponent = createComponent();

            component.artists = [artist1, artist2];

            // Act
            component.artistsPersister = artistsPersisterMock.object;

            // Assert
            headerShowerMock.verify((x) => x.showHeaders(component.orderedArtists), Times.once());
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
        it('should set the selected items on mouseSelectionWatcher', () => {
            // Arrange
            const event: any = {};
            const component: ArtistBrowserComponent = createComponent();
            component.artists = [artist1, artist2];
            component.artistsPersister = artistsPersisterMock.object;

            // Act
            component.setSelectedArtists(event, artist1);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.setSelectedItems(event, artist1), Times.exactly(1));
        });

        it('should persist the selected artist', () => {
            // Arrange

            mouseSelectionWatcherMock.reset();
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [artist1, artist2]);
            const component: ArtistBrowserComponent = createComponent();

            const event: any = {};
            component.artists = [artist1, artist2];
            component.artistsPersister = artistsPersisterMock.object;

            // Act
            component.setSelectedArtists(event, artist1);

            // Assert
            artistsPersisterMock.verify((x) => x.setSelectedArtists([artist1, artist2]), Times.exactly(1));
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
            expect(component.orderedArtists[0]).toEqual(artist2);
            expect(component.orderedArtists[1]).toEqual(artist1);
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
            expect(component.orderedArtists[0]).toEqual(artist1);
            expect(component.orderedArtists[1]).toEqual(artist2);
        });

        it('should show the headers for the ordered artists', () => {
            // Arrange
            artistsPersisterMock.reset();
            artistsPersisterMock.setup((x) => x.getSelectedArtistOrder()).returns(() => ArtistOrder.byArtistDescending);

            const component: ArtistBrowserComponent = createComponent();

            component.artists = [artist1, artist2];
            component.artistsPersister = artistsPersisterMock.object;
            headerShowerMock.reset();

            // Act
            component.toggleArtistOrder();

            // Assert
            headerShowerMock.verify((x) => x.showHeaders(component.orderedArtists), Times.once());
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
});
