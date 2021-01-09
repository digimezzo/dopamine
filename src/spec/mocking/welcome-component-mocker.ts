import { IMock, Mock } from 'typemoq';
import { WelcomeComponent } from '../../app/components/welcome/welcome.component';
import { BaseAppearanceService } from '../../app/services/appearance/base-appearance.service';
import { BaseNavigationService } from '../../app/services/navigation/base-navigation.service';
import { BaseTranslatorService } from '../../app/services/translator/base-translator.service';

export class WelcomeComponentMocker {
    constructor() {
        this.welcomeComponent = new WelcomeComponent(
            this.navigationServiceMock.object,
            this.translatorServiceMock.object,
            this.appearanceServiceMock.object
        );
    }

    public appearanceServiceMock: IMock<BaseAppearanceService> = Mock.ofType<BaseAppearanceService>();
    public translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
    public navigationServiceMock: IMock<BaseNavigationService> = Mock.ofType<BaseNavigationService>();
    public welcomeComponent: WelcomeComponent;
}
