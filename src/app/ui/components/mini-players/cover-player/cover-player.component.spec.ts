import { CoverPlayerComponent } from './cover-player.component';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { IMock, Mock } from 'typemoq';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

describe('CoverPlayerComponent', () => {
    let appearanceServiceMock: IMock<AppearanceServiceBase>;
    let matBottomSheetMock: IMock<MatBottomSheet>;

    let component: CoverPlayerComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<AppearanceServiceBase>();
        matBottomSheetMock = Mock.ofType<MatBottomSheet>();
        component = new CoverPlayerComponent(appearanceServiceMock.object, matBottomSheetMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Assert
            expect(component).toBeDefined();
        });
    });
});
