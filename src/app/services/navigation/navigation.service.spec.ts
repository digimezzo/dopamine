import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { BaseAppearanceService } from '../appearance/base-appearance.service';
import { BaseNavigationService } from './base-navigation.service';
import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let routerMock: IMock<Router>;
    let service: BaseNavigationService;

    beforeEach(() => {
        routerMock = Mock.ofType<Router>();
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        service = new NavigationService(appearanceServiceMock.object, routerMock.object);
    });

    describe('constructor', () => {
        it('should create', async () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('navigateToLoading', () => {
        it('should navigate to loading', async () => {
            // Arrange

            // Act
            service.navigateToLoading();

            // Assert
            routerMock.verify((x) => x.navigate(['/loading']), Times.exactly(1));
        });
    });

    describe('navigateToCollection', () => {
        it('should navigate to collection', async () => {
            // Arrange

            // Act
            service.navigateToCollection();

            // Assert
            routerMock.verify((x) => x.navigate(['/collection']), Times.exactly(1));
        });

        it('should apply margins with search box', async () => {
            // Arrange

            // Act
            service.navigateToCollection();

            // Assert
            appearanceServiceMock.verify((x) => x.applyMargins(true), Times.exactly(1));
        });
    });

    describe('navigateToSettings', () => {
        it('should navigate to settings', async () => {
            // Arrange

            // Act
            service.navigateToSettings();

            // Assert
            routerMock.verify((x) => x.navigate(['/settings']), Times.exactly(1));
        });

        it('should apply margins without search box', async () => {
            // Arrange

            // Act
            service.navigateToSettings();

            // Assert
            appearanceServiceMock.verify((x) => x.applyMargins(false), Times.exactly(1));
        });
    });

    describe('navigateToInformation', () => {
        it('should navigate to information', async () => {
            // Arrange

            // Act
            service.navigateToInformation();

            // Assert
            routerMock.verify((x) => x.navigate(['/information']), Times.exactly(1));
        });

        it('should apply margins without search box', async () => {
            // Arrange

            // Act
            service.navigateToInformation();

            // Assert
            appearanceServiceMock.verify((x) => x.applyMargins(false), Times.exactly(1));
        });
    });

    describe('navigateToWelcome', () => {
        it('should navigate to welcome', async () => {
            // Arrange

            // Act
            service.navigateToWelcome();

            // Assert
            routerMock.verify((x) => x.navigate(['/welcome']), Times.exactly(1));
        });
    });

    describe('navigateToManageCollection', () => {
        it('should navigate to manage collection', async () => {
            // Arrange

            // Act
            service.navigateToManageCollection();

            // Assert
            routerMock.verify((x) => x.navigate(['/managecollection']), Times.exactly(1));
        });
    });

    describe('navigateToNowPlaying', () => {
        it('should navigate to now playing', async () => {
            // Arrange

            // Act
            service.navigateToNowPlaying();

            // Assert
            routerMock.verify((x) => x.navigate(['/nowplaying']), Times.exactly(1));
        });
    });

    describe('showPlaybackQueue', () => {
        it('should request to show the playback queue', () => {
            // Arrange
            let isPlaybackQueueRequested: boolean = false;

            const subscription: Subscription = new Subscription();
            subscription.add(
                service.showPlaybackQueueRequested$.subscribe(() => {
                    isPlaybackQueueRequested = true;
                })
            );

            // Act
            service.showPlaybackQueue();
            subscription.unsubscribe();

            // Assert
            expect(isPlaybackQueueRequested).toBeTruthy();
        });
    });
});
