import { MatDialogRef } from '@angular/material/dialog';
import { IMock, Mock } from 'typemoq';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { EditTracksDialogComponent } from './edit-tracks-dialog.component';
import { TrackModel } from '../../../../services/track/track-model';
import { DialogServiceBase } from '../../../../services/dialog/dialog.service.base';
import { MetadataService } from '../../../../services/metadata/metadata.service';
import { FileMetadataFactoryBase } from '../../../../common/metadata/file-metadata.factory.base';
import { Logger } from '../../../../common/logger';

jest.mock('jimp', () => ({ exec: jest.fn() }));

describe('EditTracksDialogComponent', () => {
    let component: EditTracksDialogComponent;

    let dialogServiceMock: IMock<DialogServiceBase>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let metadataServiceMock: IMock<MetadataService>;
    let fileMetadataFactoryMock: IMock<FileMetadataFactoryBase>;
    let loggerMock: IMock<Logger>;
    let dialogRefMock: IMock<MatDialogRef<EditTracksDialogComponent>>;
    const dataMock: TrackModel[] = [];

    beforeEach(() => {
        dialogServiceMock = Mock.ofType<DialogServiceBase>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        metadataServiceMock = Mock.ofType<MetadataService>();
        fileMetadataFactoryMock = Mock.ofType<FileMetadataFactoryBase>();
        loggerMock = Mock.ofType<Logger>();
        dialogRefMock = Mock.ofType<MatDialogRef<EditTracksDialogComponent>>();

        component = new EditTracksDialogComponent(
            dialogServiceMock.object,
            translatorServiceMock.object,
            metadataServiceMock.object,
            fileMetadataFactoryMock.object,
            loggerMock.object,
            dialogRefMock.object,
            dataMock,
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
