import { MatDialogRef } from '@angular/material/dialog';
import { IMock, It, Mock, Times } from 'typemoq';
import { LogViewer } from '../../../common/io/log-viewer';
import { ErrorDialogComponent } from './error-dialog.component';

describe('ErrorDialogComponent', () => {
    let dialogRefMock: IMock<MatDialogRef<ErrorDialogComponent>>;
    let logViewerMock: IMock<LogViewer>;

    beforeEach(() => {
        dialogRefMock = Mock.ofType<MatDialogRef<ErrorDialogComponent>>();
        logViewerMock = Mock.ofType<LogViewer>();
    });

    function createComponent(): ErrorDialogComponent {
        return new ErrorDialogComponent(It.isAny(), dialogRefMock.object, logViewerMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: ErrorDialogComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('viewLog', () => {
        it('should open the log file', () => {
            // Arrange
            const component: ErrorDialogComponent = createComponent();

            // Act
            component.viewLog();

            // Assert
            logViewerMock.verify((x) => x.viewLog(), Times.once());
        });
    });
});
