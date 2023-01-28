import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Folder } from '../../common/data/entities/folder';
import { BaseFolderRepository } from '../../common/data/repositories/base-folder-repository';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { Logger } from '../../common/logger';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';
import { BaseFolderService } from './base-folder.service';
import { FolderModel } from './folder-model';
import { SubfolderModel } from './subfolder-model';

@Injectable()
export class FolderService implements BaseFolderService {
    private foldersChanged: Subject<void> = new Subject();
    private _collectionHasFolders: boolean = false;
    private shouldCheckIfCollectionHasFolders: boolean = true;

    constructor(
        private folderRepository: BaseFolderRepository,
        private logger: Logger,
        private snackBarService: BaseSnackBarService,
        private fileAccess: BaseFileAccess
    ) {}

    public foldersChanged$: Observable<void> = this.foldersChanged.asObservable();

    public get collectionHasFolders(): boolean {
        if (this.shouldCheckIfCollectionHasFolders) {
            this.shouldCheckIfCollectionHasFolders = false;
            this.checkIfCollectionHasFolders();
        }

        return this._collectionHasFolders;
    }

    public onFoldersChanged(): void {
        this.checkIfCollectionHasFolders();
        this.foldersChanged.next();
    }

    public async addFolderAsync(path: string): Promise<void> {
        const existingFolder: Folder = this.folderRepository.getFolderByPath(path);

        if (existingFolder == undefined) {
            const newFolder: Folder = new Folder(path);
            await this.folderRepository.addFolder(newFolder);
            this.logger.info(`Added folder with path '${path}'`, 'FolderService', 'addNewFolderAsync');
            this.onFoldersChanged();
        } else {
            await this.snackBarService.folderAlreadyAddedAsync();
            this.logger.info(`Folder with path '${path}' was already added`, 'FolderService', 'addNewFolderAsync');
        }
    }

    public getFolders(): FolderModel[] {
        const folders: Folder[] = this.folderRepository.getFolders();

        if (folders != undefined && folders.length > 0) {
            return folders.map((x) => new FolderModel(x));
        }

        return [];
    }

    public async getSubfoldersAsync(rootFolder: FolderModel, subfolder: SubfolderModel): Promise<SubfolderModel[]> {
        // If no root folder is provided, return no subfolders.
        if (rootFolder == undefined) {
            return [];
        }

        const subfolders: SubfolderModel[] = [];
        let subfolderPaths: string[] = [];

        if (subfolder == undefined) {
            // If no subfolder is provided, return the subfolders of the root folder.
            try {
                if (this.fileAccess.pathExists(rootFolder.path)) {
                    subfolderPaths = await this.fileAccess.getDirectoriesInDirectoryAsync(rootFolder.path);
                }
            } catch (e) {
                this.logger.error(
                    `Could not get subfolderPaths for root folder. Error: ${e.message}`,
                    'FolderService',
                    'getSubfoldersAsync'
                );
            }
        } else {
            // If a subfolder is provided, return the subfolders of the subfolder.
            try {
                if (this.fileAccess.pathExists(subfolder.path)) {
                    let subfolderPathToBrowse: string = subfolder.path;

                    // If the ".." subfolder is selected, go to the parent folder.
                    if (subfolder.isGoToParent) {
                        subfolderPathToBrowse = this.fileAccess.getDirectoryPath(subfolder.path);
                    }

                    // If we're not browsing the root folder, show a folder to go up 1 level.
                    if (subfolderPathToBrowse !== rootFolder.path) {
                        subfolders.push(new SubfolderModel(subfolderPathToBrowse, true));
                    }

                    // Return the subfolders of the provided subfolder
                    subfolderPaths = await this.fileAccess.getDirectoriesInDirectoryAsync(subfolderPathToBrowse);
                }
            } catch (e) {
                this.logger.error(`Could not get subfolderPaths for subfolder. Error: ${e.message}`, 'FolderService', 'getSubfoldersAsync');
            }
        }

        for (const subfolderPath of subfolderPaths) {
            subfolders.push(new SubfolderModel(subfolderPath, false));
        }

        return subfolders;
    }

    public deleteFolder(folder: FolderModel): void {
        this.folderRepository.deleteFolder(folder.folderId);
        this.logger.info(`Deleted folder with path '${folder.path}'`, 'FolderService', 'deleteFolder');
        this.onFoldersChanged();
    }

    public setFolderVisibility(folder: FolderModel): void {
        const showInCollection: number = folder.showInCollection ? 1 : 0;
        this.folderRepository.setFolderShowInCollection(folder.folderId, showInCollection);
        this.logger.info(
            `Set folder visibility: folderId=${folder.folderId}, path '${folder.path}', showInCollection=${showInCollection}`,
            'FolderService',
            'setFolderVisibility'
        );
    }

    public setAllFoldersVisible(): void {
        this.folderRepository.setAllFoldersShowInCollection(1);
        this.logger.info('Set all folders visible', 'FolderService', 'setAllFoldersVisible');
    }

    public async getSubfolderBreadCrumbsAsync(rootFolder: FolderModel, subfolderPath: string): Promise<SubfolderModel[]> {
        let parentFolderPath: string = subfolderPath;
        const subfolderBreadCrumbs: SubfolderModel[] = [];

        // Add subfolders, if applicable.
        while (parentFolderPath !== rootFolder.path) {
            this.logger.info(
                `parentFolderPath=${parentFolderPath}, rootFolder.path=${rootFolder.path}`,
                'FolderService',
                'getSubfolderBreadCrumbsAsync'
            );
            subfolderBreadCrumbs.push(new SubfolderModel(parentFolderPath, false));
            parentFolderPath = this.fileAccess.getDirectoryPath(parentFolderPath);
        }

        // Always add the root folder
        subfolderBreadCrumbs.push(new SubfolderModel(rootFolder.path, false));

        return subfolderBreadCrumbs.reverse();
    }

    private checkIfCollectionHasFolders(): void {
        const numberOfFoldersInCollection: number = this.getFolders().length;
        this._collectionHasFolders = numberOfFoldersInCollection > 0;
    }
}
