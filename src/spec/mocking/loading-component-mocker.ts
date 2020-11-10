import { Router } from '@angular/router';
import { IMock, Mock } from 'typemoq';
import { LoadingComponent } from '../../app/components/loading/loading.component';
import { BaseScheduler } from '../../app/core/scheduler/base-scheduler';
import { BaseDatabaseMigrator } from '../../app/data/base-database-migrator';
import { BaseAppearanceService } from '../../app/services/appearance/base-appearance.service';
import { BaseIndexingService } from '../../app/services/indexing/base-indexing.service';
import { BaseUpdateService } from '../../app/services/update/base-update.service';
import { SettingsMock } from './settings-mock';

export class LoadingComponentMocker {
    constructor(private showWelcome: boolean) {
        this.loadingComponent = new LoadingComponent(
            this.routerMock.object,
            this.databaseMigratorMock.object,
            this.appearanceServiceMock.object,
            this.settingsMock,
            this.updateServiceMock.object,
            this.indexingServiceMock.object,
            this.schedulerMock.object);
    }

    public appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
    public databaseMigratorMock: IMock<BaseDatabaseMigrator> = Mock.ofType<BaseDatabaseMigrator>();
    public routerMock: IMock<Router> = Mock.ofType<Router>();
    public settingsMock: SettingsMock = new SettingsMock(this.showWelcome, false);
    public updateServiceMock: IMock<BaseUpdateService> = Mock.ofType<BaseUpdateService>();
    public indexingServiceMock: IMock<BaseIndexingService> = Mock.ofType<BaseIndexingService>();
    public schedulerMock: IMock<BaseScheduler> = Mock.ofType<BaseScheduler>();
    public loadingComponent: LoadingComponent;
}
