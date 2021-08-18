import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseSettings } from '../../../common/settings/base-settings';
import { BaseAppearanceService } from '../../../services/appearance/base-appearance.service';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';

@Component({
    selector: 'app-appearance-settings',
    host: { style: 'display: block' },
    templateUrl: './appearance-settings.component.html',
    styleUrls: ['./appearance-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppearanceSettingsComponent implements OnInit, OnDestroy {
    constructor(
        public appearanceService: BaseAppearanceService,
        public translatorService: BaseTranslatorService,
        public settings: BaseSettings
    ) {}

    public ngOnDestroy(): void {
        this.appearanceService.stopWatchingThemesDirectory();
    }

    public async ngOnInit(): Promise<void> {
        this.appearanceService.startWatchingThemesDirectory();
    }
}
