import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Logger } from '../../../common/logger';
import { BaseSettings } from '../../../common/settings/base-settings';
import { Strings } from '../../../common/strings';
import { PlaylistFolderModel } from '../../../services/playlist-folder/playlist-folder-model';

@Injectable()
export class PlaylistFoldersPersister {
    private selectedPlaylistFolderNames: string[] = [];
    private selectedPlaylistFoldersChanged: Subject<PlaylistFolderModel[]> = new Subject();

    public constructor(public settings: BaseSettings, public logger: Logger) {
        this.initializeFromSettings();
    }

    public selectedPlaylistFoldersChanged$: Observable<PlaylistFolderModel[]> = this.selectedPlaylistFoldersChanged.asObservable();

    public getSelectedPlaylistFolders(availablePlaylistFolders: PlaylistFolderModel[]): PlaylistFolderModel[] {
        if (availablePlaylistFolders == undefined) {
            return [];
        }

        if (availablePlaylistFolders.length === 0) {
            return [];
        }

        try {
            return availablePlaylistFolders.filter((x) => this.selectedPlaylistFolderNames.includes(x.name));
        } catch (e: unknown) {
            this.logger.error(e, 'Could not get selected playlist folders', 'PlaylistFoldersPersister', 'getSelectedPlaylistFolders');
        }

        return [];
    }

    public setSelectedPlaylistFolders(selectedPlaylistFolders: PlaylistFolderModel[]): void {
        try {
            if (selectedPlaylistFolders != undefined && selectedPlaylistFolders.length > 0) {
                this.selectedPlaylistFolderNames = selectedPlaylistFolders.map((x) => x.name);
            } else {
                this.selectedPlaylistFolderNames = [];
            }

            if (this.selectedPlaylistFolderNames.length > 0) {
                this.saveSelectedPlaylistFolderToSettings(this.selectedPlaylistFolderNames[0]);
            } else {
                this.saveSelectedPlaylistFolderToSettings('');
            }

            this.selectedPlaylistFoldersChanged.next(selectedPlaylistFolders);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not set selected playlist folders', 'PlaylistFoldersPersister', 'setSelectedPlaylistFolders');
        }
    }

    private initializeFromSettings(): void {
        if (!Strings.isNullOrWhiteSpace(this.getSelectedPlaylistFolderFromSettings())) {
            this.selectedPlaylistFolderNames = [this.getSelectedPlaylistFolderFromSettings()];
        }
    }

    private getSelectedPlaylistFolderFromSettings(): string {
        return this.settings.playlistsTabSelectedPlaylistFolder;
    }

    private saveSelectedPlaylistFolderToSettings(selectedPlaylistFolderName: string): void {
        this.settings.playlistsTabSelectedPlaylistFolder = selectedPlaylistFolderName;
    }
}
