export class Guards {
    public static isUndefined<T>(value: T | undefined | null): boolean {
        return <T>value === undefined || <T>value === null;
    }
}
