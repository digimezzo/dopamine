import { Component } from '@angular/core';
import { ContactInformation } from '../../../../common/application/contact-information';
import { DesktopBase } from '../../../../common/io/desktop.base';

@Component({
    selector: 'app-welcome-donate',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './welcome-donate.component.html',
    styleUrls: ['./welcome-donate.component.scss'],
})
export class WelcomeDonateComponent {
    public constructor(private desktop: DesktopBase) {}

    public async openDonateUrlAsync(): Promise<void> {
        await this.desktop.openLinkAsync(ContactInformation.donateUrl);
    }
}
