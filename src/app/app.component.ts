import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import log from 'electron-log';
import * as path from 'path';
import { Subscription } from 'rxjs';
import { ProductInformation } from './common/application/product-information';
import { Logger } from './common/logger';
import { PromiseUtils } from './common/utils/promise-utils';
import { IntegrationTestRunner } from './testing/integration-test-runner';
import { AppConfig } from '../environments/environment';
import { NavigationServiceBase } from './services/navigation/navigation.service.base';
import { AppearanceServiceBase } from './services/appearance/appearance.service.base';
import { TranslatorServiceBase } from './services/translator/translator.service.base';
import { DiscordServiceBase } from './services/discord/discord.service.base';
import { ScrobblingServiceBase } from './services/scrobbling/scrobbling.service.base';
import { TrayServiceBase } from './services/tray/tray.service.base';
import { MediaSessionServiceBase } from './services/media-session/media-session.service.base';
import { EventListenerServiceBase } from './services/event-listener/event-listener.service.base';
import { AddToPlaylistMenu } from './ui/components/add-to-playlist-menu';
import { DesktopBase } from './common/io/desktop.base';
import { AudioVisualizer } from './services/playback/audio-visualizer';
import { PlaybackServiceBase } from './services/playback/playback.service.base';
import { LifetimeService } from './services/lifetime/lifetime.service';
import { PlayerSwitcherService } from './services/player-switcher/player-switcher.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    private subscription: Subscription = new Subscription();

    public constructor(
        private playerSwitcherService: PlayerSwitcherService,
        private playbackService: PlaybackServiceBase,
        private navigationService: NavigationServiceBase,
        private appearanceService: AppearanceServiceBase,
        private translatorService: TranslatorServiceBase,
        private discordService: DiscordServiceBase,
        private scrobblingService: ScrobblingServiceBase,
        private trayService: TrayServiceBase,
        private mediaSessionService: MediaSessionServiceBase,
        private eventListenerService: EventListenerServiceBase,
        public lifetimeService: LifetimeService,
        private addToPlaylistMenu: AddToPlaylistMenu,
        private desktop: DesktopBase,
        private logger: Logger,
        private integrationTestRunner: IntegrationTestRunner,
        private audioVisualizer: AudioVisualizer,
    ) {
        log.create('renderer');
        log.transports.file.resolvePath = () => path.join(this.desktop.getApplicationDataDirectory(), 'logs', 'Dopamine.log');
    }

    @ViewChild('playbackQueueDrawer') public playbackQueueDrawer: MatDrawer;

    @HostListener('document:keydown', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.key === ' ' && !(event.target instanceof HTMLInputElement)) {
            // Prevents scrolling when pressing SPACE
            event.preventDefault();
        }
    }

    public async ngOnInit(): Promise<void> {
        this.audioVisualizer.connectAudioElement();

        if (!AppConfig.production) {
            this.logger.info('Executing integration tests', 'AppComponent', 'ngOnInit');
            // await this.integrationTestRunner.executeTestsAsync();
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
        await this.appearanceService.applyAppearanceAsync();
        this.translatorService.applyLanguage();
        this.trayService.updateTrayContextMenu();
        this.mediaSessionService.initialize();
        this.scrobblingService.initialize();
        this.eventListenerService.listenToEvents();
        await this.navigationService.navigateToLoadingAsync();
        await this.playbackService.initializeAsync();
        this.lifetimeService.initialize();
    }
}
