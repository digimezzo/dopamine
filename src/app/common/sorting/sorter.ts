export class Sorter {
    public static naturalSort(a: string, b: string): number {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    }
}
