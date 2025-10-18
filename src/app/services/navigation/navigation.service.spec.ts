import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';
import { NavigationService } from './navigation.service';
import { AppearanceServiceBase } from '../appearance/appearance.service.base';
import { NavigationServiceBase } from './navigation.service.base';

describe('NavigationService', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let routerMock: IMock<Router>;
    let service: NavigationServiceBase;

    beforeEach(() => {
        routerMock = Mock.ofType<Router>();
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        service = new NavigationService(appearanceServiceMock.object, routerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
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
            await service.navigateToLoadingAsync();

            // Assert
            routerMock.verify((x) => x.navigate(['/loading']), Times.exactly(1));
        });
    });

    describe('navigateToCollection', () => {
        it('should navigate to collection', async () => {
            // Arrange

            // Act
            await service.navigateToCollectionAsync();

            // Assert
            routerMock.verify((x) => x.navigate(['/collection']), Times.exactly(1));
        });

        it('should apply margins with search box', async () => {
            // Arrange

            // Act
            await service.navigateToCollectionAsync();

            // Assert
            appearanceServiceMock.verify((x) => x.applyMargins(true), Times.exactly(1));
        });
    });

    describe('navigateToSettings', () => {
        it('should navigate to settings', async () => {
            // Arrange

            // Act
            await service.navigateToSettingsAsync();

            // Assert
            routerMock.verify((x) => x.navigate(['/settings']), Times.exactly(1));
        });

        it('should apply margins without search box', async () => {
            // Arrange

            // Act
            await service.navigateToSettingsAsync();

            // Assert
            appearanceServiceMock.verify((x) => x.applyMargins(false), Times.exactly(1));
        });
    });

    describe('navigateToInformation', () => {
        it('should navigate to information', async () => {
            // Arrange

            // Act
            await service.navigateToInformationAsync();

            // Assert
            routerMock.verify((x) => x.navigate(['/information']), Times.exactly(1));
        });

        it('should apply margins without search box', async () => {
            // Arrange

            // Act
            await service.navigateToInformationAsync();

            // Assert
            appearanceServiceMock.verify((x) => x.applyMargins(false), Times.exactly(1));
        });
    });

    describe('navigateToWelcome', () => {
        it('should navigate to welcome', async () => {
            // Arrange

            // Act
            await service.navigateToWelcomeAsync();

            // Assert
            routerMock.verify((x) => x.navigate(['/welcome']), Times.exactly(1));
        });
    });

    describe('navigateToManageCollection', () => {
        it('should navigate to manage collection', async () => {
            // Arrange

            // Act
            await service.navigateToManageCollectionAsync();

            // Assert
            routerMock.verify((x) => x.navigate(['/managecollection']), Times.exactly(1));
        });
    });

    describe('navigateToNowPlaying', () => {
        it('should navigate to now playing', async () => {
            // Arrange

            // Act
            await service.navigateToNowPlayingAsync();

            // Assert
            routerMock.verify((x) => x.navigate(['/nowplaying']), Times.exactly(1));
        });
    });

    describe('navigateToCoverPlayerAsync', () => {
        it('should navigate to now cover player', async () => {
            // Arrange

            // Act
            await service.navigateToCoverPlayerAsync();

            // Assert
            routerMock.verify((x) => x.navigate(['/coverplayer']), Times.exactly(1));
        });
    });

    describe('navigateToDopampPlayer', () => {
        it('should navigate to dopamp player', async () => {
            // Arrange

            // Act
            await service.navigateToDopampPlayerAsync();

            // Assert
            routerMock.verify((x) => x.navigate(['/dopampplayer']), Times.exactly(1));
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
                }),
            );

            // Act
            service.showPlaybackQueue();
            subscription.unsubscribe();

            // Assert
            expect(isPlaybackQueueRequested).toBeTruthy();
        });
    });
});
