import { CoverPlayerComponent } from './cover-player.component';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { IMock, Mock } from 'typemoq';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NavigationServiceBase } from '../../../../services/navigation/navigation.service.base';

describe('CoverPlayerComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let navigationServiceMock: IMock<NavigationServiceBase>;
    let matBottomSheetMock: IMock<MatBottomSheet>;

    let component: CoverPlayerComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        navigationServiceMock = Mock.ofType<NavigationServiceBase>();
        matBottomSheetMock = Mock.ofType<MatBottomSheet>();
        component = new CoverPlayerComponent(appearanceServiceMock.object, navigationServiceMock.object, matBottomSheetMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Assert
            expect(component).toBeDefined();
        });
    });
});
