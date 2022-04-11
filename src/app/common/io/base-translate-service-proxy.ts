export abstract class BaseTranslateServiceProxy {
    public abstract setDefaultLang(lang: string): void;
    public abstract use(lang: string): Promise<any>;
    public abstract get(key: string | Array<string>, interpolateParams?: Object): Promise<string | any>;
    public abstract instant(key: string | Array<string>, interpolateParams?: Object): string | any;
}
