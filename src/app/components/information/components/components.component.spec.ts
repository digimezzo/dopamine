import assert from 'assert';
import { ExternalComponent } from '../../../core/base/external-component';
import { ComponentsComponent } from './components.component';

describe('ComponentsComponent', () => {
    let component: ComponentsComponent;

    beforeEach(() => {
        component = new ComponentsComponent();
    });

    describe('externalComponents', () => {
        it('should return a list of external components', async () => {
            // Arrange

            // Act
            const externalComponents: ExternalComponent[] = component.externalComponents;

            // Assert
            assert.ok(externalComponents.length > 0);
        });
    });
});
