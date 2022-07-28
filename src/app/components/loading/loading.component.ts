import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseDatabaseMigrator } from '../../common/data/base-database-migrator';
import { BaseScheduler } from '../../common/scheduling/base-scheduler';
import { BaseSettings } from '../../common/settings/base-settings';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseFileService } from '../../services/file/base-file.service';
import { BaseIndexingService } from '../../services/indexing/base-indexing.service';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BaseUpdateService } from '../../services/update/base-update.service';

@Component({
    selector: 'app-loading',
    host: { style: 'display: block' },
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoadingComponent implements OnInit {
    constructor(
        public navigationService: BaseNavigationService,
        private databaseMigrator: BaseDatabaseMigrator,
        public appearanceService: BaseAppearanceService,
        private settings: BaseSettings,
        private updateService: BaseUpdateService,
        private indexingService: BaseIndexingService,
        private fileService: BaseFileService,
        private scheduler: BaseScheduler
    ) {}

    public async ngOnInit(): Promise<void> {
        await this.databaseMigrator.migrateAsync();

        if (this.settings.showWelcome) {
            this.settings.showWelcome = false;
            this.navigationService.navigateToWelcome();
        } else {
            if (this.fileService.hasPlayableFilesAsParameters()) {
                await this.fileService.enqueueParameterFilesAsync();
                this.navigationService.navigateToNowPlaying();
            } else {
                this.navigationService.navigateToCollection();
                this.initializeAsync();
            }
        }
    }

    private async initializeAsync(): Promise<void> {
        await this.scheduler.sleepAsync(2000);

        if (this.settings.refreshCollectionAutomatically) {
            await this.indexingService.indexCollectionIfOutdatedAsync();
        }

        await this.updateService.checkForUpdatesAsync();
    }
}
