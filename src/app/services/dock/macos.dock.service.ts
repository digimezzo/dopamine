import { Injectable } from '@angular/core';
import { MacOSDockServiceBase } from './macos.dock.service.base';
import { Menu } from 'electron';
import * as remote from '@electron/remote';
import { Subscription } from 'rxjs';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { PlaybackService } from '../playback/playback.service';
import { Logger } from '../../common/logger';

@Injectable({ providedIn: 'root' })
export class MacOSDockService implements MacOSDockServiceBase {
    private dockMenu: Menu;
    private subscription: Subscription = new Subscription();

    constructor (
        private translatorService: TranslatorServiceBase,
        private playbackService: PlaybackService,
        private logger: Logger,
    ) {
        this.logger.info('Init service', MacOSDockService.name, 'constructor');
        this.initializeSubscriptions();
    }

    private initializeSubscriptions(): void {
        this.subscription.add(
            this.translatorService.languageChanged$.subscribe(() => {
                this.reloadDockMenu();
            }),
        );
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe(() => {
                this.reloadDockMenu();
            }),
        );
        this.subscription.add(
            this.playbackService.playbackPaused$.subscribe(() => {
                this.reloadDockMenu();
            }),
        );
        this.subscription.add(
            this.playbackService.playbackResumed$.subscribe(() => {
                this.reloadDockMenu();
            }),
        );
        this.subscription.add(
            this.playbackService.playbackStopped$.subscribe(() => {
                this.reloadDockMenu();
            }),
        );
        this.subscription.add(
            this.playbackService.playbackSkipped$.subscribe(() => {
                this.reloadDockMenu();
            }),
        );
    }

    public getDockMenu(): Menu {
        return this.dockMenu;
    }

    public reloadDockMenu(): void {
        this.logger.info(`Reloading dock menu: ${this.playbackService.isPlaying}`, MacOSDockService.name, 'reloadDockMenu');
        const menu = new remote.Menu();
        if (this.playbackService.isPlaying) {
            menu.append(new remote.MenuItem({ label: this.translatorService.get('pause'), click: () => this.playbackService.togglePlayback() }));
        } else {
            menu.append(new remote.MenuItem({ label: this.translatorService.get('play'), click: () => this.playbackService.togglePlayback() }));
        }
        menu.append(new remote.MenuItem({ label: this.translatorService.get('previous'), click: () => this.playbackService.playPrevious() }));
        menu.append(new remote.MenuItem({ label: this.translatorService.get('next'), click: () => this.playbackService.playNext() }));
        remote.app.dock.setMenu(menu);
        this.dockMenu = menu;
    }
}