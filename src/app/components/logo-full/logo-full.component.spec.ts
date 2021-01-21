import { LogoFullComponent } from './logo-full.component';

describe('LogoFullComponent', () => {
    let component: LogoFullComponent;

    beforeEach(() => {
        component = new LogoFullComponent();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('applicationName', () => {
        it('should provide correct application name', () => {
            // Arrange

            // Act

            // Assert
            expect(component.applicationName).toEqual('dopamine');
        });
    });
});
