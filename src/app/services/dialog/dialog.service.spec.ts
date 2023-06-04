import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { IMock, Mock } from 'typemoq';
import { PlaylistModelFactory } from '../playlist/playlist-model-factory';
import { DialogService } from './dialog.service';

jest.mock('@electron/remote', () => ({ exec: jest.fn() }));

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
