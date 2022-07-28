import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Constants } from '../../common/application/constants';
import { Language } from '../../common/application/language';
import { BaseTranslateServiceProxy } from '../../common/io/base-translate-service-proxy';
import { BaseSettings } from '../../common/settings/base-settings';
import { BaseTranslatorService } from './base-translator.service';

@Injectable()
export class TranslatorService implements BaseTranslatorService {
    private languageChanged: Subject<void> = new Subject();

    public constructor(private translateServiceProxy: BaseTranslateServiceProxy, private settings: BaseSettings) {
        this.translateServiceProxy.setDefaultLang(this.settings.defaultLanguage);
    }

    public languageChanged$: Observable<void> = this.languageChanged.asObservable();

    public languages: Language[] = Constants.languages;

    public get selectedLanguage(): Language {
        return this.languages.find((x) => x.code === this.settings.language);
    }

    public set selectedLanguage(v: Language) {
        this.settings.language = v.code;
        this.applyLanguageAsync();
    }

    public async applyLanguageAsync(): Promise<void> {
        await this.translateServiceProxy.use(this.settings.language);
        this.languageChanged.next();
    }

    public async getAsync(key: string | Array<string>, interpolateParams?: Object): Promise<string> {
        return await this.translateServiceProxy.get(key, interpolateParams);
    }

    public get(key: string | Array<string>, interpolateParams?: Object): string {
        return this.translateServiceProxy.instant(key, interpolateParams);
    }
}
