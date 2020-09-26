import { IMock, Mock } from 'typemoq';
import { MainComponent } from '../../app/components/main/main.component';
import { BaseAppearanceService } from '../../app/services/appearance/base-appearance.service';
import { BaseIndexingService } from '../../app/services/indexing/base-indexing.service';
import { BaseUpdateService } from '../../app/services/update/base-update.service';

export class MainComponentMocker {
    constructor() {
        this.mainComponent = new MainComponent(
            this.appearanceServiceMock.object,
            this.updateServiceMock.object,
            this.indexingServiceMock.object);
    }

    public appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
    public updateServiceMock: IMock<BaseUpdateService> = Mock.ofType<BaseUpdateService>();
    public indexingServiceMock: IMock<BaseIndexingService> = Mock.ofType<BaseIndexingService>();
    public mainComponent: MainComponent;
}
