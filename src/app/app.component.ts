import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material';
import { remote } from 'electron';
import log from 'electron-log';
import * as path from 'path';
import { Subscription } from 'rxjs';
import { ProductInformation } from './common/application/product-information';
import { Logger } from './common/logger';
import { BaseAppearanceService } from './services/appearance/base-appearance.service';
import { BaseDiscordService } from './services/discord/base-discord.service';
import { BaseNavigationService } from './services/navigation/base-navigation.service';
import { BaseTranslatorService } from './services/translator/base-translator.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    constructor(
        private navigationService: BaseNavigationService,
        private appearanceService: BaseAppearanceService,
        private translatorService: BaseTranslatorService,
        private discordService: BaseDiscordService,
        private logger: Logger
    ) {
        log.create('renderer');
        log.transports.file.resolvePath = () => path.join(remote.app.getPath('userData'), 'logs', 'Dopamine.log');
    }

    @ViewChild('playbackQueueDrawer') public playbackQueueDrawer: MatDrawer;

    public ngOnDestroy(): void {}

    public async ngOnInit(): Promise<void> {
        this.logger.info(
            `+++ Started ${ProductInformation.applicationName} ${ProductInformation.applicationVersion} +++`,
            'AppComponent',
            'ngOnInit'
        );

        this.subscription.add(
            this.navigationService.showPlaybackQueueRequested$.subscribe(() => {
                if (this.playbackQueueDrawer != undefined) {
                    this.playbackQueueDrawer.toggle();
                }
            })
        );

        this.discordService.initialize();
        this.appearanceService.applyTheme();
        this.appearanceService.applyFontSize();
        await this.translatorService.applyLanguageAsync();

        this.navigationService.navigateToLoading();
    }
}
