import { MatDialogRef } from '@angular/material/dialog';
import { EditSmartPlaylistDialogComponent } from './edit-smart-playlist-dialog.component';
import { IMock, Mock } from 'typemoq';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';

describe('EditSmartPlaylistDialogComponent', () => {
    let component: EditSmartPlaylistDialogComponent;
    const dataMock: any = { inputText: '' };
    let dialogRefMock: IMock<MatDialogRef<EditSmartPlaylistDialogComponent>>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;

    beforeEach(() => {
        dialogRefMock = Mock.ofType<MatDialogRef<EditSmartPlaylistDialogComponent>>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();

        component = new EditSmartPlaylistDialogComponent(dataMock, dialogRefMock.object, translatorServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act, Assert
            expect(component).toBeDefined();
        });
    });
});
