import { UpdateServiceBase } from './update-service-base';
import { Injectable } from '@angular/core';
import { Settings } from '../../core/settings';
import { Logger } from '../../core/logger';
import { VersionComparer } from '../../core/version-comparer';
import { GitHubApi } from '../../core/github-api';
import { ProductInformation } from '../../core/product-information';
import { SnackbarServiceBase } from '../snack-bar/snack-bar-service-base';

@Injectable({
    providedIn: 'root'
  })
export class UpdateService implements UpdateServiceBase {
    constructor(private snackBar: SnackbarServiceBase, private settings: Settings, private logger: Logger,
        private gitHub: GitHubApi) {
    }

    public async checkForUpdatesAsync(): Promise<void> {
        if (this.settings.checkForUpdates) {
            this.logger.info('Checking for updates', 'UpdateService', 'checkForUpdatesAsync');

            try {
                const currentRelease: string = ProductInformation.applicationVersion;
                const latestRelease: string = await this.gitHub.getLastestReleaseAsync('digimezzo', 'vitomu');

                this.logger.info(
                    `Current=${currentRelease}, Latest=${latestRelease}`,
                    'UpdateService',
                    'checkForUpdatesAsync');

                if (VersionComparer.isNewerVersion(currentRelease, latestRelease)) {
                    this.logger.info(
                        `Latest (${latestRelease}) > Current (${currentRelease}). Notifying user.`,
                        'UpdateService',
                        'checkForUpdatesAsync');
                        await this.snackBar.notifyOfNewVersionAsync(latestRelease);
                } else {
                    this.logger.info(
                        `Latest (${latestRelease}) <= Current (${currentRelease}). Nothing to do.`,
                        'UpdateService',
                        'checkForUpdatesAsync');
                }
            } catch (error) {
                this.logger.error(`Could not check for updates. Cause: ${error}`, 'UpdateService', 'checkForUpdatesAsync');
            }
        } else {
            this.logger.info('Not checking for updates', 'UpdateService', 'checkForUpdatesAsync');
        }
    }
}
