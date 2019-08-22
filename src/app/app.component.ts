import { Component } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { ProductInformation } from './core/productInformation';
import { remote } from 'electron';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { Constants } from './core/constants';
import { Settings } from './core/settings';
import { Logger } from './core/logger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private globalEmitter = remote.getGlobal('globalEmitter');
  private colorThemeChangedListener: any = this.applyColorTheme.bind(this);
  private backgroundThemeChangedListener: any = this.applyBackgroundTheme.bind(this);

  constructor(public electronService: ElectronService, private translate: TranslateService, private settings: Settings,
    private logger: Logger, private overlayContainer: OverlayContainer, public router: Router) {

    this.applyColorTheme(this.settings.colorTheme);
    this.applyBackgroundTheme(this.settings.useLightBackgroundTheme);

    this.translate.setDefaultLang(this.settings.defaultLanguage);
    this.translate.use(this.settings.language);
  }

  public selectedTheme: string;

  public ngOnDestroy(): void {
    this.globalEmitter.remove(Constants.colorThemeChangedEvent, this.colorThemeChangedListener);
    this.globalEmitter.remove(Constants.backgroundThemeChangedEvent, this.backgroundThemeChangedListener);
  }

  public async ngOnInit(): Promise<void> {
    this.logger.info(`+++ Started ${ProductInformation.applicationName} ${ProductInformation.applicationVersion} +++`, "AppComponent", "ngOnInit");

    this.globalEmitter.on(Constants.colorThemeChangedEvent, this.colorThemeChangedListener);
    this.globalEmitter.on(Constants.backgroundThemeChangedEvent, this.backgroundThemeChangedListener);

    let showWelcome: boolean = this.settings.showWelcome;

    if (showWelcome) {
      // this.settingsService.showWelcome = false;
      this.router.navigate(['/welcome']);
    } else {
      this.router.navigate(['/collection']);
    }
  }

  private applyColorTheme(themeName: string): void {
    // Apply theme to app container
    this.selectedTheme = themeName;

    // Apply theme to components in the overlay container
    // https://gist.github.com/tomastrajan/ee29cd8e180b14ce9bc120e2f7435db7
    let overlayContainerClasses: DOMTokenList = this.overlayContainer.getContainerElement().classList;
    let themeClassesToRemove: string[] = Array.from(overlayContainerClasses).filter((item: string) => item.includes('-theme-'));

    if (themeClassesToRemove.length) {
      overlayContainerClasses.remove(...themeClassesToRemove);
    }

    overlayContainerClasses.add(themeName);
  }

  private applyBackgroundTheme(useLightBackgroundTheme: boolean): void {
    if (useLightBackgroundTheme) {
      this.applyColorTheme(`${this.settings.colorTheme}-light`);
      document.body.setAttribute('background-theme', 'light');
    } else {
      this.applyColorTheme(this.settings.colorTheme);
      document.body.removeAttribute('background-theme');
    }
  }
}
