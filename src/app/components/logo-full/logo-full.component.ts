import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Constants } from '../../core/constants';

@Component({
  selector: 'app-logo-full',
  templateUrl: './logo-full.component.html',
  styleUrls: ['./logo-full.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LogoFullComponent implements OnInit {

  constructor() { }

  public applicationName: string = Constants.applicationName.toLowerCase();

  ngOnInit() {
  }

}
