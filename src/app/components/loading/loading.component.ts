import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BaseScheduler } from '../../core/scheduler/base-scheduler';
import { BaseSettings } from '../../core/settings/base-settings';
import { BaseDatabaseMigrator } from '../../data/base-database-migrator';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseIndexingService } from '../../services/indexing/base-indexing.service';
import { BaseUpdateService } from '../../services/update/base-update.service';

@Component({
    selector: 'app-loading',
    host: { 'style': 'display: block' },
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoadingComponent implements OnInit {

    constructor(
        public router: Router,
        private databaseMigrator: BaseDatabaseMigrator,
        public appearanceService: BaseAppearanceService,
        private settings: BaseSettings,
        private updateService: BaseUpdateService,
        private indexingService: BaseIndexingService,
        private scheduler: BaseScheduler) { }

    public async ngOnInit(): Promise<void> {
        await this.databaseMigrator.migrateAsync();

        if (this.settings.showWelcome) {
            this.settings.showWelcome = false;
            this.router.navigate(['/welcome']);
        } else {
            this.router.navigate(['/collection']);
            this.initializeAsync();
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
