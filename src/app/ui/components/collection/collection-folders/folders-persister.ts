import { Injectable } from '@angular/core';
import { Logger } from '../../../../common/logger';
import { FolderModel } from '../../../../services/folder/folder-model';
import { StringUtils } from '../../../../common/utils/string-utils';
import { SubfolderModel } from '../../../../services/folder/subfolder-model';
import { SettingsBase } from '../../../../common/settings/settings.base';

@Injectable()
export class FoldersPersister {
    private openedFolderPath: string;
    private openedSubfolderPath: string;

    public constructor(
        private settings: SettingsBase,
        private logger: Logger,
    ) {
        this.initializeFromSettings();
    }

    public getOpenedFolder(availableFolders: FolderModel[]): FolderModel | undefined {
        if (availableFolders.length === 0) {
            return undefined;
        }

        if (!StringUtils.isNullOrWhiteSpace(this.openedFolderPath)) {
            try {
                if (availableFolders.map((x) => x.path).includes(this.openedFolderPath)) {
                    return availableFolders.filter((x) => x.path === this.openedFolderPath)[0];
                }
            } catch (e: unknown) {
                this.logger.error(e, 'Could not get opened folder', 'FoldersPersister', 'getOpenedFolder');
            }
        }

        return availableFolders[0];
    }

    public setOpenedFolder(openedFolder: FolderModel): void {
        try {
            this.saveOpenedFolder(openedFolder.path);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not set opened folder', 'FoldersPersister', 'setOpenedFolder');
        }
    }

    public getOpenedSubfolder(): SubfolderModel | undefined {
        if (StringUtils.isNullOrWhiteSpace(this.openedFolderPath)) {
            return undefined;
        }

        if (StringUtils.isNullOrWhiteSpace(this.openedSubfolderPath)) {
            return undefined;
        }

        try {
            if (this.openedSubfolderPath.includes(this.openedFolderPath)) {
                return new SubfolderModel(this.openedSubfolderPath, false);
            }
        } catch (e: unknown) {
            this.logger.error(e, 'Could not get opened subfolder', 'FoldersPersister', 'getOpenedSubfolder');
        }

        return undefined;
    }

    public setOpenedSubfolder(openedSubfolder: SubfolderModel): void {
        try {
            if (openedSubfolder == undefined) {
                this.saveOpenedSubfolder('');
            } else {
                this.saveOpenedSubfolder(openedSubfolder.path);
            }
        } catch (e: unknown) {
            this.logger.error(e, 'Could not set opened subfolder', 'FoldersPersister', 'setOpenedSubfolder');
        }
    }

    private initializeFromSettings(): void {
        this.openedFolderPath = this.settings.foldersTabOpenedFolder;
        this.openedSubfolderPath = this.settings.foldersTabOpenedSubfolder;
    }

    private saveOpenedFolder(openedFolderPath: string): void {
        this.openedFolderPath = openedFolderPath;
        this.settings.foldersTabOpenedFolder = openedFolderPath;
    }

    private saveOpenedSubfolder(openedSubfolderPath: string): void {
        this.openedSubfolderPath = openedSubfolderPath;
        this.settings.foldersTabOpenedSubfolder = openedSubfolderPath;
    }
}
