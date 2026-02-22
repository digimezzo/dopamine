import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { AddToPlaylistMenu } from '../../../add-to-playlist-menu';
import { GenresPersister } from '../genres-persister';
import { GenreBrowserComponent } from './genre-browser.component';
import { GenreOrder, genreOrderKey } from './genre-order';
import { PlaybackService } from '../../../../../services/playback/playback.service';
import { SemanticZoomServiceBase } from '../../../../../services/semantic-zoom/semantic-zoom.service.base';
import { ApplicationServiceBase } from '../../../../../services/application/application.service.base';
import { MouseSelectionWatcher } from '../../../mouse-selection-watcher';
import { ContextMenuOpener } from '../../../context-menu-opener';
import { SemanticZoomHeaderAdder } from '../../../../../common/semantic-zoom-header-adder';
import { Logger } from '../../../../../common/logger';
import { SchedulerBase } from '../../../../../common/scheduling/scheduler.base';
import { TranslatorServiceBase } from '../../../../../services/translator/translator.service.base';
import { GenreModel } from '../../../../../services/genre/genre-model';
import { Constants } from '../../../../../common/application/constants';
import { GuidFactory } from '../../../../../common/guid.factory';
import { GenreSorter } from '../../../../../common/sorting/genre-sorter';
import { TrackModels } from '../../../../../services/track/track-models';
import { TrackServiceBase } from '../../../../../services/track/track.service.base';

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

