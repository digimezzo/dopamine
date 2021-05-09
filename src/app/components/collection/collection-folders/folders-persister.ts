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
    constructor(private settings: BaseSettings, private logger: Logger) {}

    public saveOpenedFolderToSettings(openedFolder: FolderModel): void {
        if (openedFolder == undefined) {
            this.settings.foldersTabOpenedFolder = '';
            this.settings.foldersTabOpenedSubfolder = '';
        } else {
            this.settings.foldersTabOpenedFolder = openedFolder.path;
        }
    }

    public getOpenedFolderFromSettings(availableFolders: FolderModel[]): FolderModel {
        if (availableFolders == undefined) {
            return undefined;
        }

        if (availableFolders.length === 0) {
            return undefined;
        }

        try {
            const openedFolderInSettings: string = this.settings.foldersTabOpenedFolder;

            if (!StringCompare.isNullOrWhiteSpace(openedFolderInSettings)) {
                this.logger.info(
                    `Found folder '${openedFolderInSettings}' in the settings`,
                    'FoldersPersister',
                    'getOpenedFolderFromSettings'
                );

                if (availableFolders.map((x) => x.path).includes(openedFolderInSettings)) {
                    this.logger.info(`Selecting folder '${openedFolderInSettings}'`, 'FoldersPersister', 'getOpenedFolderFromSettings');

                    return availableFolders.filter((x) => x.path === openedFolderInSettings)[0];
                } else {
                    this.logger.info(
                        `Could not select folder '${openedFolderInSettings}' because it does not exist`,
                        'FoldersPersister',
                        'getOpenedFolderFromSettings'
                    );
                }
            }
        } catch (e) {
            this.logger.error(
                `Could not get opened folder from settings. Error: ${e.message}`,
                'FoldersPersister',
                'getOpenedFolderFromSettings'
            );
        }

        return availableFolders[0];
    }

    public saveOpenedSubfolderToSettings(openedSubfolder: SubfolderModel): void {
        if (openedSubfolder == undefined) {
            this.settings.foldersTabOpenedSubfolder = '';
        } else {
            this.settings.foldersTabOpenedSubfolder = openedSubfolder.path;
        }
    }

    public getOpenedSubfolderFromSettings(): SubfolderModel {
        try {
            const openedFolderInSettings: string = this.settings.foldersTabOpenedFolder;
            const openedSubfolderInSettings: string = this.settings.foldersTabOpenedSubfolder;

            if (StringCompare.isNullOrWhiteSpace(openedFolderInSettings)) {
                this.logger.info(`Opened folder in settings is empty.`, 'FoldersPersister', 'getOpenedSubfolderFromSettings');

                return undefined;
            }

            if (StringCompare.isNullOrWhiteSpace(openedSubfolderInSettings)) {
                this.logger.info(`Opened subfolder in settings is empty.`, 'FoldersPersister', 'getOpenedSubfolderFromSettings');

                return undefined;
            }

            this.logger.info(
                `Found subfolder '${openedSubfolderInSettings}' in settings`,
                'FoldersPersister',
                'getOpenedSubfolderFromSettings'
            );

            if (!openedSubfolderInSettings.includes(openedFolderInSettings)) {
                this.logger.info(
                    `Opened subfolder '${openedSubfolderInSettings}' in settings is not a child of '${openedFolderInSettings}'`,
                    'FoldersPersister',
                    'getOpenedSubfolderFromSettings'
                );

                return undefined;
            }

            return new SubfolderModel(openedSubfolderInSettings, false);
        } catch (e) {
            this.logger.error(
                `Could not get opened subfolder from settings. Error: ${e.message}`,
                'FoldersPersister',
                'getOpenedSubfolderFromSettings'
            );
        }

        return undefined;
    }
}
