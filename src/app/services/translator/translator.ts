import { Language } from '../../core/language';

export abstract class Translator {
    public abstract languages: Language[];
    public abstract selectedLanguage: Language;
    public abstract applyLanguage(): void;
}
