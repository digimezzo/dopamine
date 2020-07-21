import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../../core/base/language';
import { Constants } from '../../core/base/constants';
import { BaseTranslatorService } from './base-translator.service';
import { BaseSettings } from '../../core/settings/base-settings';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService implements BaseTranslatorService {
  constructor(
    private translate: TranslateService,
    private settings: BaseSettings) {
    this.translate.setDefaultLang(this.settings.defaultLanguage);
  }

  public languages: Language[] = Constants.languages;

  public get selectedLanguage(): Language {
    return this.languages.find(x => x.code === this.settings.language);
  }

  public set selectedLanguage(v: Language) {
    this.settings.language = v.code;
    this.translate.use(v.code);
  }

  public applyLanguage(): void {
    this.translate.use(this.settings.language);
  }

  public getAsync(key: string | Array<string>, interpolateParams?: Object): Promise<string> {
    return this.translate.get(key, interpolateParams).toPromise();
  }
}
