import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ContactInformation } from '../../common/application/contact-information';
import { BaseSettings } from '../../common/settings/base-settings';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';

@Component({
    selector: 'app-welcome',
    host: { style: 'display: block' },
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class WelcomeComponent implements OnInit {
    constructor(
        private navigationServiceMock: BaseNavigationService,
        public translatorService: BaseTranslatorService,
        public appearanceService: BaseAppearanceService,
        public settings: BaseSettings
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

    public ngOnInit(): void {}

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

    public finish(): void {
        this.navigationServiceMock.navigateToLoading();
    }
}
