import { ExternalComponent } from './external-component';

describe('ExternalComponent', () => {
    describe('constructor', () => {
        it('should set name', () => {
            // Arrange

            // Act
            const externalComponent: ExternalComponent = new ExternalComponent('The name', 'The description', 'The url', 'The license url');

            // Assert
            expect(externalComponent.name).toEqual('The name');
        });

        it('should set description', () => {
            // Arrange

            // Act
            const externalComponent: ExternalComponent = new ExternalComponent('The name', 'The description', 'The url', 'The license url');

            // Assert
            expect(externalComponent.description).toEqual('The description');
        });

        it('should set url', () => {
            // Arrange

            // Act
            const externalComponent: ExternalComponent = new ExternalComponent('The name', 'The description', 'The url', 'The license url');

            // Assert
            expect(externalComponent.url).toEqual('The url');
        });

        it('should set license url', () => {
            // Arrange

            // Act
            const externalComponent: ExternalComponent = new ExternalComponent('The name', 'The description', 'The url', 'The license url');

            // Assert
            expect(externalComponent.licenseUrl).toEqual('The license url');
        });
    });
});
