import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseTranslateServiceProxy } from './base-translate-service-proxy';

@Injectable()
export class TranslateServiceProxy implements BaseTranslateServiceProxy {
    public constructor(private translateService: TranslateService) {}

    public setDefaultLang(lang: string): void {
        this.translateService.setDefaultLang(lang);
    }

    public async use(lang: string): Promise<any> {
        return await this.translateService.use(lang).toPromise();
    }

    public async get(key: string | string[], interpolateParams?: Object): Promise<any> {
        return await this.translateService.get(key, interpolateParams).toPromise();
    }

    public instant(key: string | string[], interpolateParams?: Object): string | any {
        return this.translateService.instant(key, interpolateParams);
    }
}
