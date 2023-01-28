import { Subscription } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { Folder } from '../../common/data/entities/folder';
import { BaseFolderRepository } from '../../common/data/repositories/base-folder-repository';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { Logger } from '../../common/logger';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';
import { FolderModel } from './folder-model';
import { FolderService } from './folder.service';
import { SubfolderModel } from './subfolder-model';

describe('FolderService', () => {
    let folderRepositoryMock: IMock<BaseFolderRepository>;
    let snackBarServiceMock: IMock<BaseSnackBarService>;
    let loggerMock: IMock<Logger>;
    let fileAccessMock: IMock<BaseFileAccess>;

    let service: FolderService;

    beforeEach(() => {
        folderRepositoryMock = Mock.ofType<BaseFolderRepository>();
        snackBarServiceMock = Mock.ofType<BaseSnackBarService>();
        loggerMock = Mock.ofType<Logger>();
        fileAccessMock = Mock.ofType<BaseFileAccess>();

        service = new FolderService(folderRepositoryMock.object, loggerMock.object, snackBarServiceMock.object, fileAccessMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(service).toBeDefined();
        });

        it('should define foldersChanged$', () => {
            // Arrange

            // Act

            // Assert
            expect(service.foldersChanged$).toBeDefined();
        });

        it('should initialize collectionHasFolders as false', () => {
            // Arrange

            // Act

            // Assert
            expect(service.collectionHasFolders).toBeFalsy();
        });
    });

    describe('addFolderAsync', () => {
        it('should add a new folder with the selected path to the database', async () => {
            // Arrange
            folderRepositoryMock.setup((x) => x.getFolderByPath('/home/me/Music')).returns(() => undefined);

            // Act
            await service.addFolderAsync('/home/me/Music');

            // Assert
            folderRepositoryMock.verify((x) => x.addFolder(It.isObjectWith<Folder>({ path: '/home/me/Music' })), Times.exactly(1));
        });

        it('should not add an existing folder with the selected path to the database', async () => {
            // Arrange
            folderRepositoryMock.setup((x) => x.getFolderByPath('/home/me/Music')).returns(() => new Folder('/home/me/Music'));

            // Act
            await service.addFolderAsync('/home/me/Music');

            // Assert
            folderRepositoryMock.verify((x) => x.addFolder(It.isObjectWith<Folder>({ path: '/home/me/Music' })), Times.never());
        });

        it('should notify the user if a folder was already added', async () => {
            // Arrange
            folderRepositoryMock.setup((x) => x.getFolderByPath('/home/me/Music')).returns(() => new Folder('/home/me/Music'));

            // Act
            await service.addFolderAsync('/home/me/Music');

            // Assert
            snackBarServiceMock.verify((x) => x.folderAlreadyAddedAsync(), Times.exactly(1));
        });

        it('should notify that folders have changed when a folder is added', async () => {
            // Arrange
            folderRepositoryMock.setup((x) => x.getFolderByPath('/home/me/Music')).returns(() => undefined);

            // Act
            let foldersHaveChanged: boolean = false;
            const subscription: Subscription = service.foldersChanged$.subscribe(() => {
                foldersHaveChanged = true;
            });
            await service.addFolderAsync('/home/me/Music');
            subscription.unsubscribe();

            // Assert
            expect(foldersHaveChanged).toBeTruthy();
        });

        it('should not notify that folders have changed when a folder is not added', async () => {
            // Arrange
            folderRepositoryMock.setup((x) => x.getFolderByPath('/home/me/Music')).returns(() => new Folder('/home/me/Music'));

            // Act
            let foldersHaveChanged: boolean = false;
            const subscription: Subscription = service.foldersChanged$.subscribe(() => {
                foldersHaveChanged = true;
            });
            await service.addFolderAsync('/home/me/Music');
            subscription.unsubscribe();

            // Assert
            expect(foldersHaveChanged).toBeFalsy();
        });
    });

    describe('getFoldersAsync', () => {
        it('should get folders from the database', () => {
            // Arrange

            // Act
            service.getFolders();

            // Assert
            folderRepositoryMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('should return an empty collection when database folders are undefined', () => {
            // Arrange
            folderRepositoryMock.setup((x) => x.getFolders()).returns(() => undefined);

            // Act
            const folders: FolderModel[] = service.getFolders();

            // Assert
            expect(folders.length).toEqual(0);
        });

        it('should return an empty collection when database folders are empty', () => {
            // Arrange
            folderRepositoryMock.setup((x) => x.getFolders()).returns(() => []);

            // Act
            const folders: FolderModel[] = service.getFolders();

            // Assert
            expect(folders.length).toEqual(0);
        });

        it('should return a collection of folderModels for each folder found in the database', () => {
            // Arrange
            const databaseFolder1: Folder = new Folder('One');
            databaseFolder1.folderId = 1;
            const databaseFolder2: Folder = new Folder('Two');
            databaseFolder2.folderId = 2;
            folderRepositoryMock.setup((x) => x.getFolders()).returns(() => [databaseFolder1, databaseFolder2]);

            // Act
            const folders: FolderModel[] = service.getFolders();

            // Assert
            expect(folders.length).toEqual(2);
            expect(folders[0].folderId).toEqual(1);
            expect(folders[0].path).toEqual('One');
            expect(folders[1].folderId).toEqual(2);
            expect(folders[1].path).toEqual('Two');
        });
    });

    describe('deleteFolderAsync', () => {
        it('should delete a folder from the database', () => {
            // Arrange
            const folder: Folder = new Folder('/home/user/Music');
            folder.folderId = 1;
            const folderToDelete: FolderModel = new FolderModel(folder);

            // Act
            service.deleteFolder(folderToDelete);

            // Assert
            folderRepositoryMock.verify((x) => x.deleteFolder(folderToDelete.folderId), Times.exactly(1));
        });

        it('should notify that folders have changed when deleting a folder', () => {
            // Arrange
            const folder: Folder = new Folder('/home/user/Music');
            folder.folderId = 1;
            const folderToDelete: FolderModel = new FolderModel(folder);

            // Act
            let foldersHaveChanged: boolean = false;
            const subscription: Subscription = service.foldersChanged$.subscribe(() => {
                foldersHaveChanged = true;
            });
            service.deleteFolder(folderToDelete);
            subscription.unsubscribe();

            // Assert
            expect(foldersHaveChanged).toBeTruthy();
        });
    });

    describe('setFolderVisibility', () => {
        it('should set folder visibility in the database', () => {
            // Arrange
            const folder: Folder = new Folder('/home/user/Music');
            folder.folderId = 1;
            const folderModel: FolderModel = new FolderModel(folder);
            folderModel.showInCollection = true;

            // Act
            service.setFolderVisibility(folderModel);

            // Assert
            folderRepositoryMock.verify((x) => x.setFolderShowInCollection(1, 1), Times.exactly(1));
        });
    });

    describe('setAllFoldersVisible', () => {
        it('should set visibility of all folders in the database', () => {
            // Arrange

            // Act
            service.setAllFoldersVisible();

            // Assert
            folderRepositoryMock.verify((x) => x.setAllFoldersShowInCollection(1), Times.exactly(1));
        });
    });

    describe('getSubfolders', () => {
        it('should return no subfolders, given no root folder.', async () => {
            // Arrange

            // Act
            const subfolders: SubfolderModel[] = await service.getSubfoldersAsync(undefined, undefined);

            // Assert
            expect(subfolders.length).toEqual(0);
        });

        it('should return no subfolders, given a root folder but no subfolder, and the root folder path does not exist.', async () => {
            // Arrange
            const rootFolderPath: string = '/home/user/Music';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            fileAccessMock.setup((x) => x.pathExists(rootFolderPath)).returns(() => false);

            // Act
            const subfolders: SubfolderModel[] = await service.getSubfoldersAsync(rootFolder, undefined);

            // Assert
            expect(subfolders.length).toEqual(0);
        });

        it('should return the subfolders of the root folder, given a root folder but no subfolder, and the root folder path exists.', async () => {
            // Arrange
            const rootFolderPath: string = '/home/user/Music';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            const rootFolderDirectories: string[] = ['Root child 1', 'Root child 2', 'Root child 3'];
            fileAccessMock.setup((x) => x.pathExists(rootFolderPath)).returns(() => true);
            fileAccessMock.setup((x) => x.getDirectoriesInDirectoryAsync(rootFolderPath)).returns(async () => rootFolderDirectories);

            // Act
            const subfolders: SubfolderModel[] = await service.getSubfoldersAsync(rootFolder, undefined);

            // Assert
            expect(subfolders.length).toEqual(3);
            expect(subfolders[0].path).toEqual('Root child 1');
            expect(subfolders[1].path).toEqual('Root child 2');
            expect(subfolders[2].path).toEqual('Root child 3');
        });

        it('should return no subfolders, given a root folder and a subfolder, and the subfolder path does not exist.', async () => {
            // Arrange
            const rootFolderPath: string = '/home/user/Music';
            const subfolderPath: string = '/home/user/Music/Subfolder1';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            const subfolder: SubfolderModel = new SubfolderModel(subfolderPath, false);
            fileAccessMock.setup((x) => x.pathExists(subfolderPath)).returns(() => false);

            // Act
            const subfolders: SubfolderModel[] = await service.getSubfoldersAsync(rootFolder, subfolder);

            // Assert
            expect(subfolders.length).toEqual(0);
        });

        it('should return subfolders of the subfolder, given a root folder and a subfolder which is the root folder.', async () => {
            // Arrange
            const rootFolderPath: string = '/home/user/Music';
            const subfolderPath: string = '/home/user/Music';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            const subfolder: SubfolderModel = new SubfolderModel(subfolderPath, false);
            const subDirectories: string[] = ['Root child 1', 'Root child 2', 'Root child 3'];
            fileAccessMock.setup((x) => x.pathExists(subfolderPath)).returns(() => true);
            fileAccessMock.setup((x) => x.getDirectoriesInDirectoryAsync(subfolderPath)).returns(async () => subDirectories);

            // Act
            const subfolders: SubfolderModel[] = await service.getSubfoldersAsync(rootFolder, subfolder);

            // Assert
            expect(subfolders.length).toEqual(3);
            expect(subfolders[0].path).toEqual('Root child 1');
            expect(subfolders[1].path).toEqual('Root child 2');
            expect(subfolders[2].path).toEqual('Root child 3');
        });

        it('should return a go to parent subfolder and subfolders of the sub folder, given a root folder and a subfolder which is not the root folder.', async () => {
            // Arrange
            const rootFolderPath: string = '/home/user/Music';
            const subfolderPath: string = '/home/user/Music/Sub1';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            const subfolder: SubfolderModel = new SubfolderModel(subfolderPath, false);
            const subDirectories: string[] = ['Root child 1', 'Root child 2', 'Root child 3'];
            fileAccessMock.setup((x) => x.pathExists(subfolderPath)).returns(() => true);
            fileAccessMock.setup((x) => x.getDirectoriesInDirectoryAsync(subfolderPath)).returns(async () => subDirectories);

            // Act
            const subfolders: SubfolderModel[] = await service.getSubfoldersAsync(rootFolder, subfolder);

            // Assert
            expect(subfolders.length).toEqual(4);
            expect(subfolders[0].path).toEqual('/home/user/Music/Sub1');
            expect(subfolders[0].isGoToParent).toBeTruthy();
            expect(subfolders[1].path).toEqual('Root child 1');
            expect(subfolders[2].path).toEqual('Root child 2');
            expect(subfolders[3].path).toEqual('Root child 3');
        });

        it('should return the subfolders of the parent folder, given a go to parent subfolder', async () => {
            // Arrange
            const rootFolderPath: string = '/home/user/Music';
            const subfolderPath: string = '/home/user/Music/Sub1/Sub2';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            const subfolder: SubfolderModel = new SubfolderModel(subfolderPath, true);
            const subDirectories: string[] = ['Root child 1', 'Root child 2', 'Root child 3'];
            fileAccessMock.setup((x) => x.pathExists(subfolderPath)).returns(() => true);
            fileAccessMock.setup((x) => x.getDirectoryPath(subfolderPath)).returns(() => '/home/user/Music/Sub1');
            fileAccessMock.setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Sub1')).returns(async () => subDirectories);

            // Act
            const subfolders: SubfolderModel[] = await service.getSubfoldersAsync(rootFolder, subfolder);

            // Assert
            expect(subfolders.length).toEqual(4);
            expect(subfolders[0].path).toEqual('/home/user/Music/Sub1');
            expect(subfolders[0].isGoToParent).toBeTruthy();
            expect(subfolders[1].path).toEqual('Root child 1');
            expect(subfolders[2].path).toEqual('Root child 2');
            expect(subfolders[3].path).toEqual('Root child 3');
        });
    });

    describe('getSubfolderBreadCrumbsAsync', () => {
        it('should always contain the root folder in first position', async () => {
            // Arrange
            const rootFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));

            fileAccessMock.setup((x) => x.getDirectoryPath('/home/user/Music')).returns(() => '/home/user');
            fileAccessMock.setup((x) => x.getDirectoryPath('/home/user/Music/subfolder1')).returns(() => '/home/user/Music');

            // Act
            const subfolderBreadCrumbs: SubfolderModel[] = await service.getSubfolderBreadCrumbsAsync(
                rootFolder,
                '/home/user/Music/subfolder1'
            );

            // Assert
            expect(subfolderBreadCrumbs[0].path).toEqual(rootFolder.path);
        });

        it('should only contain the root folder if the subfolder path is the root folder path', async () => {
            // Arrange
            const rootFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));

            // Act
            const subfolderBreadCrumbs: SubfolderModel[] = await service.getSubfolderBreadCrumbsAsync(rootFolder, rootFolder.path);

            // Assert
            expect(subfolderBreadCrumbs.length).toEqual(1);
            expect(subfolderBreadCrumbs[0].path).toEqual(rootFolder.path);
        });

        it('should contain subdirectories of the root folder until the given subfolder path included', async () => {
            // Arrange
            const rootFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));

            fileAccessMock
                .setup((x) => x.getDirectoryPath('/home/user/Music/subfolder1/subfolder2/subfolder3'))
                .returns(() => '/home/user/Music/subfolder1/subfolder2');

            fileAccessMock
                .setup((x) => x.getDirectoryPath('/home/user/Music/subfolder1/subfolder2'))
                .returns(() => '/home/user/Music/subfolder1');

            fileAccessMock.setup((x) => x.getDirectoryPath('/home/user/Music/subfolder1')).returns(() => '/home/user/Music');

            // Act
            const subfolderBreadCrumbs: SubfolderModel[] = await service.getSubfolderBreadCrumbsAsync(
                rootFolder,
                '/home/user/Music/subfolder1/subfolder2/subfolder3'
            );

            // Assert
            expect(subfolderBreadCrumbs.length).toEqual(4);
            expect(subfolderBreadCrumbs[0].path).toEqual('/home/user/Music');
            expect(subfolderBreadCrumbs[1].path).toEqual('/home/user/Music/subfolder1');
            expect(subfolderBreadCrumbs[2].path).toEqual('/home/user/Music/subfolder1/subfolder2');
            expect(subfolderBreadCrumbs[3].path).toEqual('/home/user/Music/subfolder1/subfolder2/subfolder3');
        });
    });

    describe('collectionHasFolders', () => {
        it('should count the folders from the database the first time it is called', () => {
            // Arrange
            const folder1: Folder = new Folder('path1');
            const folder2: Folder = new Folder('path2');

            folderRepositoryMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);

            // Act
            const collectionHasFolders: boolean = service.collectionHasFolders;

            // Assert
            folderRepositoryMock.verify((x) => x.getFolders(), Times.once());
        });

        it('should not count the folders from the database the second time it is called', () => {
            // Arrange
            const folder1: Folder = new Folder('path1');
            const folder2: Folder = new Folder('path2');

            folderRepositoryMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            const collectionHasFoldersFirstTime: boolean = service.collectionHasFolders;
            folderRepositoryMock.reset();
            folderRepositoryMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);

            // Act
            const collectionHasFoldersSecondTime: boolean = service.collectionHasFolders;

            // Assert
            folderRepositoryMock.verify((x) => x.getFolders(), Times.never());
        });

        it('should return true if the number of folders is larger than 0', () => {
            // Arrange
            const folder1: Folder = new Folder('path1');
            const folder2: Folder = new Folder('path2');

            folderRepositoryMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);

            // Act
            const collectionHasFolders: boolean = service.collectionHasFolders;

            // Assert
            expect(collectionHasFolders).toBeTruthy();
        });

        it('should return false if the number of folders is 0', () => {
            // Arrange
            folderRepositoryMock.setup((x) => x.getFolders()).returns(() => []);

            // Act
            const collectionHasFolders: boolean = service.collectionHasFolders;

            // Assert
            expect(collectionHasFolders).toBeFalsy();
        });
    });

    describe('onFoldersChanged', () => {
        it('should count the folders from the database the first time it is called', () => {
            // Arrange
            const folder1: Folder = new Folder('path1');
            const folder2: Folder = new Folder('path2');

            folderRepositoryMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);

            // Act
            service.onFoldersChanged();

            // Assert
            folderRepositoryMock.verify((x) => x.getFolders(), Times.once());
        });

        it('should count the folders from the database the second time it is called', () => {
            // Arrange
            const folder1: Folder = new Folder('path1');
            const folder2: Folder = new Folder('path2');

            folderRepositoryMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            service.onFoldersChanged();
            folderRepositoryMock.reset();
            folderRepositoryMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);

            // Act
            service.onFoldersChanged();

            // Assert
            folderRepositoryMock.verify((x) => x.getFolders(), Times.once());
        });

        it('should update collectionHasFolders each time it is called', () => {
            // Arrange
            const folder1: Folder = new Folder('path1');
            const folder2: Folder = new Folder('path2');

            folderRepositoryMock.setup((x) => x.getFolders()).returns(() => []);

            // Act
            service.onFoldersChanged();
            const collectionHasFoldersFirstTime: boolean = service.collectionHasFolders;
            folderRepositoryMock.reset();
            folderRepositoryMock.setup((x) => x.getFolders()).returns(() => [folder1, folder2]);
            service.onFoldersChanged();
            const collectionHasFoldersSecondTime: boolean = service.collectionHasFolders;

            // Assert
            expect(collectionHasFoldersFirstTime).toBeFalsy();
            expect(collectionHasFoldersSecondTime).toBeTruthy();
        });

        it('should trigger a foldersChanged event', () => {
            // Arrange
            folderRepositoryMock.setup((x) => x.getFolders()).returns(() => []);

            const subscription: Subscription = new Subscription();
            let foldersHaveChanged: boolean = false;

            subscription.add(
                service.foldersChanged$.subscribe(() => {
                    foldersHaveChanged = true;
                })
            );

            // Act
            service.onFoldersChanged();

            // Assert
            expect(foldersHaveChanged).toBeTruthy();
        });
    });
});
