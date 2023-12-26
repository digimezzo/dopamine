import { Injectable } from '@angular/core';
import { Constants } from '../../../common/application/constants';
import { StringUtils } from '../../../common/utils/string-utils';
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

        if (!StringUtils.isNullOrWhiteSpace(selectedTabLabel)) {
            return selectedTabLabel;
        }

        return '';
    }

    public getTabIndexForLabel(tabLabel: string | undefined): number {
        if (StringUtils.isNullOrWhiteSpace(tabLabel)) {
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
            this.tabLabels.push('artists');
        }

        if (this.settings.showGenresPage) {
            this.tabLabels.push('genres');
        }

        if (this.settings.showAlbumsPage) {
            this.tabLabels.push('albums');
        }

        if (this.settings.showTracksPage) {
            this.tabLabels.push('tracks');
        }

        if (this.settings.showPlaylistsPage) {
            this.tabLabels.push('playlists');
        }

        if (this.settings.showFoldersPage) {
            this.tabLabels.push('folders');
        }
    }
}
