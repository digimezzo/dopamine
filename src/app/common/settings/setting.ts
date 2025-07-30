export class Setting<T> {
    public readonly key: string;
    public readonly defaultValue: T;

    public constructor(key: string, defaultValue: T) {
        this.key = key;
        this.defaultValue = defaultValue;
    }
}
