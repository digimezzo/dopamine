import { MatDialogRef } from '@angular/material';
import { IMock, Mock } from 'typemoq';
import { EditPlaylistDialogComponent } from './edit-playlist-dialog.component';

describe('EditPlaylistDialogComponent', () => {
    let component: EditPlaylistDialogComponent;
    let dialogRefMock: IMock<MatDialogRef<EditPlaylistDialogComponent>>;

    beforeEach(() => {
        dialogRefMock = Mock.ofType<MatDialogRef<EditPlaylistDialogComponent>>();

        component = new EditPlaylistDialogComponent();
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
