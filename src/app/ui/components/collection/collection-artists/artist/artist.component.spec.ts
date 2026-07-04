import { IMock, Mock, Times } from 'typemoq';
import { ArtistComponent } from './artist.component';
import { AppearanceServiceBase } from '../../../../../services/appearance/appearance.service.base';
import { SemanticZoomServiceBase } from '../../../../../services/semantic-zoom/semantic-zoom.service.base';
import { SettingsBase } from '../../../../../common/settings/settings.base';
import { SettingsMock } from '../../../../../testing/settings-mock';

describe('GenreComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let semanticZoomServiceMock: IMock<SemanticZoomServiceBase>;
    let settingsMock: SettingsBase;
    let component: ArtistComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        semanticZoomServiceMock = Mock.ofType<SemanticZoomServiceBase>();
        settingsMock = new SettingsMock();
        component = new ArtistComponent(appearanceServiceMock.object, semanticZoomServiceMock.object, settingsMock);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should declare artist', () => {
            // Arrange

            // Act

            // Assert
            expect(component.artist).toBeUndefined();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toBeDefined();
        });

        it('should define semanticZoomService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.semanticZoomService).toBeDefined();
        });
    });

    describe('requestZoomOut', () => {
        it('should request zoom out', () => {
            // Arrange

            // Act
            component.requestZoomOut();

            // Assert
            semanticZoomServiceMock.verify((x) => x.requestZoomOut(), Times.once());
        });
    });
});
