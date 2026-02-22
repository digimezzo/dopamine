import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Constants } from '../../common/application/constants';
import { Logger } from '../../common/logger';
import { FileAccessBase } from '../../common/io/file-access.base';
import { IpcProxyBase } from '../../common/io/ipc-proxy.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { PlaybackService } from '../playback/playback.service';
import { MetadataService } from '../metadata/metadata.service';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { TrackModel } from '../track/track-model';
import { PlaybackStarted } from '../playback/playback-started';

@Injectable({ providedIn: 'root' })
export class DockService {
    private _subscription: Subscription | undefined;
    private _dockMenuSubscription: Subscription = new Subscription();

    public constructor(
        private playbackService: PlaybackService,
        private metadataService: MetadataService,
        private translatorService: TranslatorServiceBase,
        private fileAccess: FileAccessBase,
        private ipcProxy: IpcProxyBase,
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    public get isMacOS(): boolean {
        return process.platform === 'darwin';
    }

    public get showAlbumArtOnDockIcon(): boolean {
        return this.settings.showAlbumArtOnDockIcon;
    }

    public set showAlbumArtOnDockIcon(v: boolean) {
        this.settings.showAlbumArtOnDockIcon = v;
        this.initialize();
    }

    public initialize(): void {
        if (!this.isMacOS) {
            return;
        }

        this.removeSubscriptions();

        if (this.settings.showAlbumArtOnDockIcon) {
            this.addSubscriptions();

            if (this.playbackService.currentTrack != undefined) {
                this.updateDockIconAsync(this.playbackService.currentTrack);
            }
        } else {
            this.resetDockIcon();
        }

        this.initializeDockMenu();
    }

    private addSubscriptions(): void {
        this._subscription = new Subscription();

        this._subscription.add(
            this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => {
                this.updateDockIconAsync(playbackStarted.currentTrack);
            }),
        );

        this._subscription.add(
            this.playbackService.playbackStopped$.subscribe(() => {
                this.resetDockIcon();
            }),
        );
    }

    private removeSubscriptions(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    private async updateDockIconAsync(track: TrackModel): Promise<void> {
        try {
            const imageUrl = await this.metadataService.createAlbumImageUrlAsync(track, 0);

            if (imageUrl === Constants.emptyImage) {
                this.resetDockIcon();
                return;
            }

            let artworkBuffer: Buffer;

            if (imageUrl.startsWith('data:')) {
                const base64 = imageUrl.split(',')[1];
                artworkBuffer = Buffer.from(base64, 'base64');
            } else if (imageUrl.startsWith('file:///')) {
                artworkBuffer = await this.fileAccess.getFileContentAsBufferAsync(imageUrl.replace('file:///', ''));
            } else {
                this.resetDockIcon();
                return;
            }

            const pngBuffer = await this.applySquircleMaskAsync(artworkBuffer);
            this.ipcProxy.sendToMainProcess('update-dock-icon', pngBuffer);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not update dock icon', 'DockService', 'updateDockIconAsync');
            this.resetDockIcon();
        }
    }

    private async applySquircleMaskAsync(artworkBuffer: Buffer): Promise<Buffer> {
        const { Jimp } = await import('jimp');

        const iconSize = 1024;
        const inset = 100;
        const contentSize = iconSize - 2 * inset;
        const half = contentSize / 2;
        const n = 5;

        const artwork = await Jimp.read(artworkBuffer);
        artwork.resize({ w: contentSize, h: contentSize });

        const result = new Jimp({ width: iconSize, height: iconSize, color: 0x00000000 });

        for (let y = 0; y < contentSize; y++) {
            for (let x = 0; x < contentSize; x++) {
                const nx = Math.abs((x - half + 0.5) / half);
                const ny = Math.abs((y - half + 0.5) / half);

                if (Math.pow(nx, n) + Math.pow(ny, n) <= 1) {
                    result.setPixelColor(artwork.getPixelColor(x, y), x + inset, y + inset);
                }
            }
        }

        return await result.getBuffer('image/png');
    }

    private initializeDockMenu(): void {
        this._dockMenuSubscription.unsubscribe();
        this._dockMenuSubscription = new Subscription();

        this._dockMenuSubscription.add(
            this.playbackService.playbackStarted$.subscribe(() => {
                this.updateDockMenu();
            }),
        );

        this._dockMenuSubscription.add(
            this.playbackService.playbackPaused$.subscribe(() => {
                this.updateDockMenu();
            }),
        );

        this._dockMenuSubscription.add(
            this.playbackService.playbackResumed$.subscribe(() => {
                this.updateDockMenu();
            }),
        );

        this._dockMenuSubscription.add(
            this.playbackService.playbackStopped$.subscribe(() => {
                this.updateDockMenu();
            }),
        );

        this._dockMenuSubscription.add(
            this.translatorService.languageChanged$.subscribe(() => {
                this.updateDockMenu();
            }),
        );

        this._dockMenuSubscription.add(
            this.ipcProxy.onDockPlayPause$.subscribe(() => {
                void this.playbackService.togglePlaybackAsync();
            }),
        );

        this._dockMenuSubscription.add(
            this.ipcProxy.onDockNext$.subscribe(() => {
                void this.playbackService.playNextAsync();
            }),
        );

        this._dockMenuSubscription.add(
            this.ipcProxy.onDockPrevious$.subscribe(() => {
                void this.playbackService.playPreviousAsync();
            }),
        );

        this.updateDockMenu();
    }

    private updateDockMenu(): void {
        const playPauseLabel = this.playbackService.canPause
            ? this.translatorService.get('pause')
            : this.translatorService.get('play');

        const arg = {
            playPauseLabel: playPauseLabel,
            nextLabel: this.translatorService.get('next'),
            previousLabel: this.translatorService.get('previous'),
        };

        this.ipcProxy.sendToMainProcess('update-dock-menu', arg);
    }

    private resetDockIcon(): void {
        this.ipcProxy.sendToMainProcess('update-dock-icon', undefined);
    }
}
