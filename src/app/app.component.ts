import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { ProductInformation } from './core/productInformation';
import { LoggerService } from './providers/logger/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public electronService: ElectronService,
    private translate: TranslateService, private logger: LoggerService) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    this.logger.info(`+++ Started ${ProductInformation.applicationName} ${ProductInformation.applicationVersion} +++`);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  public ngOnInit(): void {
    this.logger.info(`+++ Started ${ProductInformation.applicationName} ${ProductInformation.applicationVersion} +++`);
  }
}
