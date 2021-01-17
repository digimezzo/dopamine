import * as assert from 'assert';
import { LogoFullComponent } from './logo-full.component';

describe('LogoFullComponent', () => {
    let component: LogoFullComponent;

    beforeEach(() => {
        component = new LogoFullComponent();
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
