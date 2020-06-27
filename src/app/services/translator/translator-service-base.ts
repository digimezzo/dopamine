import { Language } from '../../core/language';

export abstract class TranslatorServiceBase {
    public abstract languages: Language[];
    public abstract selectedLanguage: Language;
    public abstract applyLanguage(): void;
    public abstract getAsync(key: string | Array<string>, interpolateParams?: Object): Promise<string>;
}
