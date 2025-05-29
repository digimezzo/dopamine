import { MatDialogRef } from '@angular/material/dialog';
import { IMock, Mock } from 'typemoq';
import { InfoDialogComponent } from './info-dialog.component';

describe('InfoDialogComponent', () => {
    let component: InfoDialogComponent;
    const dataMock: any = { inputText: '' };
    let dialogRefMock: IMock<MatDialogRef<InfoDialogComponent>>;

    beforeEach(() => {
        dialogRefMock = Mock.ofType<MatDialogRef<InfoDialogComponent>>();

        component = new InfoDialogComponent(dataMock, dialogRefMock.object);
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
