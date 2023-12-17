import { Component } from '@angular/core';
import { ContactInformation } from '../../../../common/application/contact-information';

@Component({
    selector: 'app-welcome-donate',
    templateUrl: './welcome-donate.component.html',
    styleUrls: ['./welcome-donate.component.scss'],
})
export class WelcomeDonateComponent {
    public get donateUrl(): string {
        return ContactInformation.donateUrl;
    }
}
