import { Injectable } from '@angular/core';
import { Constants } from '../../common/application/constants';
import { BaseSettings } from '../../common/settings/base-settings';
import { Strings } from '../../common/strings';

@Injectable()
export class TabSelectionGetter {
    private tabLabels: string[] = [];

    constructor(private settings: BaseSettings) {
        this.getTabLabels();
    }

    public getTabLabelForIndex(tabIndex: number): string {
        this.getTabLabels();

        const selectedTabLabel: string = this.tabLabels[tabIndex];

        if (!Strings.isNullOrWhiteSpace(selectedTabLabel)) {
            return selectedTabLabel;
        }

        return '';
    }

    public getTabIndexForLabel(tabLabel: string): number {
        if (Strings.isNullOrWhiteSpace(tabLabel)) {
            return 0;
        }

        this.getTabLabels();

        const selectedTabIndex: number = this.tabLabels.indexOf(tabLabel);

        if (selectedTabIndex > -1) {
            return selectedTabIndex;
        }

        return 0;
    }

    private getTabLabels(): void {
        this.tabLabels = [];

        if (this.settings.showArtistsPage) {
            this.tabLabels.push(Constants.artistsTabLabel);
        }

        if (this.settings.showGenresPage) {
            this.tabLabels.push(Constants.genresTabLabel);
        }

        if (this.settings.showAlbumsPage) {
            this.tabLabels.push(Constants.albumsTabLabel);
        }

        if (this.settings.showTracksPage) {
            this.tabLabels.push(Constants.tracksTabLabel);
        }

        if (this.settings.showPlaylistsPage) {
            this.tabLabels.push(Constants.playlistsTabLabel);
        }

        if (this.settings.showFoldersPage) {
            this.tabLabels.push(Constants.foldersTabLabel);
        }
    }
}
