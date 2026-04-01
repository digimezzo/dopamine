import { MatDialogRef } from '@angular/material/dialog';
import { EditSmartPlaylistDialogComponent } from './edit-smart-playlist-dialog.component';
import { IMock, Mock } from 'typemoq';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { PlaylistServiceBase } from '../../../../services/playlist/playlist.service.base';
import { FileAccessBase } from '../../../../common/io/file-access.base';
import { TextSanitizer } from '../../../../common/text-sanitizer';
import { Logger } from '../../../../common/logger';
import { SmartPlaylistParser } from '../../../../services/playlist/smart-playlist-parser';
import { DesktopBase } from '../../../../common/io/desktop.base';
import { GuidFactory } from '../../../../common/guid.factory';

describe('EditSmartPlaylistDialogComponent', () => {
    let component: EditSmartPlaylistDialogComponent;
    const dataMock: any = { inputText: '' };
    let dialogRefMock: IMock<MatDialogRef<EditSmartPlaylistDialogComponent>>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let playlistServiceMock: IMock<PlaylistServiceBase>;
    let fileAccessMock: IMock<FileAccessBase>;
    let textSanitizerMock: IMock<TextSanitizer>;
    let loggerMock: IMock<Logger>;
    let smartPlaylistParserMock: IMock<SmartPlaylistParser>;
    let desktopMock: IMock<DesktopBase>;
    let guidFactoryMock: IMock<GuidFactory>;

    beforeEach(() => {
        dialogRefMock = Mock.ofType<MatDialogRef<EditSmartPlaylistDialogComponent>>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        playlistServiceMock = Mock.ofType<PlaylistServiceBase>();
        fileAccessMock = Mock.ofType<FileAccessBase>();
        textSanitizerMock = Mock.ofType<TextSanitizer>();
        loggerMock = Mock.ofType<Logger>();
        smartPlaylistParserMock = Mock.ofType<SmartPlaylistParser>();
        desktopMock = Mock.ofType<DesktopBase>();
        guidFactoryMock = Mock.ofType<GuidFactory>();

        component = new EditSmartPlaylistDialogComponent(
            dataMock,
            dialogRefMock.object,
            translatorServiceMock.object,
            playlistServiceMock.object,
            fileAccessMock.object,
            textSanitizerMock.object,
            loggerMock.object,
            smartPlaylistParserMock.object,
            desktopMock.object,
            guidFactoryMock.object,
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act, Assert
            expect(component).toBeDefined();
        });
    });
});
