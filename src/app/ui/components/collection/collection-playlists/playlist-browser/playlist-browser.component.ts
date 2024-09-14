import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Logger } from '../../../../../common/logger';
import { NativeElementProxy } from '../../../../../common/native-element-proxy';
import { PlaylistModel } from '../../../../../services/playlist/playlist-model';
import { PlaylistRowsGetter } from '../playlist-folder-browser/playlist-rows-getter';
import { PlaylistOrder } from '../playlist-order';
import { PlaylistsPersister } from '../playlists-persister';
import { PlaylistRow } from './playlist-row';
import { PlaybackServiceBase } from '../../../../../services/playback/playback.service.base';
import { PlaylistServiceBase } from '../../../../../services/playlist/playlist.service.base';
import { ApplicationServiceBase } from '../../../../../services/application/application.service.base';
import { TranslatorServiceBase } from '../../../../../services/translator/translator.service.base';
import { DialogServiceBase } from '../../../../../services/dialog/dialog.service.base';
import { MouseSelectionWatcher } from '../../../mouse-selection-watcher';
import { ContextMenuOpener } from '../../../context-menu-opener';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Constants } from '../../../../../common/application/constants';

@Component({
    selector: 'app-playlist-browser',
    host: { style: 'display: block' },
    templateUrl: './playlist-browser.component.html',
    styleUrls: ['./playlist-browser.component.scss'],
    providers: [MouseSelectionWatcher],
})
export class PlaylistBrowserComponent implements AfterViewInit, OnChanges, OnDestroy {
    private _playlists: PlaylistModel[] = [];
    private _playlistsPersister: PlaylistsPersister;
    private availableWidthInPixels: number = 0;
    private destroy$ = new Subject<void>();

    public constructor(
        public playbackService: PlaybackServiceBase,
        public playlistService: PlaylistServiceBase,
        private applicationService: ApplicationServiceBase,
        private translatorService: TranslatorServiceBase,
        private dialogService: DialogServiceBase,
        private playlistRowsGetter: PlaylistRowsGetter,
        private nativeElementProxy: NativeElementProxy,
        private mouseSelectionWatcher: MouseSelectionWatcher,
        public contextMenuOpener: ContextMenuOpener,
        private logger: Logger,
    ) {}

    public playlistOrderEnum: typeof PlaylistOrder = PlaylistOrder;
    public playlistRows: PlaylistRow[] = [];

    public selectedPlaylistOrder: PlaylistOrder;

    @ViewChild('playlistContextMenuAnchor', { read: MatMenuTrigger, static: false })
    public playlistContextMenu: MatMenuTrigger;

    @ViewChild('playlistBrowserElement') public playlistBrowserElement: ElementRef;

    public get playlistsPersister(): PlaylistsPersister {
        return this._playlistsPersister;
    }

    @Input()
    public set playlistsPersister(v: PlaylistsPersister) {
        this._playlistsPersister = v;
        this.selectedPlaylistOrder = this.playlistsPersister.getSelectedPlaylistOrder();
    }

    public get playlists(): PlaylistModel[] {
        return this._playlists;
    }

    @Input()
    public set playlists(v: PlaylistModel[]) {
        this._playlists = v;
        this.mouseSelectionWatcher.initialize(this.playlists, false);
    }

