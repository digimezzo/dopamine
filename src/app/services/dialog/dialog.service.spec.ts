import { MatDialog } from '@angular/material';
import * as assert from 'assert';
import { IMock, Mock } from 'typemoq';
import { DialogService } from './dialog.service';

describe('ColorScheme', () => {
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
            assert.ok(service);
        });
    });
});
