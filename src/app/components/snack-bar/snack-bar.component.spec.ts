import { IMock, Mock, Times } from 'typemoq';
import { BaseDesktop } from '../../common/io/base-desktop';
import { Desktop } from '../../common/io/desktop';
import { BaseSnackBarService } from '../../services/snack-bar/base-snack-bar.service';
import { SnackBarComponent } from './snack-bar.component';

describe('SnackBarComponent', () => {
    let snackBarServiceMock: IMock<BaseSnackBarService>;
    let desktopMock: IMock<BaseDesktop>;

    beforeEach(() => {
        snackBarServiceMock = Mock.ofType<BaseSnackBarService>();
        desktopMock = Mock.ofType<Desktop>();
    });

    function createComponent(dataUrl: string): SnackBarComponent {
        return new SnackBarComponent(snackBarServiceMock.object, desktopMock.object, {
            icon: 'My icon',
            animateIcon: true,
            message: 'My message',
            showCloseButton: true,
            url: dataUrl,
        });
    }

    function createComponentWithoutData(): SnackBarComponent {
        return new SnackBarComponent(snackBarServiceMock.object, desktopMock.object, undefined);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const component: SnackBarComponent = createComponent('The data url');

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('openDataUrl', () => {
        it('should open data url link', () => {
            // Arrange
            const component: SnackBarComponent = createComponent('The data url');

            // Act
            component.openDataUrl();

            // Assert
            desktopMock.verify((x) => x.openLink('The data url'), Times.exactly(1));
        });
    });

    describe('dismissAsync', () => {
        it('should dismiss snack bar', async () => {
            // Arrange
            const component: SnackBarComponent = createComponent('The data url');

            // Act
            await component.dismissAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.dismissAsync(), Times.exactly(1));
        });
    });

    describe('hasDataUrl', () => {
        it('should be true if there is a data url', () => {
            // Arrange
            const component: SnackBarComponent = createComponent('The data url');

            // Act, Assert
            expect(component.hasDataUrl).toBeTruthy();
        });

        it('should be false if there is no data', () => {
            // Arrange
            const component: SnackBarComponent = createComponentWithoutData();

            // Act, Assert
            expect(component.hasDataUrl).toBeFalsy();
        });

        it('should be false if there is no data url', () => {
            // Arrange
            const component: SnackBarComponent = createComponent('');

            // Act, Assert
            expect(component.hasDataUrl).toBeFalsy();
        });
    });
});
