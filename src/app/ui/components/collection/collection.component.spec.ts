import { IMock, Mock, Times } from 'typemoq';
import { CollectionComponent } from './collection.component';
import { TabSelectionGetter } from './tab-selection-getter';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { SettingsBase } from '../../../common/settings/settings.base';
import { PlaybackServiceBase } from '../../../services/playback/playback.service.base';
import { SearchServiceBase } from '../../../services/search/search.service.base';
import { Constants } from '../../../common/application/constants';
import { AudioVisualizer } from '../../../services/playback/audio-visualizer';
import { DocumentProxy } from '../../../common/io/document-proxy';

describe('CollectionComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let settingsMock: IMock<SettingsBase>;
    let playbackServiceMock: IMock<PlaybackServiceBase>;
    let searchServiceMock: IMock<SearchServiceBase>;
    let collectionPersisterStub: any;
    let tabSelectionGetterMock: IMock<TabSelectionGetter>;
    let audioVisualizerMock: IMock<AudioVisualizer>;
    let documentProxyMock: IMock<DocumentProxy>;

    function createComponent(): CollectionComponent {
        return new CollectionComponent(
            appearanceServiceMock.object,
            settingsMock.object,
            playbackServiceMock.object,
            searchServiceMock.object,
            collectionPersisterStub,
            tabSelectionGetterMock.object,
            audioVisualizerMock.object,
            documentProxyMock.object,
        );
    }

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        settingsMock = Mock.ofType<SettingsBase>();
        playbackServiceMock = Mock.ofType<PlaybackServiceBase>();
        searchServiceMock = Mock.ofType<SearchServiceBase>();
        collectionPersisterStub = {};
        tabSelectionGetterMock = Mock.ofType<TabSelectionGetter>();
        audioVisualizerMock = Mock.ofType<AudioVisualizer>();
        documentProxyMock = Mock.ofType<DocumentProxy>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: CollectionComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act
            const component: CollectionComponent = createComponent();

            // Assert
            expect(component.appearanceService).toBeDefined();
        });

        it('should define settings', () => {
            // Arrange

            // Act
            const component: CollectionComponent = createComponent();

            // Assert
            expect(component.settings).toBeDefined();
        });
    });

    describe('ngAfterViewInit', () => {
        it('should set the audio visualizer', () => {
            // Arrange
            const canvasMock: IMock<HTMLCanvasElement> = Mock.ofType<HTMLCanvasElement>();
            documentProxyMock.setup((x) => x.getCanvasById('collectionAudioVisualizer')).returns(() => canvasMock.object);
            const component: CollectionComponent = createComponent();

            // Act
            jest.useFakeTimers();
            component.ngAfterViewInit();
            jest.runAllTimers();

            // Assert
            audioVisualizerMock.verify((x) => x.connectCanvas(canvasMock.object), Times.once());
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
