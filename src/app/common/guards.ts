export class Guards {
    public static isDefined<T>(value: T | undefined | null): boolean {
        return <T>value !== undefined && <T>value !== null;
    }
}
