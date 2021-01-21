import { MetadataPatcher } from './metadata-patcher';

describe('MetadataPatcher', () => {
    describe('joinUnsplittableMetadata', () => {
        it('should return and empty collection if the metadata collection is undefined', () => {
            // Arrange
            const metadataPatcher: MetadataPatcher = new MetadataPatcher();
            const possiblySplittedMetadata: string[] = undefined;

            // Act
            const joinedMetadata: string[] = metadataPatcher.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            expect(joinedMetadata).toEqual([]);
        });

        it('should return an empty collection if the collection is empty', () => {
            // Arrange
            const metadataPatcher: MetadataPatcher = new MetadataPatcher();
            const possiblySplittedMetadata: string[] = [];

            // Act
            const joinedMetadata: string[] = metadataPatcher.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            expect(joinedMetadata).toEqual([]);
        });

        it('should return the same collection if the collection does not contain unsplittable values', () => {
            // Arrange
            const metadataPatcher: MetadataPatcher = new MetadataPatcher();
            const possiblySplittedMetadata: string[] = ['Artist 1', 'Artist 2', 'Artist 3'];

            // Act
            const joinedMetadata: string[] = metadataPatcher.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            expect(joinedMetadata).toEqual(possiblySplittedMetadata);
        });

        it('should return the same collection if the collection contains only 1 value', () => {
            // Arrange
            const metadataPatcher: MetadataPatcher = new MetadataPatcher();
            const possiblySplittedMetadata: string[] = ['Artist 1'];

            // Act
            const joinedMetadata: string[] = metadataPatcher.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            expect(joinedMetadata).toEqual(possiblySplittedMetadata);
        });

        it('should return joined values if the collection contains two-part unsplittable values with correct casing', () => {
            // Arrange
            const metadataPatcher: MetadataPatcher = new MetadataPatcher();
            const possiblySplittedMetadata: string[] = ['Artist 1', 'AC', 'DC', 'Artist 2', 'De', 'Vision', 'Ghost', 'Light'];

            // Act
            const joinedMetadata: string[] = metadataPatcher.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            expect(joinedMetadata).toEqual(['Artist 1', 'AC/DC', 'Artist 2', 'De/Vision', 'Ghost/Light']);
        });

        it('should return joined values if the collection contains two-part unsplittable values with incorrect casing', () => {
            // Arrange
            const metadataPatcher: MetadataPatcher = new MetadataPatcher();
            const possiblySplittedMetadata: string[] = ['Artist 1', 'ac', 'dC', 'Artist 2', 'dE', 'viSion', 'ghOst', 'LigHt'];

            // Act
            const joinedMetadata: string[] = metadataPatcher.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            expect(joinedMetadata).toEqual(['Artist 1', 'ac/dC', 'Artist 2', 'dE/viSion', 'ghOst/LigHt']);
        });
    });
});
