import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseDatabaseMigrator } from '../../common/data/base-database-migrator';
import { BaseScheduler } from '../../common/scheduling/base-scheduler';
import { BaseSettings } from '../../common/settings/base-settings';
import {NavigationServiceBase} from "../../services/navigation/navigation.service.base";
import {AppearanceServiceBase} from "../../services/appearance/appearance.service.base";
import {UpdateServiceBase} from "../../services/update/update.service.base";
import {IndexingServiceBase} from "../../services/indexing/indexing.service.base";
import {FileServiceBase} from "../../services/file/file.service.base";

@Component({
    selector: 'app-loading',
    host: { style: 'display: block' },
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoadingComponent implements OnInit {
    public constructor(
        public navigationService: NavigationServiceBase,
        private databaseMigrator: BaseDatabaseMigrator,
        public appearanceService: AppearanceServiceBase,
        private settings: BaseSettings,
        private updateService: UpdateServiceBase,
        private indexingService: IndexingServiceBase,
        private fileService: FileServiceBase,
        private scheduler: BaseScheduler
    ) {}

    public async ngOnInit(): Promise<void> {
        this.databaseMigrator.migrate();

        if (this.settings.showWelcome) {
            this.settings.showWelcome = false;
            await this.navigationService.navigateToWelcomeAsync();
        } else {
            if (this.fileService.hasPlayableFilesAsParameters()) {
                await this.fileService.enqueueParameterFilesAsync();
                await this.navigationService.navigateToNowPlayingAsync();
            } else {
                await this.navigationService.navigateToCollectionAsync();
                await this.initializeAsync();
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
