import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Constants } from '../../common/application/constants';
import { Language } from '../../common/application/language';
import { PromiseUtils } from '../../common/utils/promise-utils';
import { TranslatorServiceBase } from './translator.service.base';
import { TranslateServiceProxyBase } from '../../common/io/translate-service-proxy.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { UserTranslations } from './user-translations';

@Injectable()
export class TranslatorService implements TranslatorServiceBase {
    private languageChanged: Subject<void> = new Subject();

    public constructor(
        private translateServiceProxy: TranslateServiceProxyBase,
        private settings: SettingsBase,
        private userTranslations: UserTranslations,
    ) {
        this.translateServiceProxy.setDefaultLang(this.settings.defaultLanguage);
        this.refreshLanguages();
    }

    public languageChanged$: Observable<void> = this.languageChanged.asObservable();

    public languages: Language[] = Constants.languages;

    public get translationsDirectoryPath(): string {
        return this.userTranslations.directoryPath;
    }

    public compareLanguages(first: Language, second: Language): boolean {
        return first?.code === second?.code;
    }

    public refreshLanguages(): void {
        const languages = [...Constants.languages];
        for (const language of this.userTranslations.getLanguages()) {
            const existingIndex = languages.findIndex((item) => item.code === language.code);
            if (existingIndex === -1) {
                languages.push(language);
            } else {
                languages[existingIndex] = language;
            }
        }
        this.languages = languages;
    }

    public get selectedLanguage(): Language {
        return this.languages.find((x) => x.code === this.settings.language)!;
    }

    public set selectedLanguage(v: Language) {
        this.settings.language = v.code;
        PromiseUtils.noAwait(this.applyLanguage());
    }

    public async applyLanguage(): Promise<void> {
        await this.translateServiceProxy.use(this.settings.language);
        this.languageChanged.next();
    }

    public async getAsync(key: string | Array<string>, interpolateParams?: object): Promise<string> {
        return await this.translateServiceProxy.get(key, interpolateParams);
    }

    public get(key: string | Array<string>, interpolateParams?: object): string {
        return this.translateServiceProxy.instant(key, interpolateParams);
    }
}
