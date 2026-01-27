import { MatDialogRef } from '@angular/material/dialog';
import { IMock, Mock } from 'typemoq';
import { EditPlaylistDialogComponent } from './edit-playlist-dialog.component';
import { PlaylistServiceBase } from '../../../../services/playlist/playlist.service.base';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { DesktopBase } from '../../../../common/io/desktop.base';

describe('EditPlaylistDialogComponent', () => {
    let component: EditPlaylistDialogComponent;
    const dataMock: any = { inputText: '' };
    let dialogRefMock: IMock<MatDialogRef<EditPlaylistDialogComponent>>;
    let playlistServiceMock: IMock<PlaylistServiceBase>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let desktopMock: IMock<DesktopBase>;

    beforeEach(() => {
        dialogRefMock = Mock.ofType<MatDialogRef<EditPlaylistDialogComponent>>();
        playlistServiceMock = Mock.ofType<PlaylistServiceBase>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        desktopMock = Mock.ofType<DesktopBase>();

        component = new EditPlaylistDialogComponent(
            dataMock,
            dialogRefMock.object,
            playlistServiceMock.object,
            translatorServiceMock.object,
            desktopMock.object,
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act, Assert
            expect(component).toBeDefined();
        });
    });
});
