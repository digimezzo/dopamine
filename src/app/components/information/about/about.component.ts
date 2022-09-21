import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ContactInformation } from '../../../common/application/contact-information';
import { ProductInformation } from '../../../common/application/product-information';
import { BaseDesktop } from '../../../common/io/base-desktop';
import { BaseDialogService } from '../../../services/dialog/base-dialog.service';

@Component({
    selector: 'app-about',
    host: { style: 'display: block' },
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AboutComponent implements OnInit {
    constructor(private dialogService: BaseDialogService, private desktop: BaseDesktop) {}

    public applicationVersion: string = ProductInformation.applicationVersion;
    public applicationCopyright: string = ProductInformation.applicationCopyright;
    public websiteUrl: string = ContactInformation.websiteUrl;
    public twitterUrl: string = ContactInformation.twitterUrl;
    public githubUrl: string = ContactInformation.githubUrl;

    public ngOnInit(): void {}

    public showLicenseDialog(): void {
        this.dialogService.showLicenseDialog();
    }

    public browseToDonateLink(): void {
        this.desktop.openLink(ContactInformation.donateUrl);
    }
}
