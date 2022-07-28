import { MatDialogRef } from '@angular/material';
import { IMock, Mock } from 'typemoq';
import { Desktop } from '../../../common/io/desktop';
import { BasePlaylistService } from '../../../services/playlist/base-playlist.service';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { EditPlaylistDialogComponent } from './edit-playlist-dialog.component';

describe('EditPlaylistDialogComponent', () => {
    let component: EditPlaylistDialogComponent;
    const dataMock: any = { inputText: '' };
    let dialogRefMock: IMock<MatDialogRef<EditPlaylistDialogComponent>>;
    let playlistServiceMock: IMock<BasePlaylistService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let desktopMock: IMock<Desktop>;

    beforeEach(() => {
        dialogRefMock = Mock.ofType<MatDialogRef<EditPlaylistDialogComponent>>();
        playlistServiceMock = Mock.ofType<BasePlaylistService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        desktopMock = Mock.ofType<Desktop>();

        component = new EditPlaylistDialogComponent(
            dataMock,
            dialogRefMock.object,
            playlistServiceMock.object,
            translatorServiceMock.object,
            desktopMock.object
        );
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
