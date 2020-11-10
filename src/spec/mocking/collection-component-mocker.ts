import { IMock, Mock } from 'typemoq';
import { CollectionComponent } from '../../app/components/collection/collection.component';
import { BaseAppearanceService } from '../../app/services/appearance/base-appearance.service';

export class CollectionComponentMocker {
    constructor() {
        this.collectionComponent = new CollectionComponent(
            this.appearanceServiceMock.object);
    }

    public appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
    public collectionComponent: CollectionComponent;
}
