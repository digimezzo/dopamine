import { Component } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { ProductInformation } from './core/productInformation';
import { Router } from '@angular/router';
import { Settings } from './core/settings';
import { Logger } from './core/logger';
import { AppearanceService } from './services/appearance/appearance.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public electronService: ElectronService, private translate: TranslateService, private settings: Settings,
    private logger: Logger, private appearance: AppearanceService, public router: Router) {

    this.appearance.applySelectedTheme();

    this.translate.setDefaultLang(this.settings.defaultLanguage);
    this.translate.use(this.settings.language);
  }

  public ngOnDestroy(): void {
  }

  public async ngOnInit(): Promise<void> {
    this.logger.info(`+++ Started ${ProductInformation.applicationName} ${ProductInformation.applicationVersion} +++`, "AppComponent", "ngOnInit");

    let showWelcome: boolean = this.settings.showWelcome;

    if (showWelcome) {
      // this.settingsService.showWelcome = false;
      this.router.navigate(['/welcome']);
    } else {
      this.router.navigate(['/collection']);
    }
  }
}
