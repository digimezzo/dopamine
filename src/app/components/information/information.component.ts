import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-information',
  host: { 'style': 'display: block' },
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InformationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
