import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Logger } from '../../../../common/logger';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { NativeElementProxy } from '../../../../common/native-element-proxy';
import { BaseApplicationService } from '../../../../services/application/base-application.service';
import { BasePlaybackService } from '../../../../services/playback/base-playback.service';
import { PlaylistModel } from '../../../../services/playlist/playlist-model';
import { PlaylistRowsGetter } from '../playlist-folder-browser/playlist-rows-getter';
import { PlaylistOrder } from '../playlist-order';
import { PlaylistsPersister } from '../playlists-persister';
import { PlaylistRow } from './playlist-row';

@Component({
    selector: 'app-playlist-browser',
    host: { style: 'display: block' },
    templateUrl: './playlist-browser.component.html',
    styleUrls: ['./playlist-browser.component.scss'],
    providers: [MouseSelectionWatcher],
})
export class PlaylistBrowserComponent implements OnInit, AfterViewInit {
    private _playlists: PlaylistModel[] = [];
    private _playlistsPersister: PlaylistsPersister;
    private availableWidthInPixels: number = 0;

    constructor(
        public playbackService: BasePlaybackService,
        private applicationService: BaseApplicationService,
        private playlistRowsGetter: PlaylistRowsGetter,
        private nativeElementProxy: NativeElementProxy,
        private mouseSelectionWatcher: MouseSelectionWatcher,
        private logger: Logger
    ) {}

    public playlistOrderEnum: typeof PlaylistOrder = PlaylistOrder;
    public playlistRows: PlaylistRow[] = [];

    public selectedPlaylistOrder: PlaylistOrder;

    @ViewChild('playlistBrowserElement') public playlistBrowserElement: ElementRef;

    public get playlistsPersister(): PlaylistsPersister {
        return this._playlistsPersister;
    }

    @Input()
    public set playlistsPersister(v: PlaylistsPersister) {
        this._playlistsPersister = v;
        this.selectedPlaylistOrder = this.playlistsPersister.getSelectedPlaylistOrder();
        this.orderPlaylists();
    }

    public get playlists(): PlaylistModel[] {
        return this._playlists;
    }

    @Input()
    public set playlists(v: PlaylistModel[]) {
        this._playlists = v;
        this.mouseSelectionWatcher.initialize(this.playlists, false);

        // When the component is first rendered, it happens that playlistsPersister is undefined.
        if (this.playlistsPersister != undefined) {
            this.orderPlaylists();
        }
    }

    public ngOnInit(): void {
        this.applicationService.windowSizeChanged$.subscribe(() => {
            if (this.hasAvailableWidthChanged()) {
                this.orderPlaylists();
            }
        });

        this.applicationService.mouseButtonReleased$.subscribe(() => {
            if (this.hasAvailableWidthChanged()) {
                this.orderPlaylists();
            }
        });
    }

    public ngAfterViewInit(): void {
        // HACK: avoids a ExpressionChangedAfterItHasBeenCheckedError in DEV mode.
        setTimeout(() => {
            this.initializeAvailableWidth();
            this.orderPlaylists();
        }, 0);
    }

    public setSelectedPlaylists(event: any, playlistToSelect: PlaylistModel): void {
        this.mouseSelectionWatcher.setSelectedItems(event, playlistToSelect);
        this.playlistsPersister.setSelectedPlaylists(this.mouseSelectionWatcher.selectedItems);
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

    private applySelectedPlaylists(): void {
        const selectedPlaylists: PlaylistModel[] = this.playlistsPersister.getSelectedPlaylists(this.playlists);

        if (selectedPlaylists == undefined) {
            return;
        }

        for (const selectedPlaylist of selectedPlaylists) {
            selectedPlaylist.isSelected = true;
        }
    }

    private orderPlaylists(): void {
        try {
            this.playlistRows = this.playlistRowsGetter.getPlaylistRows(
                this.availableWidthInPixels,
                this.playlists,
                this.selectedPlaylistOrder
            );
            this.applySelectedPlaylists();
        } catch (e) {
            this.logger.error(`Could not order playlists. Error: ${e.message}`, 'PlaylistBrowserComponent', 'orderPlaylists');
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
