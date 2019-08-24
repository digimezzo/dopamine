import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-settings',
  host: { 'style': 'display: block' },
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
