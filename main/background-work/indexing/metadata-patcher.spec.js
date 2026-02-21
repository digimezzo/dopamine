const { MetadataPatcher, UNSPLITTABLE_METADATA } = require('./metadata-patcher.js');

describe('MetadataPatcher', () => {
    function randomCase(str) {
        return [...str].map((ch) => (Math.random() > 0.5 ? ch.toUpperCase() : ch.toLowerCase())).join('');
    }

    describe('joinUnsplittableMetadata', () => {
        it('should return and empty collection if the metadata collection is undefined', () => {
            // Arrange
            const metadataPatcher = new MetadataPatcher();
            const possiblySplittedMetadata = undefined;

            // Act
            const joinedMetadata = metadataPatcher.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            expect(joinedMetadata).toEqual([]);
        });

        it('should return an empty collection if the collection is empty', () => {
            // Arrange
            const metadataPatcher = new MetadataPatcher();
            const possiblySplittedMetadata = [];

            // Act
            const joinedMetadata = metadataPatcher.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            expect(joinedMetadata).toEqual([]);
        });

        it('should return the same collection if the collection does not contain unsplittable values', () => {
            // Arrange
            const metadataPatcher = new MetadataPatcher();
            const possiblySplittedMetadata = ['Artist 1', 'Artist 2', 'Artist 3'];

            // Act
            const joinedMetadata = metadataPatcher.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            expect(joinedMetadata).toEqual(possiblySplittedMetadata);
        });

        it('should return the same collection if the collection contains only 1 value', () => {
            // Arrange
            const metadataPatcher = new MetadataPatcher();
            const possiblySplittedMetadata = ['Artist 1'];

            // Act
            const joinedMetadata = metadataPatcher.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            expect(joinedMetadata).toEqual(possiblySplittedMetadata);
        });

        it('should return joined values if the collection contains two-part unsplittable values with correct casing', () => {
            // Arrange
            const metadataPatcher = new MetadataPatcher();
            const possiblySplittedMetadata = [
                'Artist 1',
                ...UNSPLITTABLE_METADATA.flatMap((original) => original.split('/').map((part) => part)),
                'Artist 2',
            ];

            // Act
            const joinedMetadata = metadataPatcher.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            expect(joinedMetadata).toEqual(expect.arrayContaining(['Artist 1', ...UNSPLITTABLE_METADATA, 'Artist 2']));
        });

        it('should return joined values if the collection contains two-part unsplittable values with incorrect casing', () => {
            // Arrange
            const metadataPatcher = new MetadataPatcher();
            const unsplittableMetaDataWithRandomCasing = UNSPLITTABLE_METADATA.map((part) => randomCase(part));
            const possiblySplittedMetadata = [
                'ArTist 1',
                ...unsplittableMetaDataWithRandomCasing.flatMap((original) => original.split('/').map((part) => part)),
                'ArtiSt 2',
            ];

            // Act
            const joinedMetadata = metadataPatcher.joinUnsplittableMetadata(possiblySplittedMetadata);

            // Assert
            expect(joinedMetadata).toEqual(expect.arrayContaining(['ArTist 1', ...unsplittableMetaDataWithRandomCasing, 'ArtiSt 2']));
        });
    });
});
