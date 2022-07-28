import { Observable } from 'rxjs';
import { Language } from '../../common/application/language';

export abstract class BaseTranslatorService {
    public abstract languageChanged$: Observable<void>;
    public abstract languages: Language[];
    public abstract selectedLanguage: Language;
    public abstract applyLanguageAsync(): void;
    public abstract getAsync(key: string | Array<string>, interpolateParams?: Object): Promise<string>;
    public abstract get(key: string | Array<string>, interpolateParams?: Object): string;
}
