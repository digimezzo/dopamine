export class CollectionGrouper {
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
}
