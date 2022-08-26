import { IMock, Mock, Times } from 'typemoq';
import { Desktop } from '../../common/io/desktop';
import { BaseSnackBarService } from '../../services/snack-bar/base-snack-bar.service';
import { SnackBarComponent } from './snack-bar.component';

jest.mock('@electron/remote', () => ({ exec: jest.fn() }));

describe('SnackBarComponent', () => {
    let snackBarServiceMock: IMock<BaseSnackBarService>;
    let desktopMock: IMock<Desktop>;
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
        it('should open data url link', () => {
            // Arrange

            // Act
            component.openDataUrl();

            // Assert
            desktopMock.verify((x) => x.openLink('My url'), Times.exactly(1));
        });
    });

    describe('dismissAsync', () => {
        it('should dismiss snack bar', async () => {
            // Arrange

            // Act
            await component.dismissAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.dismissAsync(), Times.exactly(1));
        });
    });
});