    public get hasPlaylists(): boolean {
        return this._playlists.length > 0;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['playlists'] || changes['playlistsPersister']) {
            if (this.playlists && this.playlists.length > 0 && this.playlistsPersister) {
                this.orderPlaylists();
            }
        }
    }

    public ngAfterViewInit(): void {
        // HACK: avoids a ExpressionChangedAfterItHasBeenCheckedError in DEV mode.
        setTimeout(() => {
            this.initializeAvailableWidth();

            this.applicationService.windowSizeChanged$
                .pipe(debounceTime(Constants.playlistsRedrawDelayMilliseconds), takeUntil(this.destroy$))
                .subscribe(() => {
                    if (this.hasAvailableWidthChanged()) {
                        this.orderPlaylists();
                    }
                });

            this.applicationService.mouseButtonReleased$
                .pipe(debounceTime(Constants.playlistsRedrawDelayMilliseconds), takeUntil(this.destroy$))
                .subscribe(() => {
                    if (this.hasAvailableWidthChanged()) {
                        this.orderPlaylists();
                    }
                });
        }, 0);
    }

    public setSelectedPlaylists(event: MouseEvent, playlistToSelect: PlaylistModel): void {
        this.mouseSelectionWatcher.setSelectedItems(event, playlistToSelect);
        this.playlistsPersister.setSelectedPlaylists(this.mouseSelectionWatcher.selectedItems as PlaylistModel[]);
    }

    public togglePlaylistOrder(): void {
        switch (this.selectedPlaylistOrder) {
            case PlaylistOrder.byPlaylistNameAscending:
                this.selectedPlaylistOrder = PlaylistOrder.byPlaylistNameDescending;
                break;
            case PlaylistOrder.byPlaylistNameDescending:
                this.selectedPlaylistOrder = PlaylistOrder.byPlaylistNameAscending;
                break;
            default: {
                this.selectedPlaylistOrder = PlaylistOrder.byPlaylistNameDescending;
                break;
            }
        }

        this.playlistsPersister.setSelectedPlaylistOrder(this.selectedPlaylistOrder);
        this.orderPlaylists();
    }

    public onPlaylistContextMenu(event: MouseEvent, playlist: PlaylistModel): void {
        this.contextMenuOpener.open(this.playlistContextMenu, event, playlist);
    }

    private applySelectedPlaylists(): void {
        const selectedPlaylists: PlaylistModel[] = this.playlistsPersister.getSelectedPlaylists(this.playlists);

        if (selectedPlaylists == undefined) {
            return;
        }

        for (const selectedPlaylist of selectedPlaylists) {
            selectedPlaylist.isSelected = true;
        }
    }

    public async onDeletePlaylistAsync(playlist: PlaylistModel): Promise<void> {
        const dialogTitle: string = await this.translatorService.getAsync('confirm-delete-playlist');
        const dialogText: string = await this.translatorService.getAsync('confirm-delete-playlist-long', {
            playlistName: playlist.name,
        });

        const userHasConfirmed: boolean = await this.dialogService.showConfirmationDialogAsync(dialogTitle, dialogText);

        if (userHasConfirmed) {
            try {
                await this.playlistService.deletePlaylistAsync(playlist);
            } catch (e: unknown) {
                this.logger.error(e, 'Could not delete playlist', 'PlaylistBrowserComponent', 'onDeletePlaylistAsync');

                const errorText: string = await this.translatorService.getAsync('delete-playlist-error');
                this.dialogService.showErrorDialog(errorText);
            }
        }
    }

    public async onEditPlaylistAsync(playlist: PlaylistModel): Promise<void> {
        await this.dialogService.showEditPlaylistDialogAsync(playlist);
    }

    public async createPlaylistAsync(): Promise<void> {
        await this.dialogService.showCreatePlaylistDialogAsync();
    }

    public async onAddToQueueAsync(playlist: PlaylistModel): Promise<void> {
        await this.playbackService.addPlaylistToQueueAsync(playlist);
    }

    private orderPlaylists(): void {
        try {
            this.playlistRows = this.playlistRowsGetter.getPlaylistRows(
                this.availableWidthInPixels,
                this.playlists,
                this.selectedPlaylistOrder,
            );
            this.applySelectedPlaylists();
        } catch (e: unknown) {
            this.logger.error(e, 'Could not order playlists', 'PlaylistBrowserComponent', 'orderPlaylists');
        }
    }

    private initializeAvailableWidth(): void {
        this.availableWidthInPixels = this.nativeElementProxy.getElementWidth(this.playlistBrowserElement);
    }

    private hasAvailableWidthChanged(): boolean {
        const newAvailableWidthInPixels: number = this.nativeElementProxy.getElementWidth(this.playlistBrowserElement);

        if (this.availableWidthInPixels === newAvailableWidthInPixels) {
            return false;
        }

        this.availableWidthInPixels = newAvailableWidthInPixels;

        return true;
    }
}
