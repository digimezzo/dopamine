import * as assert from 'assert';
import { Collections } from '../app/core/collections';

describe('Collections', () => {
    describe('getNonNullOrWhiteSpaceStrings', () => {
        it('Should return an empty collection if original collection is null', () => {
            // Arrange
            const originalCollection: string[] = null;
            const expectedCollection: string[] = [];

            // Act
            const actualCollection: string[] = Collections.getNonNullOrWhiteSpaceStrings(originalCollection);

            // Assert
            assert.deepStrictEqual(actualCollection, expectedCollection);
        });

        it('Should return an empty collection if original collection is undefined', () => {
            // Arrange
            const originalCollection: string[] = undefined;
            const expectedCollection: string[] = [];

            // Act
            const actualCollection: string[] = Collections.getNonNullOrWhiteSpaceStrings(originalCollection);

            // Assert
            assert.deepStrictEqual(actualCollection, expectedCollection);
        });

        it('Should return an empty collection if original collection is empty', () => {
            // Arrange
            const originalCollection: string[] = [];
            const expectedCollection: string[] = [];

            // Act
            const actualCollection: string[] = Collections.getNonNullOrWhiteSpaceStrings(originalCollection);

            // Assert
            assert.deepStrictEqual(actualCollection, expectedCollection);
        });

        it('Should return the same collection if original collection contains only non white space strings', () => {
            // Arrange
            const originalCollection: string[] = ['String 1', 'String 2', 'String 3'];
            const expectedCollection: string[] = ['String 1', 'String 2', 'String 3'];

            // Act
            const actualCollection: string[] = Collections.getNonNullOrWhiteSpaceStrings(originalCollection);

            // Assert
            assert.deepStrictEqual(actualCollection, expectedCollection);
        });

        it('Should return a collection with all null elements removed from the original collection', () => {
            // Arrange
            const originalCollection: string[] = ['String 1', null, 'String 3'];
            const expectedCollection: string[] = ['String 1', 'String 3'];

            // Act
            const actualCollection: string[] = Collections.getNonNullOrWhiteSpaceStrings(originalCollection);

            // Assert
            assert.deepStrictEqual(actualCollection, expectedCollection);
        });

        it('Should return a collection with all undefined elements removed from the original collection', () => {
            // Arrange
            const originalCollection: string[] = ['String 1', undefined, 'String 3'];
            const expectedCollection: string[] = ['String 1', 'String 3'];

            // Act
            const actualCollection: string[] = Collections.getNonNullOrWhiteSpaceStrings(originalCollection);

            // Assert
            assert.deepStrictEqual(actualCollection, expectedCollection);
        });

        it('Should return a collection with all empty elements removed from the original collection', () => {
            // Arrange
            const originalCollection: string[] = ['String 1', '', 'String 3'];
            const expectedCollection: string[] = ['String 1', 'String 3'];

            // Act
            const actualCollection: string[] = Collections.getNonNullOrWhiteSpaceStrings(originalCollection);

            // Assert
            assert.deepStrictEqual(actualCollection, expectedCollection);
        });
    });
});
