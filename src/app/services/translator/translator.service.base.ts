import { Observable } from 'rxjs';
import { Language } from '../../common/application/language';

export abstract class TranslatorServiceBase {
    public abstract languageChanged$: Observable<void>;
    public abstract languages: Language[];
    public abstract translationsDirectoryPath: string;
    public abstract selectedLanguage: Language;
    public abstract compareLanguages(first: Language, second: Language): boolean;
    public abstract refreshLanguages(): void;
    public abstract applyLanguage(): void;
    public abstract getAsync(key: string | Array<string>, interpolateParams?: object): Promise<string>;
    public abstract get(key: string | Array<string>, interpolateParams?: object): string;
}
