import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import log from 'electron-log';
import * as path from 'path';
import { Subscription } from 'rxjs';
import { ProductInformation } from './common/application/product-information';
import { BaseDesktop } from './common/io/base-desktop';
import { Logger } from './common/logger';
import { PromiseUtils } from './common/utils/promise-utils';
import { AddToPlaylistMenu } from './components/add-to-playlist-menu';
import { BaseAppearanceService } from './services/appearance/base-appearance.service';
import { BaseDialogService } from './services/dialog/base-dialog.service';
import { BaseDiscordService } from './services/discord/base-discord.service';
import { BaseMediaSessionService } from './services/media-session/base-media-session.service';
import { BaseNavigationService } from './services/navigation/base-navigation.service';
import { BaseScrobblingService } from './services/scrobbling/base-scrobbling.service';
import { BaseSearchService } from './services/search/base-search.service';
import { BaseTranslatorService } from './services/translator/base-translator.service';
import { BaseTrayService } from './services/tray/base-tray.service';
import { IntegrationTestRunner } from './testing/integration-test-runner';
import { AppConfig } from '../environments/environment';
import {BaseDragAndDropService} from "./services/drag-and-drop/base-drag-and-drop.service";
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    private subscription: Subscription = new Subscription();

    public constructor(
        private navigationService: BaseNavigationService,
        private appearanceService: BaseAppearanceService,
        private translatorService: BaseTranslatorService,
        private dialogService: BaseDialogService,
        private discordService: BaseDiscordService,
        private scrobblingService: BaseScrobblingService,
        private trayService: BaseTrayService,
        private searchService: BaseSearchService,
        private mediaSessionService: BaseMediaSessionService,
        private dragAndDropService: BaseDragAndDropService,
        private addToPlaylistMenu: AddToPlaylistMenu,
        private desktop: BaseDesktop,
        private logger: Logger,
        private integrationTestRunner: IntegrationTestRunner,
    ) {
        log.create('renderer');
        log.transports.file.resolvePath = () => path.join(this.desktop.getApplicationDataDirectory(), 'logs', 'Dopamine.log');
    }

    @ViewChild('playbackQueueDrawer') public playbackQueueDrawer: MatDrawer;

    @HostListener('document:keydown', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.key === ' ' && !this.searchService.isSearching && !this.dialogService.isInputDialogOpened) {
            // Prevents scrolling when pressing SPACE
            event.preventDefault();
        }
    }

    public async ngOnInit(): Promise<void> {
        if (!AppConfig.production) {
            this.logger.info('Executing integration tests', 'AppComponent', 'ngOnInit');
            await this.integrationTestRunner.executeTestsAsync();
        }

        this.logger.info(
            `+++ Started ${ProductInformation.applicationName} ${ProductInformation.applicationVersion} +++`,
            'AppComponent',
            'ngOnInit',
        );

        this.subscription.add(
            this.navigationService.showPlaybackQueueRequested$.subscribe(() => {
                if (this.playbackQueueDrawer != undefined) {
                    PromiseUtils.noAwait(this.playbackQueueDrawer.toggle());
                }
            }),
        );

        await this.addToPlaylistMenu.initializeAsync();
        this.discordService.setRichPresenceFromSettings();
        this.appearanceService.applyAppearance();
        this.translatorService.applyLanguage();
        this.trayService.updateTrayContextMenu();
        this.mediaSessionService.initialize();
        this.scrobblingService.initialize();
        this.dragAndDropService.listenToOperatingSystemFileDrops();

        await this.navigationService.navigateToLoadingAsync();
    }
}
