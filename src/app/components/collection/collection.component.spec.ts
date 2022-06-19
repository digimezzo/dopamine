import { IMock, Mock, Times } from 'typemoq';
import { BaseSettings } from '../../common/settings/base-settings';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { BaseSearchService } from '../../services/search/base-search.service';
import { CollectionPersister } from './collection-persister';
import { CollectionComponent } from './collection.component';

describe('CollectionComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let settingsMock: IMock<BaseSettings>;
    let playbackServiceMock: IMock<BasePlaybackService>;
    let searchServiceMock: IMock<BaseSearchService>;
    let collectionPersisterMock: IMock<CollectionPersister>;

    function createComponent(): CollectionComponent {
        return new CollectionComponent(
            appearanceServiceMock.object,
            settingsMock.object,
            playbackServiceMock.object,
            searchServiceMock.object,
            collectionPersisterMock.object
        );
    }

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        settingsMock = Mock.ofType<BaseSettings>();
        playbackServiceMock = Mock.ofType<BasePlaybackService>();
        searchServiceMock = Mock.ofType<BaseSearchService>();
        collectionPersisterMock = Mock.ofType<CollectionPersister>();

        collectionPersisterMock.setup((x) => x.getSelectedTabIndex()).returns(() => 3);
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
            const component: CollectionComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.appearanceService).toBeDefined();
        });

        it('should define settings', async () => {
            // Arrange
            const component: CollectionComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.settings).toBeDefined();
        });
    });

    describe('ngOnInit', () => {
        it('should set the selected index from the settings', async () => {
            // Arrange
            const component: CollectionComponent = createComponent();

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.selectedIndex).toEqual(3);
        });
    });

    describe('selectedIndex', () => {
        it('should save the select tab index to the settings', () => {
            // Arrange
            const component: CollectionComponent = createComponent();

            // Act
            component.selectedIndex = 2;

            // Assert
            collectionPersisterMock.verify((x) => x.setSelectedTabFromTabIndex(2), Times.exactly(1));
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
