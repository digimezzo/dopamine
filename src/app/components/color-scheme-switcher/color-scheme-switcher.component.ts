import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColorScheme } from '../../core/color-scheme';
import { AppearanceServiceBase } from '../../services/appearance/appearance-service-base';

@Component({
  selector: 'app-color-scheme-switcher',
  host: { 'style': 'display: block' },
  templateUrl: './color-scheme-switcher.component.html',
  styleUrls: ['./color-scheme-switcher.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ColorSchemeSwitcherComponent implements OnInit {
  constructor(public appearanceService: AppearanceServiceBase) { }

  public ngOnInit(): void {
  }

  public setColorScheme(colorScheme: ColorScheme): void {
    this.appearanceService.selectedColorScheme = colorScheme;
  }
}
