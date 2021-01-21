import { IMock, Mock } from 'typemoq';
import { GitHubApi } from '../../core/api/git-hub/git-hub-api';
import { Logger } from '../../core/logger';
import { BaseSettings } from '../../core/settings/base-settings';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';
import { UpdateService } from './update.service';

describe('UpdateService', () => {
    let snackBarService: IMock<BaseSnackBarService>;
    let settings: IMock<BaseSettings>;
    let logger: IMock<Logger>;
    let gitHub: IMock<GitHubApi>;

    let service: UpdateService;

    beforeEach(() => {
        snackBarService = Mock.ofType<BaseSnackBarService>();
        settings = Mock.ofType<BaseSettings>();
        logger = Mock.ofType<Logger>();
        gitHub = Mock.ofType<GitHubApi>();

        service = new UpdateService(snackBarService.object, settings.object, logger.object, gitHub.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });
    });
});
