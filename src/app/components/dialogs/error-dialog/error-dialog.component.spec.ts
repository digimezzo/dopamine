import { MatDialogRef } from '@angular/material/dialog';
import { IMock, It, Mock, Times } from 'typemoq';
import { BaseDesktop } from '../../../common/io/base-desktop';
import { Desktop } from '../../../common/io/desktop';
import { FileSystem } from '../../../common/io/file-system';
import { ErrorDialogComponent } from './error-dialog.component';

describe('ErrorDialogComponent', () => {
    let dialogRefMock: IMock<MatDialogRef<ErrorDialogComponent>>;
    let desktopMock: IMock<BaseDesktop>;
    let fileSystemMock: IMock<FileSystem>;

    let component: ErrorDialogComponent;

    beforeEach(() => {
        dialogRefMock = Mock.ofType<MatDialogRef<ErrorDialogComponent>>();
        desktopMock = Mock.ofType<Desktop>();
        fileSystemMock = Mock.ofType<FileSystem>();

        fileSystemMock.setup((x) => x.applicationDataDirectory()).returns(() => '/home/.config/Dopamine');
        fileSystemMock
            .setup((x) => x.combinePath(['/home/.config/Dopamine', 'logs', 'Dopamine.log']))
            .returns(() => '/home/.config/Dopamine/logs/Dopamine.log');

        component = new ErrorDialogComponent(It.isAny(), dialogRefMock.object, desktopMock.object, fileSystemMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('viewLog', () => {
        it('should open the log file', () => {
            // Arrange
            const logFilePath: string = '/home/.config/Dopamine/logs/Dopamine.log';

            // Act
            component.viewLog();

            // Assert
            desktopMock.verify((x) => x.showFileInDirectory(logFilePath), Times.exactly(1));
        });
    });
});
