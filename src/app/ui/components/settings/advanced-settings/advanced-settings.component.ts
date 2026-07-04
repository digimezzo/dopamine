import { Component, ViewEncapsulation } from '@angular/core';
import { LogViewer } from '../../../../common/io/log-viewer';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { NavigationServiceBase } from '../../../../services/navigation/navigation.service.base';
import { RatingBackupService } from '../../../../services/rating-backup/rating-backup.service';
import { DialogServiceBase } from '../../../../services/dialog/dialog.service.base';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';

@Component({
    selector: 'app-advanced-settings',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './advanced-settings.component.html',
    styleUrls: ['./advanced-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AdvancedSettingsComponent {
    public constructor(
        public settings: SettingsBase,
        private navigationService: NavigationServiceBase,
        private logViewer: LogViewer,
        private ratingBackupService: RatingBackupService,
        private dialogService: DialogServiceBase,
        private translatorService: TranslatorServiceBase,
    ) {}

    public viewLog(): void {
        this.logViewer.viewLog();
    }

    public async showWelcomeScreenAsync(): Promise<void> {
        await this.navigationService.navigateToWelcomeAsync();
    }

    public async restoreRatingsAsync(): Promise<void> {
        const restoredCount = await this.ratingBackupService.restoreRatingsManuallyAsync();
        const message = this.translatorService.get('ratings-restored-count', { count: restoredCount });
        this.dialogService.showInfoDialog(message);
    }
}
