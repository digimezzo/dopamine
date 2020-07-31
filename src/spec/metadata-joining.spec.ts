import * as assert from 'assert';
import { MetadataJoining } from '../app/metadata/metadata-joining';

describe('MetadataJoining', () => {
    describe('joinUnsplittableMetadata', () => {
        it('Should return null if the metadata collection is null', () => {
            // Arrange
            const possiblySplittedMetadata: string[] = null;

            // Act
            const joinedMetadata: string[] = MetadataJoining.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            assert.strictEqual(joinedMetadata, null);
        });

        it('Should return null if the metadata collection is undefined', () => {
            // Arrange
            const possiblySplittedMetadata: string[] = undefined;

            // Act
            const joinedMetadata: string[] = MetadataJoining.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            assert.strictEqual(joinedMetadata, null);
        });

        it('Should return an empty collection if the collection is empty', () => {
            // Arrange
            const possiblySplittedMetadata: string[] = [];

            // Act
            const joinedMetadata: string[] = MetadataJoining.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            assert.deepStrictEqual(joinedMetadata, []);
        });

        it('Should return the same collection if the collection does not contain unsplittable values', () => {
            // Arrange
            const possiblySplittedMetadata: string[] = ['Artist 1', 'Artist 2', 'Artist 3'];

            // Act
            const joinedMetadata: string[] = MetadataJoining.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            assert.deepStrictEqual(joinedMetadata, possiblySplittedMetadata);
        });

        it('Should return the same collection if the collection contains only 1 value', () => {
            // Arrange
            const possiblySplittedMetadata: string[] = ['Artist 1'];

            // Act
            const joinedMetadata: string[] = MetadataJoining.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            assert.deepStrictEqual(joinedMetadata, possiblySplittedMetadata);
        });

        it('Should return joined values if the collection contains two-part unsplittable values with correct casing', () => {
            // Arrange
            const possiblySplittedMetadata: string[] = ['Artist 1', 'AC', 'DC', 'Artist 2', 'De', 'Vision', 'Ghost', 'Light'];

            // Act
            const joinedMetadata: string[] = MetadataJoining.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            assert.deepStrictEqual(joinedMetadata, ['Artist 1', 'AC/DC', 'Artist 2', 'De/Vision', 'Ghost/Light']);
        });

        it('Should return joined values if the collection contains two-part unsplittable values with incorrect casing', () => {
            // Arrange
            const possiblySplittedMetadata: string[] = ['Artist 1', 'ac', 'dC', 'Artist 2', 'dE', 'viSion', 'ghOst', 'LigHt'];

            // Act
            const joinedMetadata: string[] = MetadataJoining.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            assert.deepStrictEqual(joinedMetadata, ['Artist 1', 'ac/dC', 'Artist 2', 'dE/viSion', 'ghOst/LigHt']);
        });
    });
});
