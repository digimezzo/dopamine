import { Router } from '@angular/router';
import { IMock, Mock } from 'typemoq';
import { LoadingComponent } from '../../app/components/loading/loading.component';
import { BaseDatabaseMigrator } from '../../app/data/base-database-migrator';
import { BaseAppearanceService } from '../../app/services/appearance/base-appearance.service';
import { SettingsMock } from './settings-mock';

export class LoadingComponentMock {
    constructor(private showWelcome: boolean) {
        this.loadingComponent = new LoadingComponent(
            this.routerMock.object,
            this.databaseMigratorMock.object,
            this.appearanceServiceMock.object,
            this.settingsMock);
    }

    public appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
    public databaseMigratorMock: IMock<BaseDatabaseMigrator> = Mock.ofType<BaseDatabaseMigrator>();
    public routerMock: IMock<Router> = Mock.ofType<Router>();
    public settingsMock: SettingsMock = new SettingsMock(this.showWelcome);
    public loadingComponent: LoadingComponent;
}
