import { Component } from '@angular/core';
import { WelcomeServiceBase } from '../../../../services/welcome/welcome.service.base';

@Component({
    selector: 'app-welcome-greeting',
    host: { style: 'display: block' },
    templateUrl: './welcome-greeting.component.html',
    styleUrls: ['./welcome-greeting.component.scss'],
})
export class WelcomeGreetingComponent {
    public constructor(private welcomeService: WelcomeServiceBase) {}

    public get isLoaded(): boolean {
        return this.welcomeService.isLoaded;
    }
}
