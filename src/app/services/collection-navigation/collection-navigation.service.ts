import { Injectable } from '@angular/core';
import { SettingsBase } from '../../common/settings/settings.base';

@Injectable({ providedIn: 'root' })
export class CollectionNavigationService {
    public constructor(private settings: SettingsBase) {}

    public get page(): number {
        this.updatePageInSettings();
        return this.settings.selectedCollectionPage;
    }

    public set page(value: number) {
        this.settings.selectedCollectionPage = value;
    }

    public hasVisiblePages(): boolean {
        return (
            this.settings.showArtistsPage ||
            this.settings.showGenresPage ||
            this.settings.showAlbumsPage ||
            this.settings.showTracksPage ||
            this.settings.showPlaylistsPage ||
            this.settings.showFoldersPage
        );
    }

    private updatePageInSettings(): void {
        if (this.isPageShown(this.settings.selectedCollectionPage)) {
            return;
        }

        if (this.settings.showArtistsPage) {
            this.settings.selectedCollectionPage = 0;
            return;
        }

        if (this.settings.showGenresPage) {
            this.settings.selectedCollectionPage = 1;
            return;
        }

        if (this.settings.showAlbumsPage) {
            this.settings.selectedCollectionPage = 2;
            return;
        }

        if (this.settings.showTracksPage) {
            this.settings.selectedCollectionPage = 3;
            return;
        }

        if (this.settings.showPlaylistsPage) {
            this.settings.selectedCollectionPage = 4;
            return;
        }

        if (this.settings.showFoldersPage) {
            this.settings.selectedCollectionPage = 5;
            return;
        }

        this.settings.selectedCollectionPage = 0;
    }

    private isPageShown(page: number): boolean {
        switch (page) {
            case 0:
                return this.settings.showArtistsPage;
            case 1:
                return this.settings.showGenresPage;
            case 2:
                return this.settings.showAlbumsPage;
            case 3:
                return this.settings.showTracksPage;
            case 4:
                return this.settings.showPlaylistsPage;
            case 5:
                return this.settings.showFoldersPage;
            default:
                return false;
        }
    }
}
