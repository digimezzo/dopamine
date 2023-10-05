import { Observable } from 'rxjs';
import { Language } from '../../common/application/language';

export abstract class BaseTranslatorService {
    public abstract languageChanged$: Observable<void>;
    public abstract languages: Language[];
    public abstract selectedLanguage: Language;
    public abstract applyLanguage(): void;
    public abstract getAsync(key: string | Array<string>, interpolateParams?: object): Promise<string>;
    public abstract get(key: string | Array<string>, interpolateParams?: object): string;
}
