import { Observable, Subject } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { HighlightsComponent } from './highlights.component';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { AlbumServiceBase } from '../../../services/album/album-service.base';
import { PlaybackService } from '../../../services/playback/playback.service';
import { AudioVisualizer } from '../../../services/playback/audio-visualizer';
import { DocumentProxy } from '../../../common/io/document-proxy';
import { SettingsBase } from '../../../common/settings/settings.base';
import { AlbumModel } from '../../../services/album/album-model';
import { PlaybackStarted } from '../../../services/playback/playback-started';

describe('HighlightsComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let navigationServiceMock: IMock<NavigationServiceBase>;
    let albumServiceMock: IMock<AlbumServiceBase>;
    let playbackServiceMock: IMock<PlaybackService>;
    let audioVisualizerMock: IMock<AudioVisualizer>;
    let documentProxyMock: IMock<DocumentProxy>;
    let settingsMock: IMock<SettingsBase>;

    let playbackServicePlaybackStartedMock: Subject<PlaybackStarted>;
    let playbackServicePlaybackStarted$: Observable<PlaybackStarted>;

    const flushPromises = () => new Promise(process.nextTick);

    function createComponent(): HighlightsComponent {
        return new HighlightsComponent(
            appearanceServiceMock.object,
            navigationServiceMock.object,
            playbackServiceMock.object,
            audioVisualizerMock.object,
            documentProxyMock.object,
            settingsMock.object,
            albumServiceMock.object,
        );
    }

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        navigationServiceMock = Mock.ofType<NavigationServiceBase>();
        albumServiceMock = Mock.ofType<AlbumServiceBase>();
        playbackServiceMock = Mock.ofType<PlaybackService>();
        audioVisualizerMock = Mock.ofType<AudioVisualizer>();
        documentProxyMock = Mock.ofType<DocumentProxy>();
        settingsMock = Mock.ofType<SettingsBase>();

        playbackServicePlaybackStartedMock = new Subject();
        playbackServicePlaybackStarted$ = playbackServicePlaybackStartedMock.asObservable();
        playbackServiceMock.setup((x) => x.playbackStarted$).returns(() => playbackServicePlaybackStarted$);

        settingsMock.setup((x) => x.keepPlaybackControlsVisibleOnNowPlayingPage).returns(() => false);

        const mockCanvas = document.createElement('canvas');
        documentProxyMock.setup((x) => x.getCanvasById('highlightsAudioVisualizer')).returns(() => mockCanvas);

        albumServiceMock.setup((x) => x.getMostPlayedAlbums(12)).returns(() => []);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: HighlightsComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act
            const component: HighlightsComponent = createComponent();

            // Assert
            expect(component.appearanceService).toBeDefined();
        });

        it('should initialize mostPlayedAlbums as empty array', () => {
            // Arrange

            // Act
            const component: HighlightsComponent = createComponent();

            // Assert
            expect(component.mostPlayedAlbums).toBeDefined();
            expect(component.mostPlayedAlbums.length).toBe(0);
        });

        it('should initialize animationDelays as empty array', () => {
            // Arrange

            // Act
            const component: HighlightsComponent = createComponent();

            // Assert
            expect(component.animationDelays).toBeDefined();
            expect(component.animationDelays.length).toBe(0);
        });

        it('should initialize animationKey to 0', () => {
            // Arrange

            // Act
            const component: HighlightsComponent = createComponent();

            // Assert
            expect(component.animationKey).toBe(0);
        });
    });

    describe('ngOnInit', () => {
        it('should load most played albums', () => {
            // Arrange
            const mockAlbums: AlbumModel[] = [
                { albumKey: 'album1', playCount: 10 } as AlbumModel,
                { albumKey: 'album2', playCount: 8 } as AlbumModel,
            ];
            albumServiceMock.reset();
            albumServiceMock.setup((x) => x.getMostPlayedAlbums(12)).returns(() => mockAlbums);
            const component: HighlightsComponent = createComponent();

            // Act
            component.ngOnInit();

            // Assert
            expect(component.mostPlayedAlbums).toEqual(mockAlbums);
            albumServiceMock.verify((x) => x.getMostPlayedAlbums(12), Times.atLeastOnce());
        });

        it('should generate random delays for 12 albums', () => {
            // Arrange
            const component: HighlightsComponent = createComponent();

            // Act
            component.ngOnInit();

            // Assert
            expect(component.animationDelays.length).toBe(12);
            component.animationDelays.forEach((delay) => {
                expect(delay).toBeGreaterThanOrEqual(0);
                expect(delay).toBeLessThan(0.6);
            });
        });

        it('should initialize controlsVisibility to visible', () => {
            // Arrange
            const component: HighlightsComponent = createComponent();

            // Act
            component.ngOnInit();

            // Assert
            expect(component.controlsVisibility).toBe('visible');
        });

        it('should reset timer on mousemove', (done) => {
            // Arrange
            const component: HighlightsComponent = createComponent();
            const resetTimerSpy = jest.spyOn<any, any>(component, 'resetTimer');

            // Act
            component.ngOnInit();
            document.dispatchEvent(new MouseEvent('mousemove'));

            // Assert
            setTimeout(() => {
                expect(resetTimerSpy).toHaveBeenCalled();
                resetTimerSpy.mockRestore();
                done();
            }, 10);
        });

        it('should reset timer on mousedown', (done) => {
            // Arrange
            const component: HighlightsComponent = createComponent();
            const resetTimerSpy = jest.spyOn<any, any>(component, 'resetTimer');

            // Act
            component.ngOnInit();
            document.dispatchEvent(new MouseEvent('mousedown'));

            // Assert
            setTimeout(() => {
                expect(resetTimerSpy).toHaveBeenCalled();
                resetTimerSpy.mockRestore();
                done();
            }, 10);
        });

        it('should subscribe to playbackService.playbackStarted$', () => {
            // Arrange
            const component: HighlightsComponent = createComponent();

            // Act
            component.ngOnInit();

            // Assert
            expect(component['subscription']).toBeDefined();
        });
    });

    describe('ngAfterViewInit', () => {
        it('should set audio visualizer', () => {
            // Arrange
            const component: HighlightsComponent = createComponent();

            // Act
            component.ngAfterViewInit();

            // Assert
            documentProxyMock.verify((x) => x.getCanvasById('highlightsAudioVisualizer'), Times.once());
            audioVisualizerMock.verify((x) => x.connectCanvas(It.isAny()), Times.once());
        });
    });

    describe('ngOnDestroy', () => {
        it('should unsubscribe', () => {
            // Arrange
            const component: HighlightsComponent = createComponent();
            component.ngOnInit();
            const unsubscribeSpy = jest.spyOn(component['subscription'], 'unsubscribe');

            // Act
            component.ngOnDestroy();

            // Assert
            expect(unsubscribeSpy).toHaveBeenCalled();
            unsubscribeSpy.mockRestore();
        });
    });

    describe('goBackToCollectionAsync', () => {
        it('should navigate to collection', async () => {
            // Arrange
            navigationServiceMock.setup((x) => x.navigateToCollectionAsync()).returns(() => Promise.resolve());
            const component: HighlightsComponent = createComponent();

            // Act
            await component.goBackToCollectionAsync();

            // Assert
            navigationServiceMock.verify((x) => x.navigateToCollectionAsync(), Times.once());
        });
    });

    describe('resetTimer', () => {
        it('should set controls visibility to visible', () => {
            // Arrange
            const component: HighlightsComponent = createComponent();

            // Act
            component['resetTimer']();

            // Assert
            expect(component.controlsVisibility).toBe('visible');
        });

        it('should clear previous timer', () => {
            // Arrange
            const component: HighlightsComponent = createComponent();
            component['timerId'] = 123;
            jest.spyOn(global, 'clearTimeout');

            // Act
            component['resetTimer']();

            // Assert
            expect(clearTimeout).toHaveBeenCalledWith(123);
        });

        it('should not set timer when keepPlaybackControlsVisibleOnNowPlayingPage is true', () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.keepPlaybackControlsVisibleOnNowPlayingPage).returns(() => true);
            const component: HighlightsComponent = createComponent();

            // Act
            component['resetTimer']();

            // Assert
            expect(component['timerId']).toBe(0);
        });

        it('should hide controls after 5 seconds when keepPlaybackControlsVisibleOnNowPlayingPage is false', () => {
            // Arrange
            jest.useFakeTimers();
            settingsMock.reset();
            settingsMock.setup((x) => x.keepPlaybackControlsVisibleOnNowPlayingPage).returns(() => false);
            const component: HighlightsComponent = createComponent();

            // Act
            component['resetTimer']();
            jest.advanceTimersByTime(5100);

            // Assert
            expect(component.controlsVisibility).toBe('hidden');
            jest.useRealTimers();
        });
    });

    describe('onAlbumClickAsync', () => {
        it('should enqueue and play album when album is provided', async () => {
            // Arrange
            const mockAlbum = { albumKey: 'album1', playCount: 10 } as AlbumModel;
            playbackServiceMock.setup((x) => x.enqueueAndPlayAlbumAsync(mockAlbum)).returns(() => Promise.resolve());
            const component: HighlightsComponent = createComponent();

            // Act
            await component.onAlbumClickAsync(mockAlbum);

            // Assert
            playbackServiceMock.verify((x) => x.enqueueAndPlayAlbumAsync(mockAlbum), Times.once());
        });

        it('should not play when album is undefined', async () => {
            // Arrange
            const component: HighlightsComponent = createComponent();

            // Act
            await component.onAlbumClickAsync(undefined);

            // Assert
            playbackServiceMock.verify((x) => x.enqueueAndPlayAlbumAsync(It.isAny()), Times.never());
        });

        it('should not play when album is null', async () => {
            // Arrange
            const component: HighlightsComponent = createComponent();

            // Act
            await component.onAlbumClickAsync(null as any);

            // Assert
            playbackServiceMock.verify((x) => x.enqueueAndPlayAlbumAsync(It.isAny()), Times.never());
        });
    });

    describe('onPlaybackStarted', () => {
        it('should reload albums on playback started', () => {
            // Arrange
            const mockAlbums: AlbumModel[] = [];
            albumServiceMock.setup((x) => x.getMostPlayedAlbums(12)).returns(() => mockAlbums);
            const component: HighlightsComponent = createComponent();
            component.ngOnInit();
            albumServiceMock.reset();
            albumServiceMock.setup((x) => x.getMostPlayedAlbums(12)).returns(() => mockAlbums);

            // Act
            component['onPlaybackStarted']();

            // Assert
            albumServiceMock.verify((x) => x.getMostPlayedAlbums(12), Times.once());
        });

        it('should generate new delays when albums changed', () => {
            // Arrange
            const album1 = { albumKey: 'album1', playCount: 10 } as AlbumModel;
            const album2 = { albumKey: 'album2', playCount: 8 } as AlbumModel;
            const album3 = { albumKey: 'album3', playCount: 6 } as AlbumModel;

            albumServiceMock.setup((x) => x.getMostPlayedAlbums(12)).returns(() => [album1, album3]);
            const component: HighlightsComponent = createComponent();
            component.mostPlayedAlbums = [album1, album2];
            const generateDelaysSpy = jest.spyOn<any, any>(component, 'generateRandomDelays');
            const restartAnimationsSpy = jest.spyOn<any, any>(component, 'restartAnimations');

            // Act
            component['onPlaybackStarted']();

            // Assert
            expect(generateDelaysSpy).toHaveBeenCalled();
            expect(restartAnimationsSpy).toHaveBeenCalled();
            generateDelaysSpy.mockRestore();
            restartAnimationsSpy.mockRestore();
        });

        it('should increment animation key when albums changed', () => {
            // Arrange
            const album1 = { albumKey: 'album1', playCount: 10 } as AlbumModel;
            const album2 = { albumKey: 'album2', playCount: 8 } as AlbumModel;
            const album3 = { albumKey: 'album3', playCount: 6 } as AlbumModel;

            albumServiceMock.setup((x) => x.getMostPlayedAlbums(12)).returns(() => [album1, album3]);
            const component: HighlightsComponent = createComponent();
            component.mostPlayedAlbums = [album1, album2];
            const initialKey = component.animationKey;

            // Act
            component['onPlaybackStarted']();

            // Assert
            expect(component.animationKey).toBe(initialKey + 1);
        });

        it('should not generate new delays when albums did not change', () => {
            // Arrange
            const album1 = { albumKey: 'album1', playCount: 10 } as AlbumModel;
            const album2 = { albumKey: 'album2', playCount: 8 } as AlbumModel;

            albumServiceMock.reset();
            albumServiceMock.setup((x) => x.getMostPlayedAlbums(12)).returns(() => [album1, album2]);
            const component: HighlightsComponent = createComponent();
            component.mostPlayedAlbums = [album1, album2];
            const generateDelaysSpy = jest.spyOn<any, any>(component, 'generateRandomDelays');

            // Act
            component['onPlaybackStarted']();

            // Assert
            expect(generateDelaysSpy).not.toHaveBeenCalled();
            generateDelaysSpy.mockRestore();
        });
    });

    describe('restartAnimations', () => {
        it('should remove and reapply animations to all squares', (done) => {
            // Arrange
            const component: HighlightsComponent = createComponent();
            const mockSquare1 = document.createElement('div');
            const mockSquare2 = document.createElement('div');
            mockSquare1.classList.add('square');
            mockSquare2.classList.add('square');
            mockSquare1.style.animation = 'fadeIn 1s';
            mockSquare2.style.animation = 'slideIn 0.5s';

            document.body.appendChild(mockSquare1);
            document.body.appendChild(mockSquare2);

            // Act
            component['restartAnimations']();

            // Assert
            setTimeout(() => {
                expect(mockSquare1.style.animation).toBe('fadeIn 1s');
                expect(mockSquare2.style.animation).toBe('slideIn 0.5s');
                document.body.removeChild(mockSquare1);
                document.body.removeChild(mockSquare2);
                done();
            }, 50);
        });
    });

    describe('generateRandomDelays', () => {
        it('should generate 12 random delays', () => {
            // Arrange
            const component: HighlightsComponent = createComponent();

            // Act
            component['generateRandomDelays']();

            // Assert
            expect(component.animationDelays.length).toBe(12);
        });

        it('should generate delays between 0 and 0.6 seconds', () => {
            // Arrange
            const component: HighlightsComponent = createComponent();

            // Act
            component['generateRandomDelays']();

            // Assert
            component.animationDelays.forEach((delay) => {
                expect(delay).toBeGreaterThanOrEqual(0);
                expect(delay).toBeLessThan(0.6);
            });
        });
    });
});
