import { StringUtils } from './string-utils';

export class CollectionUtils {
    public static groupBy<S, T>(list: T[], keyGetter: (T) => S): Map<S, T[]> {
        const map: Map<S, T[]> = new Map();

        list.forEach((item: T) => {
            const key: S = keyGetter(item);
            const collection: T[] | undefined = map.get(key);

            if (collection == undefined) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });

        return map;
    }

    public static getPreviousItem<T>(items: T[], currentIndex: number): T | undefined {
        let previousItem: T | undefined;

        if (currentIndex > 0) {
            previousItem = items[currentIndex - 1];
        }

        return previousItem;
    }

    public static getNextItem<T>(items: T[], currentIndex: number): T | undefined {
        let nextItem: T | undefined;

        if (currentIndex < items.length - 1) {
            nextItem = items[currentIndex + 1];
        }

        return nextItem;
    }

    public static includesIgnoreCase(array: string[], value: string): boolean {
        return array.some((item) => item.toLowerCase() === value.toLowerCase());
    }

    public static toString(itemsAsCollection: string[] | undefined): string {
        if (!itemsAsCollection) {
            return '';
        }

        if (itemsAsCollection.length === 0) {
            return '';
        }

        return `[${itemsAsCollection.join('][')}]`;
    }

    public static fromString(itemsAsString: string | undefined): string[] {
        if (StringUtils.isNullOrWhiteSpace(itemsAsString)) {
            return [];
        }

        if (!itemsAsString!.startsWith('[') || !itemsAsString!.endsWith(']')) {
            return [itemsAsString!];
        }

        return itemsAsString!.slice(1, -1).split('][');
    }

    public static toCommaSeparatedString(items: (string | undefined)[] | undefined): string {
        if (!items) {
            return '';
        }

        if (items.length === 0) {
            return '';
        }

        return items
            .filter((x) => !StringUtils.isNullOrWhiteSpace(x))
            .map((x) => x!.trim())
            .join(', ');
    }

    public static toSemicolonSeparatedString(items: (string | undefined)[] | undefined): string {
        if (!items) {
            return '';
        }

        if (items.length === 0) {
            return '';
        }

        return items
            .filter((x) => !StringUtils.isNullOrWhiteSpace(x))
            .map((x) => x!.trim())
            .join(';');
    }

    public static fromSemicolonSeparatedString(itemsAsString: string | undefined): string[] {
        if (StringUtils.isNullOrWhiteSpace(itemsAsString)) {
            return [];
        }

        return itemsAsString!
            .split(';')
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
    }
}
