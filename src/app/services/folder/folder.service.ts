import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Folder } from '../../data/entities/folder';
import { Logger } from '../../common/logger';
import { FolderModel } from './folder-model';
import { SubfolderModel } from './subfolder-model';
import { FolderServiceBase } from './folder.service.base';
import { FolderRepositoryBase } from '../../data/repositories/folder-repository.base';
import { FileAccessBase } from '../../common/io/file-access.base';
import { NotificationServiceBase } from '../notification/notification.service.base';

@Injectable()
export class FolderService implements FolderServiceBase {
    private foldersChanged: Subject<void> = new Subject();
    private _collectionHasFolders: boolean = false;
    private shouldCheckIfCollectionHasFolders: boolean = true;

    public constructor(
        private folderRepository: FolderRepositoryBase,
        private logger: Logger,
        private notificationService: NotificationServiceBase,
        private fileAccess: FileAccessBase,
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
        const existingFolder: Folder | undefined = this.folderRepository.getFolderByPath(path);

        if (existingFolder == undefined) {
            const newFolder: Folder = new Folder(path);
            this.folderRepository.addFolder(newFolder);
            this.logger.info(`Added folder with path '${path}'`, 'FolderService', 'addNewFolderAsync');
            this.onFoldersChanged();
        } else {
            await this.notificationService.folderAlreadyAddedAsync();
            this.logger.info(`Folder with path '${path}' was already added`, 'FolderService', 'addNewFolderAsync');
        }
    }

    public getFolders(): FolderModel[] {
        const folders: Folder[] = this.folderRepository.getFolders() ?? [];

        if (folders.length > 0) {
            return folders.map((x) => new FolderModel(x));
        }

        return [];
    }

    public async getSubfoldersAsync(rootFolder: FolderModel | undefined, subfolder: SubfolderModel | undefined): Promise<SubfolderModel[]> {
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
            } catch (e: unknown) {
                this.logger.error(e, 'Could not get subfolderPaths for root folder', 'FolderService', 'getSubfoldersAsync');
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
            } catch (e: unknown) {
                this.logger.error(e, 'Could not get subfolderPaths for subfolder', 'FolderService', 'getSubfoldersAsync');
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
            'setFolderVisibility',
        );
    }

    public setAllFoldersVisible(): void {
        this.folderRepository.setAllFoldersShowInCollection(1);
        this.logger.info('Set all folders visible', 'FolderService', 'setAllFoldersVisible');
    }

    public getSubfolderBreadcrumbs(rootFolder: FolderModel, subfolderPath: string): SubfolderModel[] {
        let parentFolderPath: string = subfolderPath;
        const subfolderBreadcrumbs: SubfolderModel[] = [];

        // Add subfolders, if applicable.
        while (parentFolderPath !== rootFolder.path) {
            this.logger.info(
                `parentFolderPath=${parentFolderPath}, rootFolder.path=${rootFolder.path}`,
                'FolderService',
                'getSubfolderBreadcrumbs',
            );
            subfolderBreadcrumbs.push(new SubfolderModel(parentFolderPath, false));
            parentFolderPath = this.fileAccess.getDirectoryPath(parentFolderPath);
        }

        // Always add the root folder
        subfolderBreadcrumbs.push(new SubfolderModel(rootFolder.path, false));

        return subfolderBreadcrumbs.reverse();
    }

    private checkIfCollectionHasFolders(): void {
        const numberOfFoldersInCollection: number = this.getFolders().length;
        this._collectionHasFolders = numberOfFoldersInCollection > 0;
    }
}
