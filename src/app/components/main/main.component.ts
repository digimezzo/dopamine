import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Appearance } from '../../services/appearance/appearance';

@Component({
  selector: 'app-main',
  host: { 'style': 'display: block' },
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {

  constructor(public appearance: Appearance) { }

  public ngOnInit(): void {
  }
}
