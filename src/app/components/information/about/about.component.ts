import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ContactInformation } from '../../../core/base/contact-information';
import { ProductInformation } from '../../../core/base/product-information';

@Component({
  selector: 'app-about',
  host: { 'style': 'display: block' },
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutComponent implements OnInit {

  constructor() { }

  public applicationVersion: string = ProductInformation.applicationVersion;
  public applicationCopyright: string = ProductInformation.applicationCopyright;
  public websiteUrl: string = ContactInformation.websiteUrl;
  public twitterUrl: string = ContactInformation.twitterUrl;
  public githubUrl: string = ContactInformation.githubUrl;

  public ngOnInit(): void {
  }
}
