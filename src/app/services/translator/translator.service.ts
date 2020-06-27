import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Settings } from '../../core/settings';
import { Language } from '../../core/language';
import { Constants } from '../../core/constants';
import { TranslatorServiceBase } from './translator-service-base';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService implements TranslatorServiceBase {
  constructor(private translate: TranslateService, private settings: Settings) {
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
