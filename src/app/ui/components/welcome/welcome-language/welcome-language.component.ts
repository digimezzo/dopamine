import { Component } from '@angular/core';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';

@Component({
    selector: 'app-welcome-language',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './welcome-language.component.html',
    styleUrls: ['./welcome-language.component.scss'],
})
export class WelcomeLanguageComponent {
    public constructor(public translatorService: TranslatorServiceBase) {}
}
