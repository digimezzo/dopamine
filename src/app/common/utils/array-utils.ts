export class ArrayUtils {
    public static isNullOrEmpty(array: any[] | undefined): boolean {
        return array == undefined || array.length === 0;
    }
}