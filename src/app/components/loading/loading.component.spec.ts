import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IMock, Mock } from 'typemoq';
import { BaseScheduler } from '../../core/scheduler/base-scheduler';
import { BaseSettings } from '../../core/settings/base-settings';
import { BaseDatabaseMigrator } from '../../data/base-database-migrator';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseIndexingService } from '../../services/indexing/base-indexing.service';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BaseUpdateService } from '../../services/update/base-update.service';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
    let navigationServiceMock: IMock<BaseNavigationService>;
    let databaseMigratorMock: IMock<BaseDatabaseMigrator>;
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let settingsMock: IMock<BaseSettings>;
    let updateServiceMock: IMock<BaseUpdateService>;
    let indexingServiceMock: IMock<BaseIndexingService>;
    let schedulerMock: IMock<BaseScheduler>;

    let componentWithInjection: LoadingComponent;

    let component: LoadingComponent;
    let fixture: ComponentFixture<LoadingComponent>;

    beforeEach(() => {
        navigationServiceMock = Mock.ofType<BaseNavigationService>();
        databaseMigratorMock = Mock.ofType<BaseDatabaseMigrator>();
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        settingsMock = Mock.ofType<BaseSettings>();
        updateServiceMock = Mock.ofType<BaseUpdateService>();
        indexingServiceMock = Mock.ofType<BaseIndexingService>();
        schedulerMock = Mock.ofType<BaseScheduler>();
        componentWithInjection = new LoadingComponent(
            navigationServiceMock.object,
            databaseMigratorMock.object,
            appearanceServiceMock.object,
            settingsMock.object,
            updateServiceMock.object,
            indexingServiceMock.object,
            schedulerMock.object
        );
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [LoadingComponent],
            providers: [
                { provide: BaseNavigationService, useFactory: () => navigationServiceMock.object },
                { provide: BaseDatabaseMigrator, useFactory: () => databaseMigratorMock.object },
                { provide: BaseAppearanceService, useFactory: () => appearanceServiceMock.object },
                { provide: BaseSettings, useFactory: () => settingsMock.object },
                { provide: BaseUpdateService, useFactory: () => updateServiceMock.object },
                { provide: BaseIndexingService, useFactory: () => indexingServiceMock.object },
                { provide: BaseScheduler, useFactory: () => schedulerMock.object },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoadingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
