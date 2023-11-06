export abstract class TranslateServiceProxyBase {
    public abstract setDefaultLang(lang: string): void;
    public abstract use(lang: string): Promise<void>;
    public abstract get(key: string | Array<string>, interpolateParams?: object): Promise<string>;
    public abstract instant(key: string | Array<string>, interpolateParams?: object): string;
}
