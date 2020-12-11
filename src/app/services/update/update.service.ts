import { Injectable } from '@angular/core';
import { ProductInformation } from '../../core/base/product-information';
import { Logger } from '../../core/logger';
import { BaseSettings } from '../../core/settings/base-settings';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';
import { BaseUpdateService } from './base-update.service';
import { GitHubApi } from './github-api';
import { VersionComparer } from './version-comparer';
@Injectable({
    providedIn: 'root'
})
export class UpdateService implements BaseUpdateService {
    constructor(
        private snackBarService: BaseSnackBarService,
        private settings: BaseSettings,
        private logger: Logger,
        private gitHub: GitHubApi) {
    }

    public async checkForUpdatesAsync(): Promise<void> {
        if (this.settings.checkForUpdates) {
            this.logger.info('Checking for updates', 'UpdateService', 'checkForUpdatesAsync');

            try {
                const currentRelease: string = ProductInformation.applicationVersion;
                const latestRelease: string = await this.gitHub.getLatestReleaseAsync('digimezzo', ProductInformation.applicationName);

                this.logger.info(
                    `Current=${currentRelease}, Latest=${latestRelease}`,
                    'UpdateService',
                    'checkForUpdatesAsync');

                if (VersionComparer.isNewerVersion(currentRelease, latestRelease)) {
                    this.logger.info(
                        `Latest (${latestRelease}) > Current (${currentRelease}). Notifying user.`,
                        'UpdateService',
                        'checkForUpdatesAsync');
                    await this.snackBarService.newVersionAvailable(latestRelease);
                } else {
                    this.logger.info(
                        `Latest (${latestRelease}) <= Current (${currentRelease}). Nothing to do.`,
                        'UpdateService',
                        'checkForUpdatesAsync');
                }
            } catch (e) {
                this.logger.error(`Could not check for updates. Error: ${e.message}`, 'UpdateService', 'checkForUpdatesAsync');
            }
        } else {
            this.logger.info('Not checking for updates', 'UpdateService', 'checkForUpdatesAsync');
        }
    }
}
