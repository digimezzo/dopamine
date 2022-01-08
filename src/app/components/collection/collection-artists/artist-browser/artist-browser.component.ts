import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { ArtistOrdering } from '../../../../common/artist-ordering';
import { ContextMenuOpener } from '../../../../common/context-menu-opener';
import { HeaderShower } from '../../../../common/header-shower';
import { Logger } from '../../../../common/logger';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { ArtistModel } from '../../../../services/artist/artist-model';
import { ArtistType } from '../../../../services/artist/artist-type';
import { BasePlaybackService } from '../../../../services/playback/base-playback.service';
import { PlaylistFolderModel } from '../../../../services/playlist-folder/playlist-folder-model';
import { PlaylistsContextMenu } from '../../playlists-context-menu';
import { ArtistsPersister } from '../artists-persister';
import { ArtistOrder } from './artist-order';

@Component({
    selector: 'app-artist-browser',
    host: { style: 'display: block' },
    templateUrl: './artist-browser.component.html',
    styleUrls: ['./artist-browser.component.scss'],
    providers: [MouseSelectionWatcher],
})
export class ArtistBrowserComponent implements OnInit, OnDestroy {
    private _artists: ArtistModel[] = [];
    private _artistsPersister: ArtistsPersister;

    constructor(
        public playbackService: BasePlaybackService,
        public playlistsContextMenu: PlaylistsContextMenu,
        private mouseSelectionWatcher: MouseSelectionWatcher,
        public contextMenuOpener: ContextMenuOpener,
        private artistOrdering: ArtistOrdering,
        private headerShower: HeaderShower,
        private logger: Logger
    ) {}

    @ViewChild(MatMenuTrigger)
    public artistContextMenu: MatMenuTrigger;

    public orderedArtists: ArtistModel[] = [];

    public artistOrderEnum: typeof ArtistOrder = ArtistOrder;
    public selectedArtistOrder: ArtistOrder;

    public artistTypeEnum: typeof ArtistType = ArtistType;
    public selectedArtistType: ArtistType;

    public get artistsPersister(): ArtistsPersister {
        return this._artistsPersister;
    }

    @Input()
    public set artistsPersister(v: ArtistsPersister) {
        this._artistsPersister = v;
        this.selectedArtistType = this.artistsPersister.getSelectedArtistType();
        this.selectedArtistOrder = this.artistsPersister.getSelectedArtistOrder();
        this.orderArtists();
    }

    public get artists(): ArtistModel[] {
        return this._artists;
    }

    @Input()
    public set artists(v: ArtistModel[]) {
        this._artists = v;
        this.mouseSelectionWatcher.initialize(this.artists, false);

        // When the component is first rendered, it happens that artistsPersister is undefined.
        if (this.artistsPersister != undefined) {
            this.orderArtists();
        }
    }

    public ngOnDestroy(): void {}

    public ngOnInit(): void {}

    public setSelectedArtists(event: any, artistToSelect: ArtistModel): void {
        this.mouseSelectionWatcher.setSelectedItems(event, artistToSelect);
        this.artistsPersister.setSelectedArtists(this.mouseSelectionWatcher.selectedItems);
    }

    public toggleArtistType(): void {
        switch (this.selectedArtistType) {
            case ArtistType.trackArtists:
                this.selectedArtistType = ArtistType.albumArtists;
                break;
            case ArtistType.albumArtists:
                this.selectedArtistType = ArtistType.allArtists;
                break;
            case ArtistType.allArtists:
                this.selectedArtistType = ArtistType.trackArtists;
                break;
            default: {
                this.selectedArtistType = ArtistType.trackArtists;
                break;
            }
        }

        this.artistsPersister.setSelectedArtistType(this.selectedArtistType);
    }

    public toggleArtistOrder(): void {
        switch (this.selectedArtistOrder) {
            case ArtistOrder.byArtistAscending:
                this.selectedArtistOrder = ArtistOrder.byArtistDescending;
                break;
            case ArtistOrder.byArtistDescending:
                this.selectedArtistOrder = ArtistOrder.byArtistAscending;
                break;
            default: {
                this.selectedArtistOrder = ArtistOrder.byArtistAscending;
                break;
            }
        }

        this.artistsPersister.setSelectedArtistOrder(this.selectedArtistOrder);
        this.orderArtists();
    }

    public async onArtistContextMenuAsync(event: MouseEvent, artist: ArtistModel): Promise<void> {
        this.contextMenuOpener.open(this.artistContextMenu, event, artist);
    }

    private orderArtists(): void {
        let orderedArtists: ArtistModel[] = [];

        try {
            switch (this.selectedArtistOrder) {
                case ArtistOrder.byArtistAscending:
                    orderedArtists = this.artistOrdering.getArtistsOrderedAscending(this.artists);
                    break;
                case ArtistOrder.byArtistDescending:
                    orderedArtists = this.artistOrdering.getArtistsOrderedDescending(this.artists);
                    break;
                default: {
                    orderedArtists = this.artistOrdering.getArtistsOrderedAscending(this.artists);
                    break;
                }
            }

            this.headerShower.showHeaders(orderedArtists);
            this.applySelectedArtists();
        } catch (e) {
            this.logger.error(`Could not order artists. Error: ${e.message}`, 'ArtistBrowserComponent', 'orderArtists');
        }

        this.orderedArtists = [...orderedArtists];
    }

    private applySelectedArtists(): void {
        const selectedArtists: ArtistModel[] = this.artistsPersister.getSelectedArtists(this.artists);

        if (selectedArtists == undefined) {
            return;
        }

        for (const selectedArtist of selectedArtists) {
            selectedArtist.isSelected = true;
        }
    }

    public onClick(playlistFolder: PlaylistFolderModel): void {
        alert(playlistFolder.name);
    }
}
