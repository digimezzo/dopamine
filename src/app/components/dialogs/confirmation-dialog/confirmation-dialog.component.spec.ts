import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { IMock, It, Mock } from 'typemoq';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
    let component: ConfirmationDialogComponent;
    let dialogRefMock: IMock<MatDialogRef<ConfirmationDialogComponent>>;

    beforeEach(() => {
        dialogRefMock = Mock.ofType<MatDialogRef<ConfirmationDialogComponent>>();

        component = new ConfirmationDialogComponent(It.isAny(), dialogRefMock.object);
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
