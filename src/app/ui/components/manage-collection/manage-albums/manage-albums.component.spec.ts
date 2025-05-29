import { IMock, Mock, Times } from 'typemoq';
import { ManageAlbumsComponent } from './manage-albums.component';
import { IndexingService } from '../../../../services/indexing/indexing.service';
import { SettingsBase } from '../../../../common/settings/settings.base';

describe('ManageAlbumsComponent', () => {
    let settingsMock: IMock<SettingsBase>;
    let indexingServiceMock: IMock<IndexingService>;

    let component: ManageAlbumsComponent;

    beforeEach(() => {
        settingsMock = Mock.ofType<SettingsBase>();
        indexingServiceMock = Mock.ofType<IndexingService>();

        component = new ManageAlbumsComponent(settingsMock.object, indexingServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define settings', () => {
            // Arrange

            // Act
            const manageAlbumCoversComponent: ManageAlbumsComponent = new ManageAlbumsComponent(
                settingsMock.object,
                indexingServiceMock.object,
            );

            // Assert
            expect(manageAlbumCoversComponent.settings).toBeDefined();
        });
    });

    describe('refreshAllCoversAsync', () => {
        it('should index artwork only, for all albums', async () => {
            // Act
            await component.refreshAllCoversAsync();

            // Assert
            indexingServiceMock.verify((x) => x.indexAlbumArtworkOnlyAsync(false), Times.exactly(1));
        });
    });

    describe('refreshMissingCoversAsync', () => {
        it('should index artwork only, for albums with missing covers', async () => {
            // Act
            await component.refreshMissingCoversAsync();

            // Assert
            indexingServiceMock.verify((x) => x.indexAlbumArtworkOnlyAsync(true), Times.exactly(1));
        });
    });
});
