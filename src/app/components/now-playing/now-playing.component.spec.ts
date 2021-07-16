import { IMock, Mock } from 'typemoq';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { NowPlayingComponent } from './now-playing.component';

describe('NowPlayingComponent', () => {
    let appearanceServiceMock: IMock<BaseAppearanceService>;
    let component: NowPlayingComponent;

    beforeEach(() => {
        appearanceServiceMock = Mock.ofType<BaseAppearanceService>();
        component = new NowPlayingComponent(appearanceServiceMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });

        it('should define appearanceService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.appearanceService).toBeDefined();
        });
    });
});
