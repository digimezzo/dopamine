import { IMock, It, Mock, Times } from 'typemoq';
import { ContextMenuOpener } from '../../../../common/context-menu-opener';
import { HeaderShower } from '../../../../common/header-shower';
import { Logger } from '../../../../common/logger';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { GenreOrdering } from '../../../../common/ordering/genre-ordering';
import { GenreModel } from '../../../../services/genre/genre-model';
import { BasePlaybackService } from '../../../../services/playback/base-playback.service';
import { BaseTranslatorService } from '../../../../services/translator/base-translator.service';
import { AddToPlaylistMenu } from '../../../add-to-playlist-menu';
import { GenresPersister } from '../genres-persister';
import { GenreBrowserComponent } from './genre-browser.component';
import { GenreOrder } from './genre-order';

describe('GenreBrowserComponent', () => {
    let playbackServiceMock: IMock<BasePlaybackService>;
    let addToPlaylistMenuMock: IMock<AddToPlaylistMenu>;
    let mouseSelectionWatcherMock: IMock<MouseSelectionWatcher>;
    let contextMenuOpenerMock: IMock<ContextMenuOpener>;
    let genreOrderingMock: IMock<GenreOrdering>;
    let headerShowerMock: IMock<HeaderShower>;
    let loggerMock: IMock<Logger>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let genresPersisterMock: IMock<GenresPersister>;

    let genre1: GenreModel;
    let genre2: GenreModel;

    function createComponent(): GenreBrowserComponent {
        return new GenreBrowserComponent(
            playbackServiceMock.object,
            addToPlaylistMenuMock.object,
            contextMenuOpenerMock.object,
            mouseSelectionWatcherMock.object,
            genreOrderingMock.object,
            headerShowerMock.object,
            loggerMock.object
        );
    }

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        addToPlaylistMenuMock = Mock.ofType<AddToPlaylistMenu>();
        contextMenuOpenerMock = Mock.ofType<ContextMenuOpener>();
        mouseSelectionWatcherMock = Mock.ofType<MouseSelectionWatcher>();
        genreOrderingMock = Mock.ofType<GenreOrdering>();
        headerShowerMock = Mock.ofType<HeaderShower>();
        loggerMock = Mock.ofType<Logger>();
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        genresPersisterMock = Mock.ofType<GenresPersister>();

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
            headerShowerMock.verify((x) => x.showHeaders(component.orderedGenres), Times.never());
        });

        it('should show the headers for the ordered genres if genresPersister is not undefined', () => {
            // Arrange
            const component: GenreBrowserComponent = createComponent();
            component.genresPersister = genresPersisterMock.object;
            component.selectedGenreOrder = GenreOrder.byGenreDescending;

            // Act
            component.genres = [genre1, genre2];

            // Assert
            headerShowerMock.verify(
                (x) =>
                    x.showHeaders(
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
            headerShowerMock.verify((x) => x.showHeaders(component.orderedGenres), Times.once());
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
        it('should set the selected items on mouseSelectionWatcher', () => {
            // Arrange
            const event: any = {};
            const component: GenreBrowserComponent = createComponent();
            component.genres = [genre1, genre2];
            component.genresPersister = genresPersisterMock.object;

            // Act
            component.setSelectedGenres(event, genre1);

            // Assert
            mouseSelectionWatcherMock.verify((x) => x.setSelectedItems(event, genre1), Times.exactly(1));
        });

        it('should persist the selected genre', () => {
            // Arrange

            mouseSelectionWatcherMock.reset();
            mouseSelectionWatcherMock.setup((x) => x.selectedItems).returns(() => [genre1, genre2]);
            const component: GenreBrowserComponent = createComponent();

            const event: any = {};
            component.genres = [genre1, genre2];
            component.genresPersister = genresPersisterMock.object;

            // Act
            component.setSelectedGenres(event, genre1);

            // Assert
            genresPersisterMock.verify((x) => x.setSelectedGenres([genre1, genre2]), Times.exactly(1));
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
            headerShowerMock.reset();

            // Act
            component.toggleGenreOrder();

            // Assert
            headerShowerMock.verify((x) => x.showHeaders(component.orderedGenres), Times.once());
        });
    });
});
