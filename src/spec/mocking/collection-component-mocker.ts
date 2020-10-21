import { IMock, Mock } from 'typemoq';
import { CollectionComponent } from '../../app/components/collection/collection.component';
import { BaseScheduler } from '../../app/core/scheduler/base-scheduler';
import { BaseAppearanceService } from '../../app/services/appearance/base-appearance.service';
import { BaseIndexingService } from '../../app/services/indexing/base-indexing.service';
import { BaseUpdateService } from '../../app/services/update/base-update.service';

export class CollectionComponentMocker {
    constructor() {
        this.collectionComponent = new CollectionComponent(
            this.appearanceServiceMock.object,
            this.updateServiceMock.object,
            this.indexingServiceMock.object,
            this.schedulerMock.object);
    }

    public appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
    public updateServiceMock: IMock<BaseUpdateService> = Mock.ofType<BaseUpdateService>();
    public indexingServiceMock: IMock<BaseIndexingService> = Mock.ofType<BaseIndexingService>();
    public schedulerMock: IMock<BaseScheduler> = Mock.ofType<BaseScheduler>();
    public collectionComponent: CollectionComponent;
}
