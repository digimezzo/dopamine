import { MatDialog } from '@angular/material/dialog';
import { IMock, Mock } from 'typemoq';
import { PlaylistModelFactory } from '../playlist/playlist-model-factory';
import { DialogService } from './dialog.service';
import { TranslatorServiceBase } from '../translator/translator.service.base';

describe('DialogService', () => {
    let matDialogMock: IMock<MatDialog>;
    let playlistModelFactoryMock: IMock<PlaylistModelFactory>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;

    let service: DialogService;

    beforeEach(() => {
        matDialogMock = Mock.ofType<MatDialog>();
        playlistModelFactoryMock = Mock.ofType<PlaylistModelFactory>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();

        service = new DialogService(matDialogMock.object, playlistModelFactoryMock.object, translatorServiceMock.object);
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
