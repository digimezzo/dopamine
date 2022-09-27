import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { Constants } from '../../../../common/application/constants';
import { ContextMenuOpener } from '../../../../common/context-menu-opener';
import { Logger } from '../../../../common/logger';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { GenreOrdering } from '../../../../common/ordering/genre-ordering';
import { BaseScheduler } from '../../../../common/scheduling/base-scheduler';
import { SemanticZoomHeaderAdder } from '../../../../common/semantic-zoom-header-adder';
import { BaseApplicationService } from '../../../../services/application/base-application.service';
import { GenreModel } from '../../../../services/genre/genre-model';
import { BasePlaybackService } from '../../../../services/playback/base-playback.service';
import { BaseSemanticZoomService } from '../../../../services/semantic-zoom/base-semantic-zoom.service';
import { BaseTranslatorService } from '../../../../services/translator/base-translator.service';
import { AddToPlaylistMenu } from '../../../add-to-playlist-menu';
import { GenresPersister } from '../genres-persister';
import { GenreBrowserComponent } from './genre-browser.component';
import { GenreOrder } from './genre-order';

export class CdkVirtualScrollViewportMock {
    private _scrollToIndexIndex: number = -1;
    private _scrollToIndexBehavior: ScrollBehavior = undefined;

    public get scrollToIndexIndex() : number {
        return this._scrollToIndexIndex;
    }

    public get scrollToIndexbehavior() : string {
        return this._scrollToIndexBehavior;
    }

    public scrollToIndex(index: number, behavior?: ScrollBehavior): void{
        this._scrollToIndexIndex = index;
        this._scrollToIndexBehavior = behavior;
    }
}

