import { MatDialog } from '@angular/material/dialog';
import { IMock, Mock } from 'typemoq';
import { PlaylistModelFactory } from '../playlist/playlist-model-factory';
import { DialogService } from './dialog.service';

describe('DialogService', () => {
    let matDialogMock: IMock<MatDialog>;
    let playlistModelFactoryMock: IMock<PlaylistModelFactory>;

    let service: DialogService;

    beforeEach(() => {
        matDialogMock = Mock.ofType<MatDialog>();
        playlistModelFactoryMock = Mock.ofType<PlaylistModelFactory>();

        service = new DialogService(matDialogMock.object, playlistModelFactoryMock.object);
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
