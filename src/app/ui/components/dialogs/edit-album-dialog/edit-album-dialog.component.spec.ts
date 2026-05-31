import { IMock, Mock } from 'typemoq';
import { EditAlbumDialogComponent } from './edit-album-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { AlbumArtworkCacheServiceBase } from '../../../../services/album-artwork-cache/album-artwork-cache.service.base';
import { AlbumArtworkRepositoryBase } from '../../../../data/repositories/album-artwork-repository.base';
import { LastfmApi } from '../../../../common/api/lastfm/lastfm.api';
import { ImageProcessor } from '../../../../common/image-processor';
import { ApplicationPaths } from '../../../../common/application/application-paths';
import { TrackRepositoryBase } from '../../../../data/repositories/track-repository.base';
import { DesktopBase } from '../../../../common/io/desktop.base';
import { FileAccessBase } from '../../../../common/io/file-access.base';
import { FileMetadataFactoryBase } from '../../../../common/metadata/file-metadata.factory.base';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { Logger } from '../../../../common/logger';
import { AlbumModel } from '../../../../services/album/album-model';
import { AlbumData } from '../../../../data/entities/album-data';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';

describe('EditAlbumDialogComponent', () => {
    let dialogRefMock: IMock<MatDialogRef<EditAlbumDialogComponent>>;
    let albumArtworkCacheServiceMock: IMock<AlbumArtworkCacheServiceBase>;
    let albumArtworkRepositoryMock: IMock<AlbumArtworkRepositoryBase>;
    let lastfmApiMock: IMock<LastfmApi>;
    let imageProcessorMock: IMock<ImageProcessor>;
    let applicationPathsMock: IMock<ApplicationPaths>;
    let trackRepositoryMock: IMock<TrackRepositoryBase>;
    let desktopMock: IMock<DesktopBase>;
    let fileAccessMock: IMock<FileAccessBase>;
    let fileMetadataFactoryMock: IMock<FileMetadataFactoryBase>;
    let settingsMock: IMock<SettingsBase>;
    let loggerMock: IMock<Logger>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;

    beforeEach(() => {
        dialogRefMock = Mock.ofType<MatDialogRef<EditAlbumDialogComponent>>();
        albumArtworkCacheServiceMock = Mock.ofType<AlbumArtworkCacheServiceBase>();
        albumArtworkRepositoryMock = Mock.ofType<AlbumArtworkRepositoryBase>();
        lastfmApiMock = Mock.ofType<LastfmApi>();
        imageProcessorMock = Mock.ofType<ImageProcessor>();
        applicationPathsMock = Mock.ofType<ApplicationPaths>();
        trackRepositoryMock = Mock.ofType<TrackRepositoryBase>();
        desktopMock = Mock.ofType<DesktopBase>();
        fileAccessMock = Mock.ofType<FileAccessBase>();
        fileMetadataFactoryMock = Mock.ofType<FileMetadataFactoryBase>();
        settingsMock = Mock.ofType<SettingsBase>();
        loggerMock = Mock.ofType<Logger>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();

        dialogRefMock.setup((x) => x.afterClosed()).returns(() => ({ subscribe: () => {} }) as any);
    });

    function createAlbumModel(): AlbumModel {
        const albumData = new AlbumData();
        albumData.albumKey = 'testKey';
        return new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);
    }

    it('should create', () => {
        // Arrange, Act
        const component = new EditAlbumDialogComponent(
            [createAlbumModel()],
            dialogRefMock.object,
            albumArtworkCacheServiceMock.object,
            albumArtworkRepositoryMock.object,
            lastfmApiMock.object,
            imageProcessorMock.object,
            applicationPathsMock.object,
            trackRepositoryMock.object,
            desktopMock.object,
            fileAccessMock.object,
            fileMetadataFactoryMock.object,
            settingsMock.object,
            loggerMock.object,
        );

        // Assert
        expect(component).toBeDefined();
    });
});
