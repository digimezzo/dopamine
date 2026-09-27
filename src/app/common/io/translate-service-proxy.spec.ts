import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TranslateServiceProxy } from './translate-service-proxy';

describe('TranslateServiceProxy', () => {
    it('reloads a language when switching back, without clearing the active language', async () => {
        const resetLang = jest.fn();
        const translateService = {
            currentLang: 'en',
            resetLang,
            use: jest.fn((language: string) => {
                translateService.currentLang = language;
                return of({});
            }),
        } as unknown as TranslateService;
        const proxy = new TranslateServiceProxy(translateService);

        await proxy.use('en');
        expect(resetLang).not.toHaveBeenCalled();

        await proxy.use('de');
        await proxy.use('en');

        expect(resetLang).toHaveBeenNthCalledWith(1, 'de');
        expect(resetLang).toHaveBeenNthCalledWith(2, 'en');
    });
});