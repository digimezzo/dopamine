import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ArtistOrdering } from '../../../../common/artists-ordering';
import { Logger } from '../../../../common/logger';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';
import { ArtistModel } from '../../../../services/artist/artist-model';
import { ArtistType } from '../../../../services/artist/artist-type';
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

    constructor(private mouseSelectionWatcher: MouseSelectionWatcher, private artistOrdering: ArtistOrdering, private logger: Logger) {}

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
        this.orderArtists();
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

            this.showArtistHeaders(orderedArtists);
        } catch (e) {
            this.logger.error(`Could not order artists. Error: ${e.message}`, 'ArtistBrowserComponent', 'orderArtists');
        }

        this.orderedArtists = [...orderedArtists];
    }

    private showArtistHeaders(orderedArtists: ArtistModel[]): void {
        let previousAlphabeticalHeader: string = uuidv4();

        for (const artist of orderedArtists) {
            artist.showHeader = false;

            if (artist.alphabeticalHeader !== previousAlphabeticalHeader) {
                artist.showHeader = true;
            }

            previousAlphabeticalHeader = artist.alphabeticalHeader;
        }
    }
}
