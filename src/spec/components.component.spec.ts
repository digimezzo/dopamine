import * as assert from 'assert';
import { ComponentsComponent } from '../app/components/information/components/components.component';
import { ExternalComponent } from '../app/core/base/external-component';

describe('ComponentsComponent', () => {
    describe('externalComponents', () => {
        it('should return a list of external components', async () => {
            // Arrange
            const componentsComponent: ComponentsComponent = new ComponentsComponent();

            // Act
            const externalComponents: ExternalComponent[] = componentsComponent.externalComponents;

            // Assert
            assert.ok(externalComponents.length > 0);
        });
    });
});
