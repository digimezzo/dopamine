import { Injectable } from '@angular/core';
import { Constants } from '../../../common/application/constants';
import { Strings } from '../../../common/strings';
import { SettingsBase } from '../../../common/settings/settings.base';

@Injectable()
export class TabSelectionGetter {
    private tabLabels: string[] = [];

    public constructor(private settings: SettingsBase) {
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

    public getTabIndexForLabel(tabLabel: string | undefined): number {
        if (Strings.isNullOrWhiteSpace(tabLabel)) {
            return 0;
        }

        this.getTabLabels();

        const selectedTabIndex: number = this.tabLabels.indexOf(tabLabel!);

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
