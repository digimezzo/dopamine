import * as assert from 'assert';
import { ProductInformation } from '../app/core/base/product-information';

describe('ProductInformation', () => {
    describe('name', () => {
        it('Should provide application name', async () => {
            // Arrange

            // Act
            const applicationName: string = ProductInformation.applicationName;

            // Assert
            assert.ok(applicationName, 'Dopamine');
        });
    });

    describe('version', () => {
        it('Should provide application version', async () => {
            // Arrange

            // Act
            const applicationVersion: string = ProductInformation.applicationVersion;

            // Assert
            assert.ok(applicationVersion, '3.0.0');
        });
    });

    describe('copyright', () => {
        it('Should provide application copyright', async () => {
            // Arrange

            // Act
            const applicationCopyright: string = ProductInformation.applicationCopyright;

            // Assert
            assert.ok(applicationCopyright, 'Copyright Digimezzo Ⓒ 2014 - 2019');
        });
    });
});
