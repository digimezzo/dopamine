import { MatDialogRef } from '@angular/material/dialog';
import { IMock, Mock } from 'typemoq';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { EditTracksDialogComponent } from './edit-tracks-dialog.component';
import { TrackModel } from '../../../../services/track/track-model';
import { DialogServiceBase } from '../../../../services/dialog/dialog.service.base';
import { MetadataService } from '../../../../services/metadata/metadata.service';
import { FileMetadataFactoryBase } from '../../../../common/metadata/file-metadata.factory.base';
import { Logger } from '../../../../common/logger';
import { IndexingService } from '../../../../services/indexing/indexing.service';
import { OnlineAlbumArtworkGetter } from '../../../../services/indexing/online-album-artwork-getter';
import { DesktopBase } from '../../../../common/io/desktop.base';
import { ImageProcessor } from '../../../../common/image-processor';

describe('EditTracksDialogComponent', () => {
    let component: EditTracksDialogComponent;

    let dialogServiceMock: IMock<DialogServiceBase>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let metadataServiceMock: IMock<MetadataService>;
    let indexingServiceMock: IMock<IndexingService>;
    let fileMetadataFactoryMock: IMock<FileMetadataFactoryBase>;
    let onlineAlbumArtworkGetterMock: IMock<OnlineAlbumArtworkGetter>;
    let loggerMock: IMock<Logger>;
    let desktopMock: IMock<DesktopBase>;
    let imageProcessorMock: IMock<ImageProcessor>;
    const dataMock: TrackModel[] = [];

    beforeEach(() => {
        dialogServiceMock = Mock.ofType<DialogServiceBase>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        metadataServiceMock = Mock.ofType<MetadataService>();
        indexingServiceMock = Mock.ofType<IndexingService>();
        fileMetadataFactoryMock = Mock.ofType<FileMetadataFactoryBase>();
        onlineAlbumArtworkGetterMock = Mock.ofType<OnlineAlbumArtworkGetter>();
        loggerMock = Mock.ofType<Logger>();
        desktopMock = Mock.ofType<DesktopBase>();
        imageProcessorMock = Mock.ofType<ImageProcessor>();

        component = new EditTracksDialogComponent(
            dialogServiceMock.object,
            translatorServiceMock.object,
            metadataServiceMock.object,
            indexingServiceMock.object,
            fileMetadataFactoryMock.object,
            onlineAlbumArtworkGetterMock.object,
            loggerMock.object,
            desktopMock.object,
            imageProcessorMock.object,
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
