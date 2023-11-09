import { IMock, Mock, Times } from 'typemoq';
import { SnackBarComponent } from './snack-bar.component';
import { SnackBarServiceBase } from '../../../services/snack-bar/snack-bar.service.base';
import { DesktopBase } from '../../../common/io/desktop.base';

describe('SnackBarComponent', () => {
    let snackBarServiceMock: IMock<SnackBarServiceBase>;
    let desktopMock: IMock<DesktopBase>;
    let component: SnackBarComponent;

    beforeEach(() => {
        snackBarServiceMock = Mock.ofType<SnackBarServiceBase>();
        desktopMock = Mock.ofType<DesktopBase>();

        component = new SnackBarComponent(snackBarServiceMock.object, {
            icon: 'My icon',
            animateIcon: true,
            message: 'My message',
            showCloseButton: true,
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
