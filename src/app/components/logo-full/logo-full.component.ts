import { Component, OnInit, Input } from '@angular/core';
import { Constants } from '../../core/constants';

@Component({
  selector: 'app-logo-full',
  templateUrl: './logo-full.component.html',
  styleUrls: ['./logo-full.component.scss']
})
export class LogoFullComponent implements OnInit {

  constructor() { }

  @Input() textColor: string;
  public applicationName: string = Constants.applicationName.toUpperCase();

  ngOnInit() {
  }

}
