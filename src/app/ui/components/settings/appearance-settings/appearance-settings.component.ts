import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { BaseSettings } from '../../../../common/settings/base-settings';
import { DesktopBase } from '../../../../common/io/desktop.base';

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
        private desktop: DesktopBase,
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
