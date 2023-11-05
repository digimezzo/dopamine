import { Component, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import {NavigationServiceBase} from "../../../services/navigation/navigation.service.base";
import {TranslatorServiceBase} from "../../../services/translator/translator.service.base";
import {AppearanceServiceBase} from "../../../services/appearance/appearance.service.base";
import {BaseSettings} from "../../../common/settings/base-settings";
import {ContactInformation} from "../../../common/application/contact-information";

@Component({
    selector: 'app-welcome',
    host: { style: 'display: block' },
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class WelcomeComponent {
    public constructor(
        private navigationServiceMock: NavigationServiceBase,
        public translatorService: TranslatorServiceBase,
        public appearanceService: AppearanceServiceBase,
        public settings: BaseSettings,
    ) {}

    public currentStep: number = 0;
    public totalSteps: number = 7;
    public donateUrl: string = ContactInformation.donateUrl;

    public get canGoBack(): boolean {
        return this.currentStep > 0 && this.currentStep < this.totalSteps - 1;
    }

    public get canGoForward(): boolean {
        return this.currentStep < this.totalSteps - 1;
    }

    public get canFinish(): boolean {
        return this.currentStep === this.totalSteps - 1;
    }

    public goBack(stepper: MatStepper): void {
        if (this.canGoBack) {
            stepper.previous();
            this.currentStep--;
        }
    }

    public goForward(stepper: MatStepper): void {
        if (this.canGoForward) {
            stepper.next();
            this.currentStep++;
        }
    }

    public async finishAsync(): Promise<void> {
        await this.navigationServiceMock.navigateToLoadingAsync();
    }
}
