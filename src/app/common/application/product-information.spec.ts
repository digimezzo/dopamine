import { ProductInformation } from './product-information';

describe('ProductInformation', () => {
    describe('name', () => {
        it('should provide application name', async () => {
            // Arrange

            // Act
            const applicationName: string = ProductInformation.applicationName;

            // Assert
            expect(applicationName).toEqual('Dopamine');
        });
    });

    describe('version', () => {
        it('should provide application version', async () => {
            // Arrange

            // Act
            const applicationVersion: string = ProductInformation.applicationVersion;

            // Assert
            expect(applicationVersion).toEqual('3.0.0-preview.20');
        });
    });

    describe('copyright', () => {
        it('should provide application copyright', async () => {
            // Arrange

            // Act
            const applicationCopyright: string = ProductInformation.applicationCopyright;

            // Assert
            expect(applicationCopyright).toEqual('Copyright Digimezzo Ⓒ 2014 - 2023');
        });
    });
});
