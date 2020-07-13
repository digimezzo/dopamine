import * as assert from 'assert';
import { Times, It, Mock } from 'typemoq';
import { MainComponent } from '../../app/components/main/main.component';
import { AppearanceServiceBase } from '../../app/services/appearance/appearance-service-base';
import { UpdateServiceBase } from '../../app/services/update/update-service-base';
import { IndexingServiceBase } from '../../app/services/indexing/indexing-service-base';

describe('MainComponent', () => {
    describe('ngOnInit', () => {
        it('Should check for updates', () => {
            // Arrange
            const appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
            const updateServiceMock = Mock.ofType<UpdateServiceBase>();
            const indexingServiceMock = Mock.ofType<IndexingServiceBase>();

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
             const appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
             const updateServiceMock = Mock.ofType<UpdateServiceBase>();
             const indexingServiceMock = Mock.ofType<IndexingServiceBase>();

             const mainComponent: MainComponent = new MainComponent(
                 appearanceServiceMock.object,
                 updateServiceMock.object,
                 indexingServiceMock.object);

             // Act
             mainComponent.ngOnInit();

             // Assert
             indexingServiceMock.verify(x => x.startIndexing(), Times.exactly(1));
        });
    });
});
