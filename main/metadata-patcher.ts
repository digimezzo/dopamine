export class MetadataPatcher {
    public static joinUnsplittableMetadata(possiblySplittedMetadata: string[] | undefined): string[] {
        const unsplittableMetadata: string[] = ['AC/DC', 'De/Vision', 'Ghost/Light'];

        if (possiblySplittedMetadata == undefined) {
            return [];
        }

        if (possiblySplittedMetadata.length <= 1) {
            return possiblySplittedMetadata;
        }

        const joinedMetadata: string[] = [];

        const firstPartOfUnsplittableMetadataItems: string[] = [];
        const secondPartOfUnsplittableMetadataItems: string[] = [];

        for (const unsplittableMetadataItem of unsplittableMetadata) {
            firstPartOfUnsplittableMetadataItems.push(unsplittableMetadataItem.split('/')[0].toLowerCase());
            secondPartOfUnsplittableMetadataItems.push(unsplittableMetadataItem.split('/')[1].toLowerCase());
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
