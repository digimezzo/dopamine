import { IMock, It, Mock, Times } from 'typemoq';
import { ArtistOrdering } from '../../../../common/artist-ordering';
import { HeaderShower } from '../../../../common/header-shower';
import { Logger } from '../../../../common/logger';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { ArtistModel } from '../../../../services/artist/artist-model';
import { ArtistType } from '../../../../services/artist/artist-type';
import { BasePlaybackService } from '../../../../services/playback/base-playback.service';
import { BaseTranslatorService } from '../../../../services/translator/base-translator.service';
import { ArtistsPersister } from '../artists-persister';
import { ArtistBrowserComponent } from './artist-browser.component';
import { ArtistOrder } from './artist-order';

describe('ArtistBrowserComponent', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let artistOrderingMock: IMock<ArtistOrdering>;
    let headerShowerMock: IMock<HeaderShower>;
    let loggerMock: IMock<Logger>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let artistsPersisterMock: IMock<ArtistsPersister>;

    let artist1: ArtistModel;
    let artist2: ArtistModel;

    let component: ArtistBrowserComponent;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        artistOrderingMock = Mock.ofType<ArtistOrdering>();
        headerShowerMock = Mock.ofType<HeaderShower>();
        loggerMock = Mock.ofType<Logger>();
        playbackServiceMock = Mock.ofType<BasePlaybackService>();

        artistsPersisterMock = Mock.ofType<ArtistsPersister>();
        artist1 = new ArtistModel('artist1', translatorServiceMock.object);
        artist2 = new ArtistModel('artist2', translatorServiceMock.object);

        artistOrderingMock.setup((x) => x.getArtistsOrderedAscending([artist1, artist2])).returns(() => [artist1, artist2]);
        artistOrderingMock.setup((x) => x.getArtistsOrderedDescending([artist1, artist2])).returns(() => [artist2, artist1]);
        translatorServiceMock.setup((x) => x.get('unknown-artist')).returns(() => 'Unknown artist');
        artistsPersisterMock.setup((x) => x.getSelectedArtistOrder()).returns(() => ArtistOrder.byArtistDescending);

        component = new ArtistBrowserComponent(
            playbackServiceMock.object,
            mouseSelectionWatcherMock.object,
            artistOrderingMock.object,
            headerShowerMock.object,
            loggerMock.object
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define orderedArtists as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(component.orderedArtists).toBeDefined();
            expect(component.orderedArtists.length).toEqual(0);
        });

        it('should define artistOrderEnum', () => {
            // Arrange

            // Act

            // Assert
            expect(component.artistOrderEnum).toBeDefined();
        });

        it('should declare selectedArtistOrder', () => {
            // Arrange

            // Act

            // Assert
            expect(component.selectedArtistOrder).toBeUndefined();
        });

        it('should define artistTypeEnum', () => {
            // Arrange

            // Act

            // Assert
            expect(component.artistTypeEnum).toBeDefined();
        });

        it('should declare selectedArtistType', () => {
            // Arrange

            // Act

            // Assert
            expect(component.selectedArtistType).toBeUndefined();
        });

        it('should declare artistsPersister', () => {
            // Arrange

            // Act

            // Assert
            expect(component.artistsPersister).toBeUndefined();
        });

        it('should define artists', () => {
            // Arrange

            // Act

            // Assert
            expect(component.artists).toBeDefined();
        });

        it('should define playbackService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.playbackService).toBeDefined();
        });
    });

    describe('artists', () => {
        it('should set and get the artists', () => {
            // Arrange

            // Act
            component.artists = [artist1, artist2];

            // Assert
            expect(component.artists).toEqual([artist1, artist2]);
        });

        it('should initialize mouseSelectionWatcher using artists', () => {
            // Arrange

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

        it('should order the artists by artist ascending if the selected artist order is byArtistAscending', () => {
            // Arrange
            component.selectedArtistOrder = ArtistOrder.byArtistAscending;

            // Act
            component.artists = [artist1, artist2];

            // Assert
            expect(component.orderedArtists[0]).toEqual(artist1);
            expect(component.orderedArtists[1]).toEqual(artist2);
        });

        it('should order the artists by artist descending if the selected artist order is byArtistDescending', () => {
            // Arrange
            component.selectedArtistOrder = ArtistOrder.byArtistDescending;

            // Act
            component.artists = [artist1, artist2];

            // Assert
            expect(component.orderedArtists[0]).toEqual(artist2);
            expect(component.orderedArtists[1]).toEqual(artist1);
        });

        it('should show the headers for the ordered artists', () => {
            // Arrange
            component.selectedArtistOrder = ArtistOrder.byArtistDescending;

            // Act
            component.artists = [artist1, artist2];

            // Assert
            headerShowerMock.verify((x) => x.showHeaders(component.orderedArtists), Times.once());
        });
    });

    describe('artistsPersister', () => {
        it('should set and return artistsPersister', () => {
            // Arrange
            component.artists = [artist1, artist2];
            component.artistsPersister = artistsPersisterMock.object;

            // Act
            const persister: ArtistsPersister = component.artistsPersister;

            // Assert
            expect(persister).toBe(artistsPersisterMock.object);
        });

        it('should set the selected artist order', () => {
            // Arrange
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

            component = new ArtistBrowserComponent(
                playbackServiceMock.object,
                mouseSelectionWatcherMock.object,
                artistOrderingMock.object,
                headerShowerMock.object,
                loggerMock.object
            );

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

            component = new ArtistBrowserComponent(
                playbackServiceMock.object,
                mouseSelectionWatcherMock.object,
                artistOrderingMock.object,
                headerShowerMock.object,
                loggerMock.object
            );

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

            component = new ArtistBrowserComponent(
                playbackServiceMock.object,
                mouseSelectionWatcherMock.object,
                artistOrderingMock.object,
                headerShowerMock.object,
                loggerMock.object
            );

            component.artists = [artist1, artist2];

            // Act
            component.artistsPersister = artistsPersisterMock.object;

            // Assert
            headerShowerMock.verify((x) => x.showHeaders(component.orderedArtists), Times.once());
        });
    });

    describe('setSelectedArtists', () => {
        it('should set the selected items on mouseSelectionWatcher', () => {
            // Arrange
            const event: any = {};
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
            component = new ArtistBrowserComponent(
                playbackServiceMock.object,
                mouseSelectionWatcherMock.object,
                artistOrderingMock.object,
                headerShowerMock.object,
                loggerMock.object
            );

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

            component = new ArtistBrowserComponent(
                playbackServiceMock.object,
                mouseSelectionWatcherMock.object,
                artistOrderingMock.object,
                headerShowerMock.object,
                loggerMock.object
            );

            component.artists = [artist1, artist2];
            component.artistsPersister = artistsPersisterMock.object;

            // Act
            component.toggleArtistOrder();

            // Assert
            expect(component.orderedArtists[0]).toEqual(artist2);
            expect(component.orderedArtists[1]).toEqual(artist1);
        });

        it('should order the genres by genre ascending if the selected genre order is byGenreDescending', () => {
            // Arrange
            artistsPersisterMock.reset();
            artistsPersisterMock.setup((x) => x.getSelectedArtistOrder()).returns(() => ArtistOrder.byArtistDescending);

            component = new ArtistBrowserComponent(
                playbackServiceMock.object,
                mouseSelectionWatcherMock.object,
                artistOrderingMock.object,
                headerShowerMock.object,
                loggerMock.object
            );

            component.artists = [artist1, artist2];
            component.artistsPersister = artistsPersisterMock.object;

            // Act
            component.toggleArtistOrder();

            // Assert
            expect(component.orderedArtists[0]).toEqual(artist1);
            expect(component.orderedArtists[1]).toEqual(artist2);
        });

        it('should show the headers for the ordered genres', () => {
            // Arrange
            artistsPersisterMock.reset();
            artistsPersisterMock.setup((x) => x.getSelectedArtistOrder()).returns(() => ArtistOrder.byArtistDescending);

            component = new ArtistBrowserComponent(
                playbackServiceMock.object,
                mouseSelectionWatcherMock.object,
                artistOrderingMock.object,
                headerShowerMock.object,
                loggerMock.object
            );

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
