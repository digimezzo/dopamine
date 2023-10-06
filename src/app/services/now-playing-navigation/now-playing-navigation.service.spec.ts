import { Subscription } from 'rxjs';
import { BaseNowPlayingNavigationService } from './base-now-playing-navigation.service';
import { NowPlayingNavigationService } from './now-playing-navigation.service';
import { NowPlayingPage } from './now-playing-page';

describe('NowPlayingNavigationService', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: BaseNowPlayingNavigationService = new NowPlayingNavigationService();

            // Assert
            expect(service).toBeDefined();
        });

        it('should define navigated$', () => {
            // Arrange

            // Act
            const service: BaseNowPlayingNavigationService = new NowPlayingNavigationService();

            // Assert
            expect(service.navigated$).toBeDefined();
        });
    });

    describe('navigate', () => {
        it('should trigger navigation', () => {
            // Arrange
            const service: BaseNowPlayingNavigationService = new NowPlayingNavigationService();

            let currentNowPlayingPage: NowPlayingPage = NowPlayingPage.showcase;

            const subscription: Subscription = service.navigated$.subscribe((nowPlayingPage: NowPlayingPage) => {
                currentNowPlayingPage = nowPlayingPage;
            });

            // Act
            service.navigate(NowPlayingPage.artistInformation);
            subscription.unsubscribe();

            // Assert
            expect(currentNowPlayingPage).toEqual(NowPlayingPage.artistInformation);
        });

        it('should set currentNowPlayingPage', () => {
            // Arrange
            const service: BaseNowPlayingNavigationService = new NowPlayingNavigationService();

            // Act
            const previousNowPlayingPage: NowPlayingPage = service.currentNowPlayingPage;
            service.navigate(NowPlayingPage.artistInformation);
            const newNowPlayingPage: NowPlayingPage = service.currentNowPlayingPage;

            // Assert
            expect(previousNowPlayingPage).toEqual(NowPlayingPage.showcase);
            expect(newNowPlayingPage).toEqual(NowPlayingPage.artistInformation);
        });
    });
});
