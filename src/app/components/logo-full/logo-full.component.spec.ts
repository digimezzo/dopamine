import * as assert from 'assert';
import { LogoFullComponent } from './logo-full.component';

describe('LogoFullComponent', () => {
    let component: LogoFullComponent;

    beforeEach(() => {
        component = new LogoFullComponent();
    });

    it('should create', () => {
        // Arrange

        // Act

        // Assert
        assert.ok(component);
    });

    describe('applicationName', () => {
        it('should provide correct application name', () => {
            // Arrange

            // Act

            // Assert
            assert.strictEqual(component.applicationName, 'dopamine');
        });
    });
});
