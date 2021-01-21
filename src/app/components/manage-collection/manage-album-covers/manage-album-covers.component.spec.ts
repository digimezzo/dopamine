import { IMock, Mock, Times } from 'typemoq';
import { BaseSettings } from '../../../core/settings/base-settings';
import { BaseIndexingService } from '../../../services/indexing/base-indexing.service';
import { ManageAlbumCoversComponent } from './manage-album-covers.component';

describe('ManageAlbumCoversComponent', () => {
    let settingsMock: IMock<BaseSettings>;
    let indexingServiceMock: IMock<BaseIndexingService>;

    let component: ManageAlbumCoversComponent;

    beforeEach(() => {
        settingsMock = Mock.ofType<BaseSettings>();
        indexingServiceMock = Mock.ofType<BaseIndexingService>();

        component = new ManageAlbumCoversComponent(settingsMock.object, indexingServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeTruthy();
        });

        it('should set settings', () => {
            // Arrange

            // Act
            const manageAlbumCoversComponent: ManageAlbumCoversComponent = new ManageAlbumCoversComponent(
                settingsMock.object,
                indexingServiceMock.object
            );

            // Assert
            expect(manageAlbumCoversComponent.settings).toBeTruthy();
        });
    });

    describe('refreshAllCoversAsync', () => {
        it('should index artwork only, for all albums', async () => {
            // Arrange

            // Act
            await component.refreshAllCoversAsync();

            // Assert
            indexingServiceMock.verify((x) => x.indexAlbumArtworkOnlyAsync(false), Times.exactly(1));
        });
    });

    describe('refreshMissingCoversAsync', () => {
        it('should index artwork only, for albums with missing covers', async () => {
            // Arrange

            // Act
            await component.refreshMissingCoversAsync();

            // Assert
            indexingServiceMock.verify((x) => x.indexAlbumArtworkOnlyAsync(true), Times.exactly(1));
        });
    });
});
