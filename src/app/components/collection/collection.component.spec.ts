import { IMock, Mock, Times } from 'typemoq';
import { Constants } from '../../common/application/constants';
import { BaseSettings } from '../../common/settings/base-settings';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { BaseSearchService } from '../../services/search/base-search.service';
import { CollectionComponent } from './collection.component';
import { TabSelectionGetter } from './tab-selection-getter';

describe('CollectionComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let settingsMock: IMock<BaseSettings>;
    let playbackServiceMock: IMock<BasePlaybackService>;
    let searchServiceMock: IMock<BaseSearchService>;
    let collectionPersisterStub: any;
    let tabSelectionGetterMock: IMock<TabSelectionGetter>;

    function createComponent(): CollectionComponent {
        return new CollectionComponent(
            appearanceServiceMock.object,
            settingsMock.object,
            playbackServiceMock.object,
            searchServiceMock.object,
            collectionPersisterStub,
            tabSelectionGetterMock.object
        );
    }

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        settingsMock = Mock.ofType<BaseSettings>();
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        searchServiceMock = Mock.ofType<BaseSearchService>();
        collectionPersisterStub = {};
        tabSelectionGetterMock = Mock.ofType<TabSelectionGetter>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: CollectionComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define appearanceService', async () => {
            // Arrange

            // Act
            const component: CollectionComponent = createComponent();

            // Assert
            expect(component.appearanceService).toBeDefined();
        });

        it('should define settings', async () => {
            // Arrange

            // Act
            const component: CollectionComponent = createComponent();

            // Assert
            expect(component.settings).toBeDefined();
        });
    });

    describe('artistsTablabel', () => {
        it('should return Constants.artistsTablabel', async () => {
            // Arrange
            const component: CollectionComponent = createComponent();

            // Act

            // Assert
            expect(component.artistsTabLabel).toEqual(Constants.artistsTabLabel);
        });
    });

    describe('genresTablabel', () => {
        it('should return Constants.genresTablabel', async () => {
            // Arrange
            const component: CollectionComponent = createComponent();

            // Act

            // Assert
            expect(component.genresTabLabel).toEqual(Constants.genresTabLabel);
        });
    });

    describe('albumsTablabel', () => {
        it('should return Constants.albumsTablabel', async () => {
            // Arrange
            const component: CollectionComponent = createComponent();

            // Act

            // Assert
            expect(component.albumsTabLabel).toEqual(Constants.albumsTabLabel);
        });
    });

    describe('tracksTablabel', () => {
        it('should return Constants.tracksTablabel', async () => {
            // Arrange
            const component: CollectionComponent = createComponent();

            // Act

            // Assert
            expect(component.tracksTabLabel).toEqual(Constants.tracksTabLabel);
        });
    });

    describe('playlistsTablabel', () => {
        it('should return Constants.playlistsTablabel', async () => {
            // Arrange
            const component: CollectionComponent = createComponent();

            // Act

            // Assert
            expect(component.playlistsTabLabel).toEqual(Constants.playlistsTabLabel);
        });
    });

    describe('foldersTablabel', () => {
        it('should return Constants.foldersTablabel', async () => {
            // Arrange
            const component: CollectionComponent = createComponent();

            // Act

            // Assert
            expect(component.foldersTabLabel).toEqual(Constants.foldersTabLabel);
        });
    });

    describe('selectedIndex', () => {
        it('should set selected index and get tab label for selected index and set it as selected tab in collectionPersister', async () => {
            // Arrange
            const component: CollectionComponent = createComponent();

            // Act
            component.selectedIndex = 3;

            // Assert
            expect(component.selectedIndex).toEqual(3);
            tabSelectionGetterMock.verify((x) => x.getTabLabelForIndex(3), Times.once());
        });
    });

    describe('ngAfterViewInit', () => {
        it('should get tab index for tab label and set selected index', async () => {
            // Arrange
            const component: CollectionComponent = createComponent();
            tabSelectionGetterMock.setup((x) => x.getTabIndexForLabel('playlists')).returns(() => 4);
            collectionPersisterStub.selectedTab = 'playlists';

            // Act
            component.ngOnInit();

            // Assert
            tabSelectionGetterMock.verify((x) => x.getTabIndexForLabel('playlists'), Times.once());
            expect(component.selectedIndex).toEqual(4);
        });
    });

    describe('handleKeyboardEvent', () => {
        it('should toggle playback when space is pressed and while not searching', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keyup');
            keyboardEventMock.setup((x) => x.key).returns(() => ' ');
            searchServiceMock.setup((x) => x.isSearching).returns(() => false);
            const component: CollectionComponent = createComponent();

            // Act
            component.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            playbackServiceMock.verify((x) => x.togglePlayback(), Times.once());
        });

        it('should not toggle playback when space is pressed and while searching', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keyup');
            keyboardEventMock.setup((x) => x.key).returns(() => ' ');
            searchServiceMock.setup((x) => x.isSearching).returns(() => true);
            const component: CollectionComponent = createComponent();

            // Act
            component.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            playbackServiceMock.verify((x) => x.togglePlayback(), Times.never());
        });

        it('should not toggle playback when another key then space is pressed', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keyup');
            keyboardEventMock.setup((x) => x.key).returns(() => 'a');
            const component: CollectionComponent = createComponent();

            // Act
            component.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            playbackServiceMock.verify((x) => x.togglePlayback(), Times.never());
        });
    });
});
