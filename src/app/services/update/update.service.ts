import { Injectable } from '@angular/core';
import { GitHubApi } from '../../common/api/git-hub/git-hub-api';
import { ProductInformation } from '../../common/application/product-information';
import { BaseDesktop } from '../../common/io/base-desktop';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { BaseUpdateService } from './base-update.service';
import { VersionComparer } from './version-comparer';
@Injectable()
export class UpdateService implements BaseUpdateService {
    public _isUpdateAvailable: boolean = false;
    private _latestRelease: string = '';

    constructor(private settings: BaseSettings, private logger: Logger, private gitHub: GitHubApi, private desktop: BaseDesktop) {}

    public get isUpdateAvailable(): boolean {
        return this._isUpdateAvailable;
    }

    public get latestRelease(): string {
        return this._latestRelease;
    }

    public async checkForUpdatesAsync(): Promise<void> {
        if (this.settings.checkForUpdates) {
            this.logger.info('Checking for updates', 'UpdateService', 'checkForUpdatesAsync');

            try {
                const currentRelease: string = ProductInformation.applicationVersion;
                const latestRelease: string = await this.gitHub.getLatestReleaseAsync(
                    'digimezzo',
                    ProductInformation.applicationName.toLowerCase(),
                    this.settings.checkForUpdatesIncludesPreReleases
                );

                this.logger.info(`Current=${currentRelease}, Latest=${latestRelease}`, 'UpdateService', 'checkForUpdatesAsync');

                if (VersionComparer.isNewerVersion(currentRelease, latestRelease)) {
                    this.logger.info(
                        `Latest (${latestRelease}) > Current (${currentRelease}). Notifying user.`,
                        'UpdateService',
                        'checkForUpdatesAsync'
                    );

                    this._isUpdateAvailable = true;
                    this._latestRelease = latestRelease;
                } else {
                    this.logger.info(
                        `Latest (${latestRelease}) <= Current (${currentRelease}). Nothing to do.`,
                        'UpdateService',
                        'checkForUpdatesAsync'
                    );
                }
            } catch (e) {
                this.logger.error(`Could not check for updates. Error: ${e.message}`, 'UpdateService', 'checkForUpdatesAsync');
            }
        } else {
            this.logger.info('Not checking for updates', 'UpdateService', 'checkForUpdatesAsync');
        }
    }

    public downloadLatestRelease(): void {
        this.desktop.openLink(
            `https://github.com/digimezzo/${ProductInformation.applicationName.toLowerCase()}/releases/tag/v${this.latestRelease}`
        );
    }
}
