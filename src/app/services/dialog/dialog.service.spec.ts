import { MatDialog } from '@angular/material';
import { IMock, Mock } from 'typemoq';
import { DialogService } from './dialog.service';

describe('DialogService', () => {
    let matDialogMock: IMock<MatDialog>;

    let service: DialogService;

    beforeEach(() => {
        matDialogMock = Mock.ofType<MatDialog>();

        service = new DialogService(matDialogMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });
    });
});
