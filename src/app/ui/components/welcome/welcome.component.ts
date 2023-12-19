import { Component, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { WelcomeServiceBase } from '../../../services/welcome/welcome.service.base';
import { AnimatedPage } from '../animated-page';
import { enterLeftToRight, enterRightToLeft } from '../../animations/animations';

@Component({
    selector: 'app-welcome',
    host: { style: 'display: block' },
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [enterLeftToRight, enterRightToLeft],
})
export class WelcomeComponent extends AnimatedPage {
    public constructor(
        public appearanceService: AppearanceServiceBase,
        private welcomeService: WelcomeServiceBase,
    ) {
        super();
    }

    public totalPages: number = 7;

    public get currentPage(): number {
        return this.page;
    }

    public set currentPage(value: number) {
        this.page = value;
    }

    public get isLoaded(): boolean {
        return this.welcomeService.isLoaded;
    }
}
