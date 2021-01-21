import { MatDialogRef } from '@angular/material';
import { IMock, It, Mock } from 'typemoq';
import { Desktop } from '../../../core/io/desktop';
import { FileSystem } from '../../../core/io/file-system';
import { ErrorDialogComponent } from './error-dialog.component';

describe('ErrorDialogComponent', () => {
    let dialogRefMock: IMock<MatDialogRef<ErrorDialogComponent>>;
    let desktopMock: IMock<Desktop>;
    let fileSystemMock: IMock<FileSystem>;

    let component: ErrorDialogComponent;

    beforeEach(() => {
        dialogRefMock = Mock.ofType<MatDialogRef<ErrorDialogComponent>>();
        desktopMock = Mock.ofType<Desktop>();
        fileSystemMock = Mock.ofType<FileSystem>();

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
});
