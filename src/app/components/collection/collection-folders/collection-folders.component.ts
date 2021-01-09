import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SplitAreaDirective, SplitComponent } from 'angular-split';
import { BaseSettings } from '../../../core/settings/base-settings';
import { BaseFolderService } from '../../../services/folder/base-folder.service';
import { FolderModel } from '../../../services/folder/folder-model';
import { SubfolderModel } from '../../../services/folder/subfolder-model';
import { BaseNavigationService } from '../../../services/navigation/base-navigation.service';

@Component({
    selector: 'app-collection-folders',
    host: { style: 'display: block' },
    templateUrl: './collection-folders.component.html',
    styleUrls: ['./collection-folders.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CollectionFoldersComponent implements OnInit {
    constructor(
        private settings: BaseSettings,
        private folderService: BaseFolderService,
        private navigationService: BaseNavigationService
    ) {}
    @ViewChild('split', { static: false }) public split: SplitComponent;
    @ViewChild('area1', { static: false }) public area1: SplitAreaDirective;
    @ViewChild('area2', { static: false }) public area2: SplitAreaDirective;

    public area1Size: number = this.settings.foldersLeftPaneWithPercent;
    public area2Size: number = 100 - this.settings.foldersLeftPaneWithPercent;

    public folders: FolderModel[] = [];
    public selectedFolder: FolderModel;
    public subfolders: SubfolderModel[] = [];
    public selectedSubfolder: SubfolderModel;

    public async ngOnInit(): Promise<void> {
        await this.fillListsAsync();
    }

    public dragEnd(event: any): void {
        this.settings.foldersLeftPaneWithPercent = event.sizes[0];
    }

    public async getFoldersAsync(): Promise<void> {
        this.folders = this.folderService.getFolders();
    }

    public async getSubfoldersAsync(activeSubfolder: SubfolderModel): Promise<void> {
        if (this.selectedFolder == undefined) {
            return;
        }

        this.subfolders = await this.folderService.getSubfoldersAsync(this.selectedFolder, activeSubfolder);
    }

    public async setSelectedFolderAsync(folder: FolderModel): Promise<void> {
        this.selectedFolder = folder;
        await this.getSubfoldersAsync(undefined);
    }

    public setSelectedSubfolder(subfolder: SubfolderModel): void {
        this.selectedSubfolder = subfolder;
    }

    public goToManageCollection(): void {
        this.navigationService.navigateToManageCollection();
    }

    private getFirstFolder(): FolderModel {
        if (this.folders.length == 0) {
            return undefined;
        }

        return this.folders[0];
    }

    private async fillListsAsync(): Promise<void> {
        await this.getFoldersAsync();
        const folderToSelect: FolderModel = this.getFirstFolder();
        await this.setSelectedFolderAsync(folderToSelect);
    }
}