describe('GenreBrowserComponent', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let semanticZoomServiceMock: IMock<BaseSemanticZoomService>;
    let applicationServiceMock: IMock<BaseApplicationService>;
    let addToPlaylistMenuMock: IMock<AddToPlaylistMenu>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let contextMenuOpenerMock: IMock<ContextMenuOpener>;
    let genreOrderingMock: IMock<GenreOrdering>;
    let semanticZoomHeaderAdderMock: IMock<SemanticZoomHeaderAdder>;
    let schedulerMock: IMock<BaseScheduler>;
    let loggerMock: IMock<Logger>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let genresPersisterMock: IMock<GenresPersister>;

    let genre1: GenreModel;
    let genre2: GenreModel;

    let semanticZoomService_zoomOutRequested: Subject<void>;
    let semanticZoomService_zoomInRequested: Subject<string>;
    let applicationService_mouseButtonReleased: Subject<void>;

    function createComponent(): GenreBrowserComponent {
        return new GenreBrowserComponent(
            playbackServiceMock.object,
            semanticZoomServiceMock.object,
            applicationServiceMock.object,
            addToPlaylistMenuMock.object,
            contextMenuOpenerMock.object,
            mouseSelectionWatcherMock.object,
            genreOrderingMock.object,
            semanticZoomHeaderAdderMock.object,
            schedulerMock.object,
            loggerMock.object
        );
    }

    const flushPromises = () => new Promise(process.nextTick);

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        semanticZoomServiceMock = Mock.ofType<BaseSemanticZoomService>();
        applicationServiceMock = Mock.ofType<BaseApplicationService>();
        addToPlaylistMenuMock = Mock.ofType<AddToPlaylistMenu>();
        contextMenuOpenerMock = Mock.ofType<ContextMenuOpener>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        genreOrderingMock = Mock.ofType<GenreOrdering>();
        semanticZoomHeaderAdderMock = Mock.ofType<SemanticZoomHeaderAdder>();
        schedulerMock = Mock.ofType<BaseScheduler>();
        loggerMock = Mock.ofType<Logger>();
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        genresPersisterMock = Mock.ofType<GenresPersister>();

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

        genreOrderingMock.setup((x) => x.getGenresOrderedAscending([])).returns(() => []);
        genreOrderingMock.setup((x) => x.getGenresOrderedDescending([])).returns(() => []);
        genreOrderingMock.setup((x) => x.getGenresOrderedAscending(It.isAny())).returns(() => [genre1, genre2]);
        genreOrderingMock.setup((x) => x.getGenresOrderedDescending(It.isAny())).returns(() => [genre2, genre1]);
        translatorServiceMock.setup((x) => x.get('unknown-genre')).returns(() => 'Unknown genre');
        genresPersisterMock.setup((x) => x.getSelectedGenres([genre1, genre2])).returns(() => [genre2]);
        genresPersisterMock.setup((x) => x.getSelectedGenreOrder()).returns(() => GenreOrder.byGenreDescending);
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

        it('should define genreOrderEnum', () => {
            // Arrange

            // Act
            const component: GenreBrowserComponent = createComponent();

            // Assert
            expect(component.genreOrderEnum).toBeDefined();
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

        it('should scroll to zoom header when zoom in is requested', async() => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();
            genre1.isZoomHeader = true;
            genre2.isZoomHeader = true;
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
            schedulerMock.verify(x => x.sleepAsync(Constants.semanticZoomInDelayMilliseconds), Times.once());

            expect(viewportMockAny.scrollToIndexIndex).toEqual(1);
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
                                genres[1].displayName === genre2.displayName
                        ),
                        false
                    ),
                Times.once()
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
            expect(component.orderedGenres[0]).toEqual(genre1);
            expect(component.orderedGenres[1]).toEqual(genre2);
        });

        it('should order the genres by genre descending if genresPersister is not undefined and if the selected genre order is byGenreDescending', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();
            component.genresPersister = genresPersisterMock.object;
            component.selectedGenreOrder = GenreOrder.byGenreDescending;

            // Act
            component.genres = [genre1, genre2];

            // Assert
            expect(component.orderedGenres[0]).toEqual(genre2);
            expect(component.orderedGenres[1]).toEqual(genre1);
        });

        it('should not show the headers for the ordered genres if genresPersister is undefined', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();
            component.selectedGenreOrder = GenreOrder.byGenreDescending;

            // Act
            component.genres = [genre1, genre2];

            // Assert
            semanticZoomHeaderAdderMock.verify((x) => x.addZoomHeaders(component.orderedGenres), Times.never());
        });

        it('should show the headers for the ordered genres if genresPersister is not undefined', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();
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
                                genres[1].displayName === genre1.displayName
                        )
                    ),
                Times.once()
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
            expect(component.orderedGenres[0]).toEqual(genre1);
            expect(component.orderedGenres[1]).toEqual(genre2);
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
            expect(component.orderedGenres[0]).toEqual(genre2);
            expect(component.orderedGenres[1]).toEqual(genre1);
        });

        it('should show the headers for the ordered genres', () => {
            // Arrange
            genresPersisterMock.reset();
            genresPersisterMock.setup((x) => x.getSelectedGenreOrder()).returns(() => GenreOrder.byGenreDescending);

            const component: GenreBrowserComponent = createComponent();

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

    describe('toggleGenreOrder', () => {
        it('should toggle selectedGenreOrder from byGenreAscending to byGenreDescending', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();
            component.genres = [genre1, genre2];
            component.genresPersister = genresPersisterMock.object;
            component.selectedGenreOrder = GenreOrder.byGenreAscending;

            // Act
            component.toggleGenreOrder();

            // Assert
            expect(component.selectedGenreOrder).toEqual(GenreOrder.byGenreDescending);
        });

        it('should toggle selectedGenreOrder from byGenreDescending to byGenreAscending', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();
            component.genres = [genre1, genre2];
            component.genresPersister = genresPersisterMock.object;
            component.selectedGenreOrder = GenreOrder.byGenreDescending;

            // Act
            component.toggleGenreOrder();

            // Assert
            expect(component.selectedGenreOrder).toEqual(GenreOrder.byGenreAscending);
        });

        it('should persist the selected genre order', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();
            component.genres = [genre1, genre2];
            component.genresPersister = genresPersisterMock.object;
            component.selectedGenreOrder = GenreOrder.byGenreDescending;

            // Act
            component.toggleGenreOrder();

            // Assert
            genresPersisterMock.verify((x) => x.setSelectedGenreOrder(component.selectedGenreOrder), Times.once());
        });

        it('should order the genres by genre descending if the selected genre order is byGenreAscending', () => {
            // Arrange
            genresPersisterMock.reset();
            genresPersisterMock.setup((x) => x.getSelectedGenreOrder()).returns(() => GenreOrder.byGenreAscending);

            const component: GenreBrowserComponent = createComponent();

            component.genres = [genre1, genre2];
            component.genresPersister = genresPersisterMock.object;

            // Act
            component.toggleGenreOrder();

            // Assert
            expect(component.orderedGenres[0]).toEqual(genre2);
            expect(component.orderedGenres[1]).toEqual(genre1);
        });

        it('should order the genres by genre ascending if the selected genre order is byGenreDescending', () => {
            // Arrange
            genresPersisterMock.reset();
            genresPersisterMock.setup((x) => x.getSelectedGenreOrder()).returns(() => GenreOrder.byGenreDescending);

            const component: GenreBrowserComponent = createComponent();

            component.genres = [genre1, genre2];
            component.genresPersister = genresPersisterMock.object;

            // Act
            component.toggleGenreOrder();

            // Assert
            expect(component.orderedGenres[0]).toEqual(genre1);
            expect(component.orderedGenres[1]).toEqual(genre2);
        });

        it('should show the headers for the ordered genres', () => {
            // Arrange
            genresPersisterMock.reset();
            genresPersisterMock.setup((x) => x.getSelectedGenreOrder()).returns(() => GenreOrder.byGenreDescending);

            const component: GenreBrowserComponent = createComponent();

            component.genres = [genre1, genre2];
            component.genresPersister = genresPersisterMock.object;
            semanticZoomHeaderAdderMock.reset();

            // Act
            component.toggleGenreOrder();

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
});
