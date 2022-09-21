import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import log from 'electron-log';
import * as path from 'path';
import { Subscription } from 'rxjs';
import { ProductInformation } from './common/application/product-information';
import { BaseDesktop } from './common/io/base-desktop';
import { Logger } from './common/logger';
import { AddToPlaylistMenu } from './components/add-to-playlist-menu';
import { BaseAppearanceService } from './services/appearance/base-appearance.service';
import { BaseDialogService } from './services/dialog/base-dialog.service';
import { BaseDiscordService } from './services/discord/base-discord.service';
import { BaseNavigationService } from './services/navigation/base-navigation.service';
import { BaseSearchService } from './services/search/base-search.service';
import { BaseTranslatorService } from './services/translator/base-translator.service';
import { BaseTrayService } from './services/tray/base-tray.service';
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
        private dialogService: BaseDialogService,
        private discordService: BaseDiscordService,
        private trayService: BaseTrayService,
        private searchService: BaseSearchService,
        private addToPlaylistMenu: AddToPlaylistMenu,
        private desktop: BaseDesktop,
        private logger: Logger
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

        this.addToPlaylistMenu.initializeAsync();
        this.discordService.setRichPresenceFromSettings();
        this.appearanceService.applyAppearance();
        await this.translatorService.applyLanguageAsync();
        this.trayService.updateTrayContextMenu();

        this.navigationService.navigateToLoading();
    }
}
