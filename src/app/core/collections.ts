import { Strings } from './strings';

export class Collections {
    public static getNonNullOrWhiteSpaceStrings(originalCollection: string[]): string[] {
        if (originalCollection === null) {
            return [];
        }

        if (originalCollection === undefined) {
            return [];
        }

        if (originalCollection.length === 0) {
            return [];
        }

        const filteredCollection: string[] = originalCollection.filter(x => !Strings.isNullOrWhiteSpace(x));

        return filteredCollection;
    }
}
