import * as assert from 'assert';
import { Times, It, Mock } from 'typemoq';
import { MainComponent } from '../app/components/main/main.component';
import { BaseAppearanceService } from '../app/services/appearance/base-appearance.service';
import { BaseUpdateService } from '../app/services/update/base-update.service';
import { BaseIndexingService } from '../app/services/indexing/base-indexing.service';

describe('MainComponent', () => {
    describe('ngOnInit', () => {
        it('Should check for updates', () => {
            // Arrange
            const appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
            const updateServiceMock = Mock.ofType<BaseUpdateService>();
            const indexingServiceMock = Mock.ofType<BaseIndexingService>();

            const mainComponent: MainComponent = new MainComponent(
                appearanceServiceMock.object,
                updateServiceMock.object,
                indexingServiceMock.object);

            // Act
            mainComponent.ngOnInit();

            // Assert
            updateServiceMock.verify(x => x.checkForUpdatesAsync(), Times.exactly(1));
        });

        it('Should start indexing', () => {
             // Arrange
             const appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
             const updateServiceMock = Mock.ofType<BaseUpdateService>();
             const indexingServiceMock = Mock.ofType<BaseIndexingService>();

             const mainComponent: MainComponent = new MainComponent(
                 appearanceServiceMock.object,
                 updateServiceMock.object,
                 indexingServiceMock.object);

             // Act
             mainComponent.ngOnInit();

             // Assert
             indexingServiceMock.verify(x => x.startIndexingAsync(), Times.exactly(1));
        });
    });
});
