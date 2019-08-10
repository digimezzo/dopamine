import { Component } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { ProductInformation } from './core/productInformation';
import { LoggerService } from './services/logger/logger.service';
import { remote } from 'electron';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SettingsService } from './services/settings/settings.service';
import { Router } from '@angular/router';
import { Constants } from './core/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private globalEmitter = remote.getGlobal('globalEmitter');
  private themeChangedListener: any = this.applyTheme.bind(this);

  constructor(public electronService: ElectronService, private translateService: TranslateService, private settingsService: SettingsService,
    private translate: TranslateService, private logger: LoggerService, private overlayContainer: OverlayContainer, public router: Router) {

      this.settingsService.initialize();

      this.applyTheme(this.settingsService.theme);
  
      this.translateService.setDefaultLang(this.settingsService.defaultLanguage);
      this.translateService.use(this.settingsService.language);
  }

  public selectedTheme: string;

  public ngOnDestroy(): void {
    this.globalEmitter.on(Constants.themeChangedEvent, this.themeChangedListener);
  }

  public ngOnInit(): void {
    this.logger.info(`+++ Started ${ProductInformation.applicationName} ${ProductInformation.applicationVersion} +++`);

    this.globalEmitter.on(Constants.themeChangedEvent, this.themeChangedListener);
    
    let showWelcome: boolean = this.settingsService.showWelcome;

    if (showWelcome) {
      // this.settingsService.showWelcome = false;
      this.router.navigate(['/welcome']);
    }
  }

  private applyTheme(themeName: string): void {
    // Apply theme to app container
    this.selectedTheme = themeName;

    // Apply theme to components in the overlay container
    // https://gist.github.com/tomastrajan/ee29cd8e180b14ce9bc120e2f7435db7
    let overlayContainerClasses: DOMTokenList = this.overlayContainer.getContainerElement().classList;
    let themeClassesToRemove: string[] = Array.from(overlayContainerClasses).filter((item: string) => item.includes('-theme'));

    if (themeClassesToRemove.length) {
      overlayContainerClasses.remove(...themeClassesToRemove);
    }

    overlayContainerClasses.add(themeName);
  }
}
