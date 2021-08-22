import { OverlayContainer } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';
import { IMock, Mock } from 'typemoq';
import { BaseRemoteProxy } from '../../common/io/base-remote-proxy';
import { Desktop } from '../../common/io/desktop';
import { FileSystem } from '../../common/io/file-system';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { AppearanceService } from './appearance.service';
import { BaseAppearanceService } from './base-appearance.service';
import { DefaultThemesCreator } from './default-themes-creator';

describe('AppearanceService', () => {
    let settingsMock: IMock<BaseSettings>;
    let loggerMock: IMock<Logger>;
    let overlayContainerMock: IMock<OverlayContainer>;
    let remoteProxyMock: IMock<BaseRemoteProxy>;
    let fileSystemMock: IMock<FileSystem>;
    let desktopMock: IMock<Desktop>;
    let defaultThemesCreator: IMock<DefaultThemesCreator>;

    function createService(): BaseAppearanceService {
        return new AppearanceService(
            settingsMock.object,
            loggerMock.object,
            overlayContainerMock.object,
            remoteProxyMock.object,
            fileSystemMock.object,
            desktopMock.object,
            defaultThemesCreator.object
        );
    }

    beforeEach(() => {
        settingsMock = Mock.ofType<BaseSettings>();
        loggerMock = Mock.ofType<Logger>();
        overlayContainerMock = Mock.ofType<OverlayContainer>();
        remoteProxyMock = Mock.ofType<BaseRemoteProxy>();
        fileSystemMock = Mock.ofType<FileSystem>();
        desktopMock = Mock.ofType<Desktop>();
        defaultThemesCreator = Mock.ofType<DefaultThemesCreator>();

        desktopMock.setup((x) => x.accentColorChanged$).returns(() => new Observable());
        desktopMock.setup((x) => x.nativeThemeUpdated$).returns(() => new Observable());
        // desktopMock.setup((x) => x.shouldUseDarkColors()).returns(() => true);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const service: BaseAppearanceService = createService();

            // Assert
            expect(service).toBeDefined();
        });
    });

    describe('windowHasNativeTitleBar', () => {
        it('should return true if the window has a frame', () => {
            // Arrange
            remoteProxyMock.setup((x) => x.getGlobal('windowHasFrame')).returns(() => true);
            const service: BaseAppearanceService = createService();

            // Act
            const windowHasNativeTitleBar: boolean = service.windowHasNativeTitleBar;

            // Assert
            expect(windowHasNativeTitleBar).toBeTruthy();
        });
    });
});
