import { MatDialogRef } from '@angular/material';
import { IMock, It, Mock, Times } from 'typemoq';
import { Desktop } from '../../../common/io/desktop';
import { FileSystem } from '../../../common/io/file-system';
import { ErrorDialogComponent } from './error-dialog.component';

jest.mock('@electron/remote', () => ({ exec: jest.fn() }));

describe('ErrorDialogComponent', () => {
    let dialogRefMock: IMock<MatDialogRef<ErrorDialogComponent>>;
    let desktopMock: IMock<Desktop>;
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
