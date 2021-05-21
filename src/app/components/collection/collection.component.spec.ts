import { IMock, Mock, Times } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { CollectionPersister } from './collection-persister';
import { CollectionComponent } from './collection.component';

describe('CollectionComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let collectionPersisterMock: IMock<CollectionPersister>;

    let component: CollectionComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        collectionPersisterMock = Mock.ofType<CollectionPersister>();

        collectionPersisterMock.setup((x) => x.getSelectedTabIndex()).returns(() => 3);

        component = new CollectionComponent(appearanceServiceMock.object, collectionPersisterMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define appearanceService', async () => {
            // Arrange

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.appearanceService).toBeDefined();
        });
    });

    describe('ngOnInit', () => {
        it('should set the selected index from the settings', async () => {
            // Arrange

            // Act
            await component.ngOnInit();

            // Assert
            expect(component.selectedIndex).toEqual(3);
        });
    });

    describe('selectedIndex', () => {
        it('should save the select tab index to the settings', () => {
            // Arrange

            // Act
            component.selectedIndex = 2;

            // Assert
            collectionPersisterMock.verify((x) => x.setSelectedTabFromTabIndex(2), Times.exactly(1));
        });
    });
});
