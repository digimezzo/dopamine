import { IMock, Mock, Times } from 'typemoq';
import { CollectionComponent } from './collection.component';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { SettingsBase } from '../../../common/settings/settings.base';
import { AudioVisualizer } from '../../../services/playback/audio-visualizer';
import { DocumentProxy } from '../../../common/io/document-proxy';
import { CollectionNavigationService } from '../../../services/collection-navigation/collection-navigation.service';
import { PlaybackService } from '../../../services/playback/playback.service';

describe('CollectionComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let collectionNavigationServiceMock: IMock<CollectionNavigationService>;
    let settingsMock: IMock<SettingsBase>;
    let playbackServiceMock: IMock<PlaybackService>;
    let audioVisualizerMock: IMock<AudioVisualizer>;
    let documentProxyMock: IMock<DocumentProxy>;

    const collectionNavigationServiceStub: any = { page: 0 };

    function createComponent(): CollectionComponent {
        return new CollectionComponent(
            appearanceServiceMock.object,
            collectionNavigationServiceMock.object,
            settingsMock.object,
            playbackServiceMock.object,
            audioVisualizerMock.object,
            documentProxyMock.object,
        );
    }

    function createComponentUsingStub(): CollectionComponent {
        return new CollectionComponent(
            appearanceServiceMock.object,
            collectionNavigationServiceStub,
            settingsMock.object,
            playbackServiceMock.object,
            audioVisualizerMock.object,
            documentProxyMock.object,
        );
    }

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        collectionNavigationServiceMock = Mock.ofType<CollectionNavigationService>();
        settingsMock = Mock.ofType<SettingsBase>();
        playbackServiceMock = Mock.ofType<PlaybackService>();
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

        it('should set page', () => {
            // Arrange
            collectionNavigationServiceMock.setup((x) => x.page).returns(() => 3);

            // Act
            const component: CollectionComponent = createComponent();

            // Assert
            expect(component.page).toEqual(3);
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
        it('should toggle playback when space is pressed outside of an input element', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keyup');
            keyboardEventMock.setup((x) => x.target).returns(() => document.createElement('div'));
            keyboardEventMock.setup((x) => x.key).returns(() => ' ');
            const component: CollectionComponent = createComponent();

            // Act
            component.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            playbackServiceMock.verify((x) => x.togglePlayback(), Times.once());
        });

        it('should not toggle playback when space is pressed inside an input element', () => {
            // Arrange
            const keyboardEventMock: IMock<KeyboardEvent> = Mock.ofType<KeyboardEvent>();
            keyboardEventMock.setup((x) => x.type).returns(() => 'keyup');
            keyboardEventMock.setup((x) => x.target).returns(() => document.createElement('input'));
            keyboardEventMock.setup((x) => x.key).returns(() => ' ');
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
            keyboardEventMock.setup((x) => x.target).returns(() => document.createElement('div'));
            keyboardEventMock.setup((x) => x.key).returns(() => 'a');
            const component: CollectionComponent = createComponent();

            // Act
            component.handleKeyboardEvent(keyboardEventMock.object);

            // Assert
            playbackServiceMock.verify((x) => x.togglePlayback(), Times.never());
        });
    });

    describe('setPage', () => {
        it('should set previousPage to page before changing page', () => {
            // Arrange
            const component: CollectionComponent = createComponent();
            component.previousPage = 1;
            component.page = 3;

            // Act
            component.setPage(2);

            // Assert
            expect(component.previousPage).toEqual(3);
        });

        it('should set page to the given page', () => {
            // Arrange
            const component: CollectionComponent = createComponent();
            component.page = 3;

            // Act
            component.setPage(2);

            // Assert
            expect(component.page).toEqual(2);
        });

        it('should set collectionNavigationService.page to the given page', () => {
            // Arrange
            const component: CollectionComponent = createComponentUsingStub();
            collectionNavigationServiceStub.page = 3;

            // Act
            component.setPage(2);

            // Assert
            expect(collectionNavigationServiceStub.page).toEqual(2);
        });
    });
});
