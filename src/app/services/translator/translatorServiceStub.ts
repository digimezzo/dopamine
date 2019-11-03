import { Injectable } from '@angular/core';
import { Language } from '../../core/language';
import { TranslatorInterface } from './translatorServiceInterface';

@Injectable({
    providedIn: 'root'
})
export class TranslatorServiceStub implements TranslatorInterface {

    public languages: Language[] = [{ code: "en", name: "English" }];

    public get selectedLanguage(): Language {
        return new Language('en', 'English');
    }

    public set selectedLanguage(v: Language) {
        this.applyLanguage();
    }

    public applyLanguage(): void {
    }
}
