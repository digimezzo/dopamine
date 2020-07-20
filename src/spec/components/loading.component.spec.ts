import * as assert from 'assert';
import { Times, It, Mock, IMock } from 'typemoq';
import { Router } from '@angular/router';
import { BaseAppearanceService } from '../../app/services/appearance/base-appearance.service';
import { LoadingComponent } from '../../app/components/loading/loading.component';
import { BaseDatabaseMigrator } from '../../app/data/base-database-migrator';

describe('LoadingComponent', () => {
    describe('ngOnInit', () => {
        it('Should perform database migrations', async () => {
            // Arrange
            const appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
            const databaseMigratorMock: IMock<BaseDatabaseMigrator> = Mock.ofType<BaseDatabaseMigrator>();
            const routerMock: IMock<Router> = Mock.ofType<Router>();

            const loadingComponent: LoadingComponent = new LoadingComponent(
                routerMock.object,
                databaseMigratorMock.object,
                appearanceServiceMock.object);

            // Act
            await loadingComponent.ngOnInit();

            // Assert
            databaseMigratorMock.verify(x => x.migrateAsync(), Times.exactly(1));
        });

        it('Should navigate to main', async () => {
            // Arrange
            const appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
            const databaseMigratorMock: IMock<BaseDatabaseMigrator> = Mock.ofType<BaseDatabaseMigrator>();
            const routerMock: IMock<Router> = Mock.ofType<Router>();

            const loadingComponent: LoadingComponent = new LoadingComponent(
                routerMock.object,
                databaseMigratorMock.object,
                appearanceServiceMock.object);

            // Act
            await loadingComponent.ngOnInit();

            // Assert
            routerMock.verify(x => x.navigate(['/main']), Times.exactly(1));
        });
    });
});
