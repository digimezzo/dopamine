import { Router } from '@angular/router';
import { IMock, Mock } from 'typemoq';
import { WelcomeComponent } from '../../app/components/welcome/welcome.component';
import { BaseAppearanceService } from '../../app/services/appearance/base-appearance.service';
import { BaseTranslatorService } from '../../app/services/translator/base-translator.service';

export class WelcomeComponentMocker {
    constructor() {
        this.welcomeComponent = new WelcomeComponent(
            this.routerMock.object,
            this.translatorServiceMock.object,
            this.appearanceServiceMock.object);
    }

    public appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
    public translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
    public routerMock: IMock<Router> = Mock.ofType<Router>();
    public welcomeComponent: WelcomeComponent;
}
