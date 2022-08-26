import { IMock, Mock } from 'typemoq';
import { BaseApplication } from '../../common/io/base-application';
import { WindowControlsComponent } from './window-controls.component';

describe('WindowControlsComponent', () => {
    let applicationMock: IMock<BaseApplication>;

    let component: WindowControlsComponent;

    beforeEach(() => {
        applicationMock = Mock.ofType<BaseApplication>();
        component = new WindowControlsComponent(applicationMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });
    });
});
