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
  private themeChangedListener: any = this.applyTheme.bind(this);

  constructor(public electronService: ElectronService, private translateService: TranslateService, private settings: Settings,
    private translate: TranslateService, private logger: Logger, private overlayContainer: OverlayContainer, public router: Router) {

    this.applyTheme(this.settings.theme);

    this.translateService.setDefaultLang(this.settings.defaultLanguage);
    this.translateService.use(this.settings.language);
  }

  public selectedTheme: string;

  public ngOnDestroy(): void {
    this.globalEmitter.on(Constants.themeChangedEvent, this.themeChangedListener);
  }

  public async ngOnInit(): Promise<void> {
    this.logger.info(`+++ Started ${ProductInformation.applicationName} ${ProductInformation.applicationVersion} +++`, "AppComponent", "ngOnInit");

    this.globalEmitter.on(Constants.themeChangedEvent, this.themeChangedListener);

    let showWelcome: boolean = this.settings.showWelcome;

    if (showWelcome) {
      // this.settingsService.showWelcome = false;
      this.router.navigate(['/welcome']);
    } else {
      this.router.navigate(['/collection']);
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
