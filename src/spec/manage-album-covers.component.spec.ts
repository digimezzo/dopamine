import * as assert from 'assert';
import { IMock, Mock, Times } from 'typemoq';
import { ManageAlbumCoversComponent } from '../app/components/manage-collection/manage-album-covers/manage-album-covers.component';
import { BaseSettings } from '../app/core/settings/base-settings';
import { BaseIndexingService } from '../app/services/indexing/base-indexing.service';

describe('ManageAlbumCoversComponent', () => {
    describe('constructor', () => {
        it('Should set settings', () => {
            // Arrange
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const indexingServiceMock: IMock<BaseIndexingService> = Mock.ofType<BaseIndexingService>();

            // Act
            const manageAlbumCoversComponent: ManageAlbumCoversComponent = new ManageAlbumCoversComponent(
                settingsMock.object,
                indexingServiceMock.object);

            // Assert
            assert.ok(manageAlbumCoversComponent.settings != undefined);
        });
    });

    describe('refreshAllCoversAsync', () => {
        it('Should index artwork only, for all albums', async () => {
            // Arrange
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const indexingServiceMock: IMock<BaseIndexingService> = Mock.ofType<BaseIndexingService>();
            const manageAlbumCoversComponent: ManageAlbumCoversComponent = new ManageAlbumCoversComponent(
                settingsMock.object,
                indexingServiceMock.object);

            // Act
            await manageAlbumCoversComponent.refreshAllCoversAsync();

            // Assert
            indexingServiceMock.verify(x => x.indexAlbumArtworkOnlyAsync(false), Times.exactly(1));
        });
    });

    describe('refreshMissingCoversAsync', () => {
        it('Should index artwork only, for albums with missing covers', async () => {
            // Arrange
            const settingsMock: IMock<BaseSettings> = Mock.ofType<BaseSettings>();
            const indexingServiceMock: IMock<BaseIndexingService> = Mock.ofType<BaseIndexingService>();
            const manageAlbumCoversComponent: ManageAlbumCoversComponent = new ManageAlbumCoversComponent(
                settingsMock.object,
                indexingServiceMock.object);

            // Act
            await manageAlbumCoversComponent.refreshMissingCoversAsync();


            // Assert
            indexingServiceMock.verify(x => x.indexAlbumArtworkOnlyAsync(true), Times.exactly(1));
        });
    });
});
