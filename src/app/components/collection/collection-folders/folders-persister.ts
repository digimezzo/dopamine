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

    public saveActiveFolderToSettings(activeFolder: FolderModel): void {
        if (activeFolder == undefined) {
            this.settings.foldersTabActiveFolder = '';
        } else {
            this.settings.foldersTabActiveFolder = activeFolder.path;
        }

        this.settings.foldersTabActiveSubfolder = '';
    }

    public saveActiveSubfolderToSettings(activeSubfolder: SubfolderModel): void {
        if (activeSubfolder == undefined) {
            this.settings.foldersTabActiveSubfolder = '';
        } else {
            this.settings.foldersTabActiveSubfolder = activeSubfolder.path;
        }
    }

    public getActiveFolderFromSettings(availableFolders: FolderModel[]): FolderModel {
        if (availableFolders == undefined) {
            return undefined;
        }

        if (availableFolders.length === 0) {
            return undefined;
        }

        try {
            const activeFolderInSettings: string = this.settings.foldersTabActiveFolder;

            if (!StringCompare.isNullOrWhiteSpace(activeFolderInSettings)) {
                this.logger.info(
                    `Found folder '${activeFolderInSettings}' in the settings`,
                    'FoldersPersister',
                    'getActiveFolderFromSettings'
                );

                if (availableFolders.map((x) => x.path).includes(activeFolderInSettings)) {
                    this.logger.info(`Selecting folder '${activeFolderInSettings}'`, 'FoldersPersister', 'getActiveFolderFromSettings');

                    return availableFolders.filter((x) => x.path === activeFolderInSettings)[0];
                } else {
                    this.logger.info(
                        `Could not select folder '${activeFolderInSettings}' because it does not exist`,
                        'FoldersPersister',
                        'getActiveFolderFromSettings'
                    );
                }
            }
        } catch (e) {
            this.logger.error(
                `Could not get active folder from settings. Error: ${e.message}`,
                'FoldersPersister',
                'getActiveFolderFromSettings'
            );
        }

        return availableFolders[0];
    }

    public getActiveSubfolderFromSettings(): SubfolderModel {
        try {
            const activeFolderInSettings: string = this.settings.foldersTabActiveFolder;
            const activeSubfolderInSettings: string = this.settings.foldersTabActiveSubfolder;

            if (StringCompare.isNullOrWhiteSpace(activeFolderInSettings)) {
                this.logger.info(`Active folder in settings is empty.`, 'FoldersPersister', 'getActiveSubfolderFromSettings');

                return undefined;
            }

            if (StringCompare.isNullOrWhiteSpace(activeSubfolderInSettings)) {
                this.logger.info(`Active subfolder in settings is empty.`, 'FoldersPersister', 'getActiveSubfolderFromSettings');

                return undefined;
            }

            this.logger.info(
                `Found subfolder '${activeSubfolderInSettings}' in settings`,
                'FoldersPersister',
                'getActiveSubfolderFromSettings'
            );

            if (!activeSubfolderInSettings.includes(activeFolderInSettings)) {
                this.logger.info(
                    `Active subfolder '${activeSubfolderInSettings}' in settings is not a child of '${activeFolderInSettings}'`,
                    'FoldersPersister',
                    'getActiveSubfolderFromSettings'
                );

                return undefined;
            }

            return new SubfolderModel(activeSubfolderInSettings, false);
        } catch (e) {
            this.logger.error(
                `Could not get active subfolder from settings. Error: ${e.message}`,
                'FoldersPersister',
                'getActiveSubfolderFromSettings'
            );
        }

        return undefined;
    }
}
