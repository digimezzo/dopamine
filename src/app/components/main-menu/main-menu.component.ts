import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-main-menu',
  host: { 'style': 'display: block' },
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainMenuComponent implements OnInit {

  constructor() { }

  public ngOnInit(): void {
  }
}
