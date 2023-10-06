import { IMock, Mock, Times } from 'typemoq';
import { BaseDesktop } from '../../common/io/base-desktop';
import { Desktop } from '../../common/io/desktop';
import { BaseSnackBarService } from '../../services/snack-bar/base-snack-bar.service';
import { SnackBarComponent } from './snack-bar.component';

describe('SnackBarComponent', () => {
    let snackBarServiceMock: IMock<BaseSnackBarService>;
    let desktopMock: IMock<BaseDesktop>;
    let component: SnackBarComponent;

    beforeEach(() => {
        snackBarServiceMock = Mock.ofType<BaseSnackBarService>();
        desktopMock = Mock.ofType<Desktop>();

        component = new SnackBarComponent(snackBarServiceMock.object, desktopMock.object, {
            icon: 'My icon',
            animateIcon: true,
            message: 'My message',
            showCloseButton: true,
            url: 'My url',
        });
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('openDataUrl', () => {
        it('should open data url link', async () => {
            // Arrange

            // Act
            await component.openDataUrlAsync();

            // Assert
            desktopMock.verify((x) => x.openLinkAsync('My url'), Times.exactly(1));
        });
    });

    describe('dismissAsync', () => {
        it('should dismiss snack bar', () => {
            // Arrange

            // Act
            component.dismiss();

            // Assert
            snackBarServiceMock.verify((x) => x.dismiss(), Times.exactly(1));
        });
    });
});
