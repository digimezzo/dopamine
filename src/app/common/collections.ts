export class Collections {
    public static groupBy(list: any, keyGetter: any): Map<any, any> {
        const map: Map<any, any> = new Map();

        list.forEach((item: any) => {
            const key: any = keyGetter(item);
            const collection: any = map.get(key);

            if (collection == undefined) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });

        return map;
    }

    public static getPreviousItem<T>(items: T[], currentIndex: number): T | undefined {
        let previousItem: T | undefined = undefined;

        if (currentIndex > 0) {
            previousItem = items[currentIndex - 1];
        }

        return previousItem;
    }

    public static getNextItem<T>(items: T[], currentIndex: number): T | undefined {
        let nextItem: T | undefined = undefined;

        if (currentIndex < items.length - 1) {
            nextItem = items[currentIndex + 1];
        }

        return nextItem;
    }
}