describe('GenreBrowserComponent', () => {
    let trackServiceMock: IMock<TrackServiceBase>;
    let playbackServiceMock: IMock<PlaybackService>;
    let semanticZoomServiceMock: IMock<SemanticZoomServiceBase>;
    let applicationServiceMock: IMock<ApplicationServiceBase>;
    let addToPlaylistMenuMock: IMock<AddToPlaylistMenu>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let contextMenuOpenerMock: IMock<ContextMenuOpener>;
    let genreSorterMock: IMock<GenreSorter>;
    let guidFactoryMock: IMock<GuidFactory>;
    let semanticZoomHeaderAdderMock: IMock<SemanticZoomHeaderAdder>;
    let schedulerMock: IMock<SchedulerBase>;
    let loggerMock: IMock<Logger>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let genresPersisterMock: IMock<GenresPersister>;

    let genre1: GenreModel;
    let genre2: GenreModel;

    let semanticZoomService_zoomOutRequested: Subject<void>;
    let semanticZoomService_zoomInRequested: Subject<string>;
    let applicationService_mouseButtonReleased: Subject<void>;

    function createComponent(): GenreBrowserComponent {
        const semanticZoomHeaderAdder: SemanticZoomHeaderAdder = new SemanticZoomHeaderAdder(guidFactoryMock.object);

        return new GenreBrowserComponent(
            trackServiceMock.object,
            playbackServiceMock.object,
            semanticZoomServiceMock.object,
            applicationServiceMock.object,
            addToPlaylistMenuMock.object,
            contextMenuOpenerMock.object,
            mouseSelectionWatcherMock.object,
            genreSorterMock.object,
            semanticZoomHeaderAdder,
            schedulerMock.object,
            loggerMock.object,
        );
    }

    function createComponentWithSemanticZoomAdderMock(): GenreBrowserComponent {
        return new GenreBrowserComponent(
            trackServiceMock.object,
            playbackServiceMock.object,
            semanticZoomServiceMock.object,
            applicationServiceMock.object,
            addToPlaylistMenuMock.object,
            contextMenuOpenerMock.object,
            mouseSelectionWatcherMock.object,
            genreSorterMock.object,
            semanticZoomHeaderAdderMock.object,
            schedulerMock.object,
            loggerMock.object,
        );
    }

    const flushPromises = () => new Promise(process.nextTick);

    beforeEach(() => {
        trackServiceMock = Mock.ofType<TrackServiceBase>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        semanticZoomServiceMock = Mock.ofType<SemanticZoomServiceBase>();
        applicationServiceMock = Mock.ofType<ApplicationServiceBase>();
        addToPlaylistMenuMock = Mock.ofType<AddToPlaylistMenu>();
        contextMenuOpenerMock = Mock.ofType<ContextMenuOpener>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        genreSorterMock = Mock.ofType<GenreSorter>();
        semanticZoomHeaderAdderMock = Mock.ofType<SemanticZoomHeaderAdder>();
        guidFactoryMock = Mock.ofType<GuidFactory>();
        schedulerMock = Mock.ofType<SchedulerBase>();
        loggerMock = Mock.ofType<Logger>();
        playbackServiceMock = Mock.ofType<PlaybackService>();
        genresPersisterMock = Mock.ofType<GenresPersister>();

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

        genre1 = new GenreModel('One genre', translatorServiceMock.object);
        genre2 = new GenreModel('Two genre', translatorServiceMock.object);

        genreSorterMock.setup((x) => x.sortAscending([])).returns(() => []);
        genreSorterMock.setup((x) => x.sortDescending([])).returns(() => []);
        genreSorterMock.setup((x) => x.sortAscending(It.isAny())).returns(() => [genre1, genre2]);
        genreSorterMock.setup((x) => x.sortDescending(It.isAny())).returns(() => [genre2, genre1]);
        translatorServiceMock.setup((x) => x.get('unknown-genre')).returns(() => 'Unknown genre');
        genresPersisterMock.setup((x) => x.getSelectedGenres([genre1, genre2])).returns(() => [genre2]);
        genresPersisterMock.setup((x) => x.getSelectedGenreOrder()).returns(() => GenreOrder.byGenreDescending);

        semanticZoomHeaderAdderMock.setup((x) => x.addZoomHeaders(It.isAny())).returns(() => [genre2, genre1]);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: GenreBrowserComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define orderedGenres as empty', () => {
            // Arrange

            // Act
            const component: GenreBrowserComponent = createComponent();

            // Assert
            expect(component.orderedGenres).toBeDefined();
            expect(component.orderedGenres.length).toEqual(0);
        });

        it('should declare selectedGenreOrder', () => {
            // Arrange

            // Act
            const component: GenreBrowserComponent = createComponent();

            // Assert
            expect(component.selectedGenreOrder).toBeUndefined();
        });

        it('should declare genresPersister', () => {
            // Arrange

            // Act
            const component: GenreBrowserComponent = createComponent();

            // Assert
            expect(component.genresPersister).toBeUndefined();
        });

        it('should define genres', () => {
            // Arrange

            // Act
            const component: GenreBrowserComponent = createComponent();

            // Assert
            expect(component.genres).toBeDefined();
        });

        it('should define playbackService', () => {
            // Arrange

            // Act
            const component: GenreBrowserComponent = createComponent();

            // Assert
            expect(component.playbackService).toBeDefined();
        });

        it('should define mouseSelectionWatcher', () => {
            // Arrange

            // Act
            const component: GenreBrowserComponent = createComponent();

            // Assert
            expect(component.mouseSelectionWatcher).toBeDefined();
        });

        it('should define contextMenuOpener', () => {
            // Arrange

            // Act
            const component: GenreBrowserComponent = createComponent();

            // Assert
            expect(component.contextMenuOpener).toBeDefined();
        });

        it('should define addToPlaylistMenu', () => {
            // Arrange

            // Act
            const component: GenreBrowserComponent = createComponent();

            // Assert
            expect(component.addToPlaylistMenu).toBeDefined();
        });

        it('should declare shouldZoomOut as false', () => {
            // Arrange

            // Act
            const component: GenreBrowserComponent = createComponent();

            // Assert
            expect(component.shouldZoomOut).toBeFalsy();
        });

        it('should define genreOrders', () => {
            // Arrange

            // Act
            const component: GenreBrowserComponent = createComponent();

            // Assert
            expect(component.genreOrders).toEqual([GenreOrder.byGenreAscending, GenreOrder.byGenreDescending]);
        });

        it('should define genreOrderKey', () => {
            // Arrange

            // Act
            const component: GenreBrowserComponent = createComponent();

            // Assert
            expect(component.genreOrderKey).toEqual(genreOrderKey);
        });
    });

    describe('ngOnInit', () => {
        it('should set shouldZoomOut to true when zoom out is requested', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();
            component.shouldZoomOut = false;

            // Act
            component.ngOnInit();
            semanticZoomService_zoomOutRequested.next();

            // Assert
            expect(component.shouldZoomOut).toBeTruthy();
        });

        it('should scroll to zoom header when zoom in is requested', async () => {
            // Arrange
            const component: GenreBrowserComponent = createComponentWithSemanticZoomAdderMock();
            genre1.isZoomHeader = true;
            genre2.isZoomHeader = true;
            component.genresPersister = genresPersisterMock.object;
            component.genres = [genre1, genre2];
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
            const component: GenreBrowserComponent = createComponent();
            component.shouldZoomOut = true;

            // Act
            component.ngOnInit();
            applicationService_mouseButtonReleased.next();

            // Assert
            expect(component.shouldZoomOut).toBeFalsy();
        });
    });

    describe('genres', () => {
        it('should set and get the genres', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();

            // Act
            component.genres = [genre1, genre2];

            // Assert
            expect(component.genres).toEqual([genre1, genre2]);
        });

        it('should initialize mouseSelectionWatcher using genres', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();

            // Act
            component.genres = [genre1, genre2];

            // Assert
            mouseSelectionWatcherMock.verify(
                (x) =>
                    x.initialize(
                        It.is(
                            (genres: GenreModel[]) =>
                                genres.length === 2 &&
                                genres[0].displayName === genre1.displayName &&
                                genres[1].displayName === genre2.displayName,
                        ),
                        false,
                    ),
                Times.once(),
            );
        });

        it('should not order the genres if genresPersister is undefined', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();
            component.selectedGenreOrder = GenreOrder.byGenreAscending;

            // Act
            component.genres = [genre1, genre2];

            // Assert
            expect(component.orderedGenres.length).toEqual(0);
        });

        it('should order the genres by genre ascending if genresPersister is not undefined and if the selected genre order is byGenreAscending', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();
            component.genresPersister = genresPersisterMock.object;
            component.selectedGenreOrder = GenreOrder.byGenreAscending;

            // Act
            component.genres = [genre1, genre2];

            // Assert
            expect(component.orderedGenres[1]).toEqual(genre1);
            expect(component.orderedGenres[3]).toEqual(genre2);
        });

        it('should order the genres by genre descending if genresPersister is not undefined and if the selected genre order is byGenreDescending', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();
            component.genresPersister = genresPersisterMock.object;
            component.selectedGenreOrder = GenreOrder.byGenreDescending;

            // Act
            component.genres = [genre1, genre2];

            // Assert
            expect(component.orderedGenres[1]).toEqual(genre2);
            expect(component.orderedGenres[3]).toEqual(genre1);
        });

        it('should not show the headers for the ordered genres if genresPersister is undefined', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponentWithSemanticZoomAdderMock();
            component.selectedGenreOrder = GenreOrder.byGenreDescending;

            // Act
            component.genres = [genre1, genre2];

            // Assert
            semanticZoomHeaderAdderMock.verify((x) => x.addZoomHeaders(component.orderedGenres), Times.never());
        });

        it('should show the headers for the ordered genres if genresPersister is not undefined', () => {
            // Arrange
            semanticZoomHeaderAdderMock.setup((x) => x.addZoomHeaders([])).returns(() => []);
            semanticZoomHeaderAdderMock.setup((x) => x.addZoomHeaders([genre2, genre1])).returns(() => [genre2, genre1]);

            const component: GenreBrowserComponent = createComponentWithSemanticZoomAdderMock();
            component.genresPersister = genresPersisterMock.object;
            component.selectedGenreOrder = GenreOrder.byGenreDescending;

            // Act
            component.genres = [genre1, genre2];

            // Assert
            semanticZoomHeaderAdderMock.verify(
                (x) =>
                    x.addZoomHeaders(
                        It.is(
                            (genres: GenreModel[]) =>
                                genres.length === 2 &&
                                genres[0].displayName === genre2.displayName &&
                                genres[1].displayName === genre1.displayName,
                        ),
                    ),
                Times.once(),
            );
        });

        it('should not apply the selected genres if genresPersister is undefined', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();
            component.selectedGenreOrder = GenreOrder.byGenreDescending;

            // Act
            component.genres = [genre1, genre2];

            // Assert
            expect(component.genres[0].isSelected).toBeFalsy();
            expect(component.genres[1].isSelected).toBeFalsy();
        });

        it('should apply the selected genres if genresPersister is not undefined', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();
            component.genresPersister = genresPersisterMock.object;
            component.selectedGenreOrder = GenreOrder.byGenreDescending;

            // Act
            component.genres = [genre1, genre2];

            // Assert
            expect(component.genres[0].isSelected).toBeFalsy();
            expect(component.genres[1].isSelected).toBeTruthy();
        });
    });

    describe('genresPersister', () => {
        it('should set and return genresPersister', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();
            component.genres = [genre1, genre2];
            component.genresPersister = genresPersisterMock.object;

            // Act
            const persister: GenresPersister = component.genresPersister;

            // Assert
            expect(persister).toBe(genresPersisterMock.object);
        });

        it('should set the selected genre order', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();
            component.genres = [genre1, genre2];
            component.selectedGenreOrder = GenreOrder.byGenreAscending;
            genresPersisterMock.reset();
            genresPersisterMock.setup((x) => x.getSelectedGenreOrder()).returns(() => GenreOrder.byGenreDescending);

            // Act
            component.genresPersister = genresPersisterMock.object;

            // Assert
            expect(component.selectedGenreOrder).toEqual(GenreOrder.byGenreDescending);
        });

        it('should order the genres by genre ascending if the selected genre order is byGenreAscending', () => {
            // Arrange
            genresPersisterMock.reset();
            genresPersisterMock.setup((x) => x.getSelectedGenreOrder()).returns(() => GenreOrder.byGenreAscending);

            const component: GenreBrowserComponent = createComponent();

            component.genres = [genre1, genre2];

            // Act
            component.genresPersister = genresPersisterMock.object;

            // Assert
            expect(component.orderedGenres[1]).toEqual(genre1);
            expect(component.orderedGenres[3]).toEqual(genre2);
        });

        it('should order the genres by genre descending if the selected genre order is byGenreDescending', () => {
            // Arrange
            genresPersisterMock.reset();
            genresPersisterMock.setup((x) => x.getSelectedGenreOrder()).returns(() => GenreOrder.byGenreDescending);

            const component: GenreBrowserComponent = createComponent();

            component.genres = [genre1, genre2];

            // Act
            component.genresPersister = genresPersisterMock.object;

            // Assert
            expect(component.orderedGenres[1]).toEqual(genre2);
            expect(component.orderedGenres[3]).toEqual(genre1);
        });

        it('should show the headers for the ordered genres', () => {
            // Arrange
            semanticZoomHeaderAdderMock.setup((x) => x.addZoomHeaders([genre2, genre1])).returns(() => [genre2, genre1]);

            genresPersisterMock.reset();
            genresPersisterMock.setup((x) => x.getSelectedGenreOrder()).returns(() => GenreOrder.byGenreDescending);

            const component: GenreBrowserComponent = createComponentWithSemanticZoomAdderMock();

            component.genres = [genre1, genre2];

            // Act
            component.genresPersister = genresPersisterMock.object;

            // Assert
            semanticZoomHeaderAdderMock.verify((x) => x.addZoomHeaders(component.orderedGenres), Times.once());
        });

        it('should apply the selected genres', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();

            component.genres = [genre1, genre2];

            // Act
            component.genresPersister = genresPersisterMock.object;

            // Assert
            expect(component.genres[0].isSelected).toBeFalsy();
            expect(component.genres[1].isSelected).toBeTruthy();
        });
    });

    describe('setSelectedGenres', () => {
        it('should set the selected items on mouseSelectionWatcher if the genre is a not zoom header', () => {
            // Arrange
            const event: any = {};
            const component: GenreBrowserComponent = createComponent();
            component.genres = [genre1, genre2];
            genre1.isZoomHeader = false;
            component.genresPersister = genresPersisterMock.object;

            // Act
            component.setSelectedGenres(event, genre1);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.setSelectedItems(event, genre1), Times.exactly(1));
        });

        it('should not set the selected items on mouseSelectionWatcher if the genre is a zoom header', () => {
            // Arrange
            const event: any = {};
            const component: GenreBrowserComponent = createComponent();
            component.genres = [genre1, genre2];
            genre1.isZoomHeader = true;
            component.genresPersister = genresPersisterMock.object;

            // Act
            component.setSelectedGenres(event, genre1);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.setSelectedItems(event, genre1), Times.never());
        });

        it('should persist the selected genre if the genre is a not zoom header', () => {
            // Arrange

            mouseSelectionWatcherMock.reset();
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [genre1, genre2]);
            const component: GenreBrowserComponent = createComponent();

            const event: any = {};
            component.genres = [genre1, genre2];
            genre1.isZoomHeader = false;
            component.genresPersister = genresPersisterMock.object;

            // Act
            component.setSelectedGenres(event, genre1);

            // Assert
            genresPersisterMock.verify((x) => x.setSelectedGenres([genre1, genre2]), Times.exactly(1));
        });

        it('should not persist the selected genre if the genre is a zoom header', () => {
            // Arrange

            mouseSelectionWatcherMock.reset();
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [genre1, genre2]);
            const component: GenreBrowserComponent = createComponent();

            const event: any = {};
            component.genres = [genre1, genre2];
            genre1.isZoomHeader = true;
            component.genresPersister = genresPersisterMock.object;

            // Act
            component.setSelectedGenres(event, genre1);

            // Assert
            genresPersisterMock.verify((x) => x.setSelectedGenres([genre1, genre2]), Times.never());
        });
    });

    describe('applyGenreOrder', () => {
        it('should apply genre order by genre ascending', () => {
            // Arrange
            genresPersisterMock.reset();
            genresPersisterMock.setup((x) => x.getSelectedGenreOrder()).returns(() => GenreOrder.byGenreDescending);

            const component: GenreBrowserComponent = createComponent();
            component.genres = [genre1, genre2];
            component.genresPersister = genresPersisterMock.object;

            const genreOrder = GenreOrder.byGenreAscending;

            // Act
            component.applyGenreOrder(genreOrder);

            // Assert
            expect(component.selectedGenreOrder).toEqual(genreOrder);
            genresPersisterMock.verify((x) => x.setSelectedGenreOrder(genreOrder), Times.once());
            expect(component.orderedGenres[1]).toEqual(genre1);
            expect(component.orderedGenres[3]).toEqual(genre2);
        });

        it('should apply genre order by genre descending', () => {
            // Arrange
            genresPersisterMock.reset();
            genresPersisterMock.setup((x) => x.getSelectedGenreOrder()).returns(() => GenreOrder.byGenreAscending);

            const component: GenreBrowserComponent = createComponent();
            component.genres = [genre1, genre2];
            component.genresPersister = genresPersisterMock.object;

            const genreOrder = GenreOrder.byGenreDescending;

            // Act
            component.applyGenreOrder(genreOrder);

            // Assert
            expect(component.selectedGenreOrder).toEqual(genreOrder);
            genresPersisterMock.verify((x) => x.setSelectedGenreOrder(genreOrder), Times.once());
            expect(component.orderedGenres[1]).toEqual(genre2);
            expect(component.orderedGenres[3]).toEqual(genre1);
        });

        it('should show the headers for the ordered genres', () => {
            // Arrange
            semanticZoomHeaderAdderMock.setup((x) => x.addZoomHeaders([genre2, genre1])).returns(() => [genre2, genre1]);

            genresPersisterMock.reset();
            genresPersisterMock.setup((x) => x.getSelectedGenreOrder()).returns(() => GenreOrder.byGenreDescending);

            const component: GenreBrowserComponent = createComponentWithSemanticZoomAdderMock();

            component.genres = [genre1, genre2];
            component.genresPersister = genresPersisterMock.object;
            semanticZoomHeaderAdderMock.reset();
            semanticZoomHeaderAdderMock.setup((x) => x.addZoomHeaders([genre1, genre2])).returns(() => [genre1, genre2]);

            // Act
            component.applyGenreOrder(GenreOrder.byGenreAscending);

            // Assert
            semanticZoomHeaderAdderMock.verify((x) => x.addZoomHeaders(component.orderedGenres), Times.once());
        });

        describe('onAddToQueueAsync', () => {
            it('should add the selected genre to the queue', async () => {
                // Arrange
                const component: GenreBrowserComponent = createComponent();

                // Act
                await component.onAddToQueueAsync(genre1);

                // Assert
                playbackServiceMock.verify((x) => x.addGenreToQueueAsync(genre1), Times.once());
            });
        });
    });

    describe('onShuffleAndPlayAsync', () => {
        it('should force shuffle and play the selected genre', async () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();

            // Act
            await component.onShuffleAndPlayAsync(genre1);

            // Assert
            playbackServiceMock.verify((x) => x.forceShuffled(), Times.once());
            playbackServiceMock.verify((x) => x.enqueueAndPlayGenreAsync(genre1), Times.once());
        });
    });

    describe('shuffleAllAsync', () => {
        it('should force shuffle and play all tracks', async () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();
            component.genresPersister = genresPersisterMock.object;
            component.genres = [];

            const tracks: TrackModels = new TrackModels();
            trackServiceMock.setup((x) => x.getVisibleTracks()).returns(() => tracks);

            // Act
            await component.shuffleAllAsync();

            // Assert
            playbackServiceMock.verify((x) => x.forceShuffled(), Times.once());
            playbackServiceMock.verify((x) => x.enqueueAndPlayTracksAsync(tracks.tracks), Times.once());
        });
    });
});
