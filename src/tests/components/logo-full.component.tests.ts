import * as assert from 'assert';
import { LogoFullComponent } from '../../app/components/logo-full/logo-full.component';

describe('LogoFullComponent', () => {
    describe('applicationName', () => {
        it('Should provide correct application name', () => {
            // Arrange & Act
            let logoFullComponent: LogoFullComponent = new LogoFullComponent();

            // Assert
            assert.equal(logoFullComponent.applicationName, "dopamine");
        });
    });
});