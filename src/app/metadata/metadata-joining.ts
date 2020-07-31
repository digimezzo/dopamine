
export class MetadataJoining {
    private static unsplittableMetadata: string[] = ['AC/DC', 'De/Vision', 'Ghost/Light'];

    public static joinUnsplittableMetadata(possiblySplittedMetadata: string[]): string[] {
        if (!possiblySplittedMetadata) {
            return null;
        }

        if (possiblySplittedMetadata.length < 2) {
            return possiblySplittedMetadata;
        }

        const joinedMetadata: string[] = [];

        const firstPartOfUnsplittableMetadataItems: string[] = [];
        const secondPartOfUnsplittableMetadataItems: string[] = [];

        for (const unsplittableMetadataItem of MetadataJoining.unsplittableMetadata) {
            const firstPartOfUnsplittableMetadataItem: string = unsplittableMetadataItem.split('/')[0].toLowerCase();
            firstPartOfUnsplittableMetadataItems.push(firstPartOfUnsplittableMetadataItem);

            const secondPartOfUnsplittableMetadataItem: string = unsplittableMetadataItem.split('/')[1].toLowerCase();
            secondPartOfUnsplittableMetadataItems.push(secondPartOfUnsplittableMetadataItem);
        }

        for (let i: number = 0; i < possiblySplittedMetadata.length; i++) {
            if (firstPartOfUnsplittableMetadataItems.includes(possiblySplittedMetadata[i].toLowerCase())) {
                if (possiblySplittedMetadata.length > i + 1) {
                    if (secondPartOfUnsplittableMetadataItems.includes(possiblySplittedMetadata[i + 1].toLowerCase())) {
                        joinedMetadata.push(`${possiblySplittedMetadata[i]}/${possiblySplittedMetadata[i + 1]}`);
                        i++;
                        continue;
                    }
                }
            }

            joinedMetadata.push(`${possiblySplittedMetadata[i]}`);
        }

        return joinedMetadata;
    }
}
