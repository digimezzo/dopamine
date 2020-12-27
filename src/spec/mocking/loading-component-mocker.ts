import { IMock, Mock } from 'typemoq';
import { LoadingComponent } from '../../app/components/loading/loading.component';
import { BaseScheduler } from '../../app/core/scheduler/base-scheduler';
import { BaseDatabaseMigrator } from '../../app/data/base-database-migrator';
import { BaseAppearanceService } from '../../app/services/appearance/base-appearance.service';
import { BaseIndexingService } from '../../app/services/indexing/base-indexing.service';
import { BaseNavigationService } from '../../app/services/navigation/base-navigation.service';
import { BaseUpdateService } from '../../app/services/update/base-update.service';
import { SettingsStub as SettingsStub } from './settings-stub';

export class LoadingComponentMocker {
    constructor(private showWelcome: boolean, private refreshCollectionAutomatically: boolean) {
        this.loadingComponent = new LoadingComponent(
            this.navigationServiceMock.object,
            this.databaseMigratorMock.object,
            this.appearanceServiceMock.object,
            this.settingsStub,
            this.updateServiceMock.object,
            this.indexingServiceMock.object,
            this.schedulerMock.object);
    }

    public appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
    public databaseMigratorMock: IMock<BaseDatabaseMigrator> = Mock.ofType<BaseDatabaseMigrator>();
    public navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
    public settingsStub: SettingsStub = new SettingsStub(this.showWelcome, false, this.refreshCollectionAutomatically);
    public updateServiceMock: IMock<BaseUpdateService> = Mock.ofType<BaseUpdateService>();
    public indexingServiceMock: IMock<BaseIndexingService> = Mock.ofType<BaseIndexingService>();
    public schedulerMock: IMock<BaseScheduler> = Mock.ofType<BaseScheduler>();
    public loadingComponent: LoadingComponent;
}
