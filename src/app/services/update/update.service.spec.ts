import { IMock, It, Mock, Times } from 'typemoq';
import { GitHubApi } from '../../common/api/git-hub/git-hub-api';
import { ProductInformation } from '../../common/application/product-information';
import { BaseDesktop } from '../../common/io/base-desktop';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { UpdateService } from './update.service';

jest.mock('@electron/remote', () => ({ exec: jest.fn() }));

describe('UpdateService', () => {
    let settingsMock: IMock<BaseSettings>;
    let loggerMock: IMock<Logger>;
    let gitHubMock: IMock<GitHubApi>;
    let desktopMock: IMock<BaseDesktop>;

    let service: UpdateService;

    beforeEach(() => {
        settingsMock = Mock.ofType<BaseSettings>();
        loggerMock = Mock.ofType<Logger>();
        gitHubMock = Mock.ofType<GitHubApi>();
        desktopMock = Mock.ofType<BaseDesktop>();

        service = new UpdateService(settingsMock.object, loggerMock.object, gitHubMock.object, desktopMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });

        it('should define isUpdateAvailable as false', () => {
            // Arrange

            // Act

            // Assert
            expect(service.isUpdateAvailable).toBeFalsy();
        });

        it('should define latestRelease as empty', () => {
            // Arrange

            // Act

            // Assert
            expect(service.latestRelease).toEqual('');
        });
    });

    describe('checkForUpdatesAsync', () => {
        it('should not check for updates if not requested', async () => {
            // Arrange
            settingsMock.setup((x) => x.checkForUpdates).returns(() => false);
            settingsMock.setup((x) => x.checkForUpdatesIncludesPreReleases).returns(() => false);
            service = new UpdateService(settingsMock.object, loggerMock.object, gitHubMock.object, desktopMock.object);

            // Act
            await service.checkForUpdatesAsync();

            // Assert
            gitHubMock.verify((x) => x.getLatestReleaseAsync('digimezzo', 'dopamine', It.isAny()), Times.never());
        });

        it('should check for updates excluding pre-releases if requested', async () => {
            // Arrange
            settingsMock.setup((x) => x.checkForUpdates).returns(() => true);
            settingsMock.setup((x) => x.checkForUpdatesIncludesPreReleases).returns(() => false);
            service = new UpdateService(settingsMock.object, loggerMock.object, gitHubMock.object, desktopMock.object);

            // Act
            await service.checkForUpdatesAsync();

            // Assert
            gitHubMock.verify((x) => x.getLatestReleaseAsync('digimezzo', 'dopamine', false), Times.exactly(1));
        });

        it('should check for updates including pre-releases if requested', async () => {
            // Arrange
            settingsMock.setup((x) => x.checkForUpdates).returns(() => true);
            settingsMock.setup((x) => x.checkForUpdatesIncludesPreReleases).returns(() => true);
            service = new UpdateService(settingsMock.object, loggerMock.object, gitHubMock.object, desktopMock.object);

            // Act
            await service.checkForUpdatesAsync();

            // Assert
            gitHubMock.verify((x) => x.getLatestReleaseAsync('digimezzo', 'dopamine', true), Times.exactly(1));
        });

        it('should indicate that an update is available if the latest release is newer than the current release', async () => {
            // Arrange
            gitHubMock.setup((x) => x.getLatestReleaseAsync('digimezzo', 'dopamine', false)).returns(async () => '1000.0.0.0');
            settingsMock.setup((x) => x.checkForUpdatesIncludesPreReleases).returns(() => false);
            service = new UpdateService(settingsMock.object, loggerMock.object, gitHubMock.object, desktopMock.object);

            // Act
            await service.checkForUpdatesAsync();

            // Assert
            expect(service.isUpdateAvailable).toBeTruthy();
            expect(service.latestRelease).toEqual('1000.0.0.0');
        });

        it('should not indicate that an update is available if the latest release is equal to the current release', async () => {
            // Arrange
            gitHubMock
                .setup((x) => x.getLatestReleaseAsync('digimezzo', 'dopamine', false))
                .returns(async () => ProductInformation.applicationVersion);
            settingsMock.setup((x) => x.checkForUpdatesIncludesPreReleases).returns(() => false);
            service = new UpdateService(settingsMock.object, loggerMock.object, gitHubMock.object, desktopMock.object);

            // Act
            await service.checkForUpdatesAsync();

            // Assert
            expect(service.isUpdateAvailable).toBeFalsy();
            expect(service.latestRelease).toEqual('');
        });

        it('should not indicate that an update is available if the latest release is older than the current release', async () => {
            // Arrange
            gitHubMock.setup((x) => x.getLatestReleaseAsync('digimezzo', 'dopamine', false)).returns(async () => '1.0.0');
            settingsMock.setup((x) => x.checkForUpdatesIncludesPreReleases).returns(() => false);
            service = new UpdateService(settingsMock.object, loggerMock.object, gitHubMock.object, desktopMock.object);

            // Act
            await service.checkForUpdatesAsync();

            // Assert
            expect(service.isUpdateAvailable).toBeFalsy();
            expect(service.latestRelease).toEqual('');
        });
    });

    describe('downloadLatestRelease', () => {
        it('should download the latest release', () => {
            // Arrange

            // Act
            service.downloadLatestRelease();

            // Assert
            desktopMock.verify((x) => x.openLink(It.isAny()), Times.exactly(1));
        });
    });
});
