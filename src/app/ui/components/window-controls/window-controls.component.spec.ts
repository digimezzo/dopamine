import { IMock, Mock } from 'typemoq';
import { WindowControlsComponent } from './window-controls.component';
import { ApplicationBase } from '../../../common/io/application.base';

describe('WindowControlsComponent', () => {
    let applicationMock: IMock<ApplicationBase>;

    let component: WindowControlsComponent;

    beforeEach(() => {
        applicationMock = Mock.ofType<ApplicationBase>();
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
