import { Injectable } from '@angular/core';
import { Logger } from '../../../core/logger';
import { BaseSettings } from '../../../core/settings/base-settings';
import { StringCompare } from '../../../core/string-compare';
import { FolderModel } from '../../../services/folder/folder-model';
import { SubfolderModel } from '../../../services/folder/subfolder-model';

@Injectable({
    providedIn: 'root',
})
export class FoldersPersister {
    private openedFolder: string;
    private openedSubfolder: string;

    constructor(private settings: BaseSettings, private logger: Logger) {
        this.openedFolder = this.settings.foldersTabOpenedFolder;
        this.openedSubfolder = this.settings.foldersTabOpenedSubfolder;
    }

    public getOpenedFolder(availableFolders: FolderModel[]): FolderModel {
        if (availableFolders == undefined) {
            return undefined;
        }

        if (availableFolders.length === 0) {
            return undefined;
        }

        if (StringCompare.isNullOrWhiteSpace(this.openedFolder)) {
            return undefined;
        }

        try {
            if (availableFolders.map((x) => x.path).includes(this.openedFolder)) {
                return availableFolders.filter((x) => x.path === this.openedFolder)[0];
            }
        } catch (e) {
            this.logger.error(`Could not get opened folder. Error: ${e.message}`, 'FoldersPersister', 'getOpenedFolder');
        }

        return undefined;
    }

    public setOpenedFolder(openedFolder: FolderModel): void {
        if (openedFolder == undefined) {
            this.saveOpenedFolder('');
        } else {
            this.saveOpenedFolder(openedFolder.path);
        }

        this.saveOpenedSubfolder('');
    }

    public getOpenedSubfolder(): SubfolderModel {
        if (StringCompare.isNullOrWhiteSpace(this.openedFolder)) {
            return undefined;
        }

        if (StringCompare.isNullOrWhiteSpace(this.openedSubfolder)) {
            return undefined;
        }

        try {
            if (this.openedSubfolder.includes(this.openedFolder)) {
                return new SubfolderModel(this.openedSubfolder, false);
            }
        } catch (e) {
            this.logger.error(`Could not get opened subfolder. Error: ${e.message}`, 'FoldersPersister', 'getOpenedSubfolder');
        }

        return undefined;
    }

    public setOpenedSubfolder(openedSubfolder: SubfolderModel): void {
        if (openedSubfolder == undefined) {
            this.saveOpenedSubfolder('');
        } else {
            this.saveOpenedSubfolder(openedSubfolder.path);
        }
    }

    private saveOpenedFolder(openedFolderPath: string): void {
        this.openedFolder = openedFolderPath;
        this.settings.foldersTabOpenedFolder = openedFolderPath;
    }

    private saveOpenedSubfolder(openedSubfolderPath: string): void {
        this.openedSubfolder = openedSubfolderPath;
        this.settings.foldersTabOpenedSubfolder = openedSubfolderPath;
    }
}
