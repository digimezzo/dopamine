import { Language } from "../../core/language";

export interface TranslatorInterface {
    languages: Language[];
    selectedLanguage: Language;
    applyLanguage(): void;

}
