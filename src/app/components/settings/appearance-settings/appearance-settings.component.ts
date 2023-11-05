import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseDesktop } from '../../../common/io/base-desktop';
import { BaseSettings } from '../../../common/settings/base-settings';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { TranslatorServiceBase } from '../../../services/translator/translator.service.base';

@Component({
    selector: 'app-appearance-settings',
    host: { style: 'display: block' },
    templateUrl: './appearance-settings.component.html',
    styleUrls: ['./appearance-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppearanceSettingsComponent implements OnInit, OnDestroy {
    public constructor(
        public appearanceService: AppearanceServiceBase,
        public translatorService: TranslatorServiceBase,
        public settings: BaseSettings,
        private desktop: BaseDesktop,
    ) {}

    public ngOnDestroy(): void {
        this.appearanceService.stopWatchingThemesDirectory();
    }

    public ngOnInit(): void {
        this.appearanceService.startWatchingThemesDirectory();
    }

    public async openThemesDirectoryAsync(): Promise<void> {
        await this.desktop.openPathAsync(this.appearanceService.themesDirectoryPath);
    }
}
