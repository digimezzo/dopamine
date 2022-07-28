import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Logger } from '../../../common/logger';
import { BaseSettings } from '../../../common/settings/base-settings';
import { Strings } from '../../../common/strings';
import { PlaylistModel } from '../../../services/playlist/playlist-model';
import { PlaylistOrder } from './playlist-order';

@Injectable()
export class PlaylistsPersister {
    private selectedPlaylistNames: string[] = [];
    private selectedPlaylistOrder: PlaylistOrder;
    private selectedPlaylistsChanged: Subject<string[]> = new Subject();

    constructor(public settings: BaseSettings, public logger: Logger) {
        this.initializeFromSettings();
    }

    public selectedPlaylistsChanged$: Observable<string[]> = this.selectedPlaylistsChanged.asObservable();

    public getSelectedPlaylistFromSettings(): string {
        return this.settings.playlistsTabSelectedPlaylist;
    }

    public saveSelectedPlaylistToSettings(selectedPlaylistName: string): void {
        this.settings.playlistsTabSelectedPlaylist = selectedPlaylistName;
    }

    public getSelectedPlaylistOrderFromSettings(): string {
        return this.settings.playlistsTabSelectedPlaylistOrder;
    }

    public saveSelectedPlaylistOrderToSettings(selectedPlaylistOrderName: string): void {
        this.settings.playlistsTabSelectedPlaylistOrder = selectedPlaylistOrderName;
    }

    public getSelectedPlaylists(availablePlaylists: PlaylistModel[]): PlaylistModel[] {
        if (availablePlaylists == undefined) {
            return [];
        }

        if (availablePlaylists.length === 0) {
            return [];
        }

        try {
            return availablePlaylists.filter((x) => this.selectedPlaylistNames.includes(x.name));
        } catch (e) {
            this.logger.error(`Could not get selected playlists. Error: ${e.message}`, 'PlaylistsPersister', 'getSelectedPlaylists');
        }

        return [];
    }

    public setSelectedPlaylists(selectedPlaylists: PlaylistModel[]): void {
        try {
            if (selectedPlaylists != undefined && selectedPlaylists.length > 0) {
                this.selectedPlaylistNames = selectedPlaylists.map((x) => x.name);
            } else {
                this.selectedPlaylistNames = [];
            }

            if (this.selectedPlaylistNames.length > 0) {
                this.saveSelectedPlaylistToSettings(this.selectedPlaylistNames[0]);
            } else {
                this.saveSelectedPlaylistToSettings('');
            }

            this.selectedPlaylistsChanged.next(this.selectedPlaylistNames);
        } catch (e) {
            this.logger.error(`Could not set selected playlists. Error: ${e.message}`, 'PlaylistsPersister', 'setSelectedPlaylists');
        }
    }

    public resetSelectedPlaylists(): void {
        this.selectedPlaylistNames = [];
        this.saveSelectedPlaylistToSettings('');
    }

    public getSelectedPlaylistOrder(): PlaylistOrder {
        if (this.selectedPlaylistOrder == undefined) {
            return PlaylistOrder.byPlaylistNameAscending;
        }

        return this.selectedPlaylistOrder;
    }

    public setSelectedPlaylistOrder(selectedPlaylistOrder: PlaylistOrder): void {
        try {
            this.selectedPlaylistOrder = selectedPlaylistOrder;
            this.saveSelectedPlaylistOrderToSettings(PlaylistOrder[selectedPlaylistOrder]);
        } catch (e) {
            this.logger.error(
                `Could not set selected playlist order. Error: ${e.message}`,
                'PlaylistsPersister',
                'setSelectedPlaylistOrder'
            );
        }
    }

    private initializeFromSettings(): void {
        if (!Strings.isNullOrWhiteSpace(this.getSelectedPlaylistFromSettings())) {
            this.selectedPlaylistNames = [this.getSelectedPlaylistFromSettings()];
        }

        if (!Strings.isNullOrWhiteSpace(this.getSelectedPlaylistOrderFromSettings())) {
            this.selectedPlaylistOrder = (PlaylistOrder as any)[this.getSelectedPlaylistOrderFromSettings()];
        }
    }
}
