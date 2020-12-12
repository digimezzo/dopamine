import { IMock, Mock, Times } from 'typemoq';
import { SnackBarComponent } from '../app/components/snack-bar/snack-bar.component';
import { Desktop } from '../app/core/io/desktop';
import { BaseSnackBarService } from '../app/services/snack-bar/base-snack-bar.service';

describe('SnackbarComponent', () => {
    describe('openDataUrl', () => {
        it('Should open data url link', () => {
            // Arrange
            const snackBarServiceMock: IMock<BaseSnackBarService> = Mock.ofType<BaseSnackBarService>();
            const desktopMock: IMock<Desktop> = Mock.ofType<Desktop>();

            const snackBarComponent: SnackBarComponent = new SnackBarComponent(
                snackBarServiceMock.object,
                desktopMock.object,
                { icon: 'My icon', animateIcon: true, message: 'My message', showCloseButton: true, url: 'My url' });

            // Act
            snackBarComponent.openDataUrl();

            // Assert
            desktopMock.verify(x => x.openLink('My url'), Times.exactly(1));
        });
    });

    describe('dismissAsync', () => {
        it('Should dismiss snack bar', async () => {
            // Arrange
            const snackBarServiceMock: IMock<BaseSnackBarService> = Mock.ofType<BaseSnackBarService>();
            const desktopMock: IMock<Desktop> = Mock.ofType<Desktop>();

            const snackBarComponent: SnackBarComponent = new SnackBarComponent(
                snackBarServiceMock.object,
                desktopMock.object,
                { icon: 'My icon', animateIcon: true, message: 'My message', showCloseButton: true, url: 'My url' });

            // Act
            await snackBarComponent.dismissAsync();

            // Assert
            snackBarServiceMock.verify(x => x.dismissAsync(), Times.exactly(1));
        });
    });
});
