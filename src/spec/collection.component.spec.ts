import * as assert from 'assert';
import { CollectionComponentMocker } from './mocking/collection-component-mocker';

describe('CollectionComponent', () => {
    describe('ngOnInit', () => {
        it('Should set appearanceService', async () => {
            // Arrange
            const mocker: CollectionComponentMocker = new CollectionComponentMocker();

            // Act
            await mocker.collectionComponent.ngOnInit();

            // Assert
            assert.ok(mocker.collectionComponent.appearanceService != undefined);
        });
    });
});
