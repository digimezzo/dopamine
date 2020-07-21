import { Component, OnInit, OnDestroy } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { ProductInformation } from './core/product-information';
import { Router } from '@angular/router';
import { Settings } from './core/settings';
import { Logger } from './core/logger';
import { BaseTranslatorService } from './services/translator/base-translator.service';
import { BaseAppearanceService } from './services/appearance/base-appearance.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(public electronService: ElectronService, private translator: BaseTranslatorService,
    private logger: Logger, private appearance: BaseAppearanceService, public router: Router) {

    this.appearance.applyTheme();
    this.appearance.applyFontSize();
    this.translator.applyLanguage();
  }

  public ngOnDestroy(): void {
  }

  public async ngOnInit(): Promise<void> {
    this.logger.info(
      `+++ Started ${ProductInformation.applicationName} ${ProductInformation.applicationVersion} +++`,
      'AppComponent',
      'ngOnInit');

    this.router.navigate(['/loading']);
  }
}
