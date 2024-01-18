import { IMock, Mock, Times } from 'typemoq';
import { ManageAlbumCoversComponent } from './manage-album-covers.component';
import { IndexingServiceBase } from '../../../../services/indexing/indexing.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';

describe('ManageAlbumCoversComponent', () => {
    let settingsMock: IMock<SettingsBase>;
    let indexingServiceMock: IMock<IndexingServiceBase>;

    let component: ManageAlbumCoversComponent;

    beforeEach(() => {
        settingsMock = Mock.ofType<SettingsBase>();
        indexingServiceMock = Mock.ofType<IndexingServiceBase>();

        component = new ManageAlbumCoversComponent(settingsMock.object, indexingServiceMock.object);
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
            const manageAlbumCoversComponent: ManageAlbumCoversComponent = new ManageAlbumCoversComponent(
                settingsMock.object,
                indexingServiceMock.object,
            );

            // Assert
            expect(manageAlbumCoversComponent.settings).toBeDefined();
        });
    });

    describe('refreshAllCoversAsync', () => {
        it('should index artwork only, for all albums', () => {
            // Arrange

            // Act
            component.refreshAllCovers();

            // Assert
            indexingServiceMock.verify((x) => x.indexAlbumArtworkOnly(false), Times.exactly(1));
        });
    });

    describe('refreshMissingCoversAsync', () => {
        it('should index artwork only, for albums with missing covers', () => {
            // Arrange

            // Act
            component.refreshMissingCovers();

            // Assert
            indexingServiceMock.verify((x) => x.indexAlbumArtworkOnly(true), Times.exactly(1));
        });
    });
});
