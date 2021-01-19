import * as assert from 'assert';
import { Subscription } from 'rxjs';
import { IMock, It, Mock, Times } from 'typemoq';
import { FileSystem } from '../../core/io/file-system';
import { Logger } from '../../core/logger';
import { Folder } from '../../data/entities/folder';
import { BaseFolderRepository } from '../../data/repositories/base-folder-repository';
import { BaseSnackBarService } from '../snack-bar/base-snack-bar.service';
import { FolderModel } from './folder-model';
import { FolderService } from './folder.service';
import { SubfolderModel } from './subfolder-model';

describe('FolderService', () => {
    let folderRepositoryMock: IMock<BaseFolderRepository>;
    let snackBarServiceMock: IMock<BaseSnackBarService>;
    let loggerMock: IMock<Logger>;
    let fileSystemMock: IMock<FileSystem>;

    let service: FolderService;

    beforeEach(() => {
        folderRepositoryMock = Mock.ofType<BaseFolderRepository>();
        snackBarServiceMock = Mock.ofType<BaseSnackBarService>();
        loggerMock = Mock.ofType<Logger>();
        fileSystemMock = Mock.ofType<FileSystem>();

        service = new FolderService(folderRepositoryMock.object, loggerMock.object, snackBarServiceMock.object, fileSystemMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            assert.ok(service);
        });
    });

    describe('addFolderAsync', () => {
        it('should add a new folder with the selected path to the database', async () => {
            // Arrange
            folderRepositoryMock.setup((x) => x.getFolderByPath('/home/me/Music')).returns(() => undefined);

            // Act
            await service.addFolderAsync('/home/me/Music');

            // Assert
            folderRepositoryMock.verify(
                (x) =>
                    x.addFolder(
                        It.isObjectWith<Folder>({ path: '/home/me/Music' })
                    ),
                Times.exactly(1)
            );
        });

        it('should not add an existing folder with the selected path to the database', async () => {
            // Arrange
            folderRepositoryMock.setup((x) => x.getFolderByPath('/home/me/Music')).returns(() => new Folder('/home/me/Music'));

            // Act
            await service.addFolderAsync('/home/me/Music');

            // Assert
            folderRepositoryMock.verify(
                (x) =>
                    x.addFolder(
                        It.isObjectWith<Folder>({ path: '/home/me/Music' })
                    ),
                Times.never()
            );
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
            assert.strictEqual(foldersHaveChanged, true);
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
            assert.strictEqual(foldersHaveChanged, false);
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
            assert.strictEqual(folders.length, 0);
        });

        it('should return an empty collection when database folders are empty', () => {
            // Arrange
            folderRepositoryMock.setup((x) => x.getFolders()).returns(() => []);

            // Act
            const folders: FolderModel[] = service.getFolders();

            // Assert
            assert.strictEqual(folders.length, 0);
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
            assert.strictEqual(folders.length, 2);
            assert.strictEqual(folders[0].folderId, 1);
            assert.strictEqual(folders[0].path, 'One');
            assert.strictEqual(folders[1].folderId, 2);
            assert.strictEqual(folders[1].path, 'Two');
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
            assert.strictEqual(foldersHaveChanged, true);
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
            assert.strictEqual(subfolders.length, 0);
        });

        it('should return no subfolders, given a root folder but no subfolder, and the root folder path does not exist.', async () => {
            // Arrange
            const rootFolderPath: string = '/home/user/Music';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            fileSystemMock.setup((x) => x.pathExists(rootFolderPath)).returns(() => false);

            // Act
            const subfolders: SubfolderModel[] = await service.getSubfoldersAsync(rootFolder, undefined);

            // Assert
            assert.strictEqual(subfolders.length, 0);
        });

        it('should return the subfolders of the root folder, given a root folder but no subfolder, and the root folder path exists.', async () => {
            // Arrange
            const rootFolderPath: string = '/home/user/Music';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            const rootFolderDirectories: string[] = ['Root child 1', 'Root child 2', 'Root child 3'];
            fileSystemMock.setup((x) => x.pathExists(rootFolderPath)).returns(() => true);
            fileSystemMock.setup((x) => x.getDirectoriesInDirectoryAsync(rootFolderPath)).returns(async () => rootFolderDirectories);

            // Act
            const subfolders: SubfolderModel[] = await service.getSubfoldersAsync(rootFolder, undefined);

            // Assert
            assert.strictEqual(subfolders.length, 3);
            assert.strictEqual(subfolders[0].path, 'Root child 1');
            assert.strictEqual(subfolders[1].path, 'Root child 2');
            assert.strictEqual(subfolders[2].path, 'Root child 3');
        });

        it('should return no subfolders, given a root folder and a subfolder, and the subfolder path does not exist.', async () => {
            // Arrange
            const rootFolderPath: string = '/home/user/Music';
            const subfolderPath: string = '/home/user/Music/Subfolder1';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            const subfolder: SubfolderModel = new SubfolderModel(subfolderPath, false);
            fileSystemMock.setup((x) => x.pathExists(subfolderPath)).returns(() => false);

            // Act
            const subfolders: SubfolderModel[] = await service.getSubfoldersAsync(rootFolder, subfolder);

            // Assert
            assert.strictEqual(subfolders.length, 0);
        });

        it('should return subfolders of the subfolder, given a root folder and a subfolder which is the root folder.', async () => {
            // Arrange
            const rootFolderPath: string = '/home/user/Music';
            const subfolderPath: string = '/home/user/Music';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            const subfolder: SubfolderModel = new SubfolderModel(subfolderPath, false);
            const subDirectories: string[] = ['Root child 1', 'Root child 2', 'Root child 3'];
            fileSystemMock.setup((x) => x.pathExists(subfolderPath)).returns(() => true);
            fileSystemMock.setup((x) => x.getDirectoriesInDirectoryAsync(subfolderPath)).returns(async () => subDirectories);

            // Act
            const subfolders: SubfolderModel[] = await service.getSubfoldersAsync(rootFolder, subfolder);

            // Assert
            assert.strictEqual(subfolders.length, 3);
            assert.strictEqual(subfolders[0].path, 'Root child 1');
            assert.strictEqual(subfolders[1].path, 'Root child 2');
            assert.strictEqual(subfolders[2].path, 'Root child 3');
        });

        it('should return a go to parent subfolder and subfolders of the sub folder, given a root folder and a subfolder which is not the root folder.', async () => {
            // Arrange
            const rootFolderPath: string = '/home/user/Music';
            const subfolderPath: string = '/home/user/Music/Sub1';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            const subfolder: SubfolderModel = new SubfolderModel(subfolderPath, false);
            const subDirectories: string[] = ['Root child 1', 'Root child 2', 'Root child 3'];
            fileSystemMock.setup((x) => x.pathExists(subfolderPath)).returns(() => true);
            fileSystemMock.setup((x) => x.getDirectoriesInDirectoryAsync(subfolderPath)).returns(async () => subDirectories);

            // Act
            const subfolders: SubfolderModel[] = await service.getSubfoldersAsync(rootFolder, subfolder);

            // Assert
            assert.strictEqual(subfolders.length, 4);
            assert.strictEqual(subfolders[0].path, '/home/user/Music/Sub1');
            assert.strictEqual(subfolders[0].isGoToParent, true);
            assert.strictEqual(subfolders[1].path, 'Root child 1');
            assert.strictEqual(subfolders[2].path, 'Root child 2');
            assert.strictEqual(subfolders[3].path, 'Root child 3');
        });

        it('should return the subfolders of the parent folder, given a go to parent subfolder', async () => {
            // Arrange
            const rootFolderPath: string = '/home/user/Music';
            const subfolderPath: string = '/home/user/Music/Sub1/Sub2';
            const rootFolder: FolderModel = new FolderModel(new Folder(rootFolderPath));
            const subfolder: SubfolderModel = new SubfolderModel(subfolderPath, true);
            const subDirectories: string[] = ['Root child 1', 'Root child 2', 'Root child 3'];
            fileSystemMock.setup((x) => x.pathExists(subfolderPath)).returns(() => true);
            fileSystemMock.setup((x) => x.getDirectoryPath(subfolderPath)).returns(() => '/home/user/Music/Sub1');
            fileSystemMock.setup((x) => x.getDirectoriesInDirectoryAsync('/home/user/Music/Sub1')).returns(async () => subDirectories);

            // Act
            const subfolders: SubfolderModel[] = await service.getSubfoldersAsync(rootFolder, subfolder);

            // Assert
            assert.strictEqual(subfolders.length, 4);
            assert.strictEqual(subfolders[0].path, '/home/user/Music/Sub1');
            assert.strictEqual(subfolders[0].isGoToParent, true);
            assert.strictEqual(subfolders[1].path, 'Root child 1');
            assert.strictEqual(subfolders[2].path, 'Root child 2');
            assert.strictEqual(subfolders[3].path, 'Root child 3');
        });
    });

    describe('getSubfolderBreadCrumbsAsync', () => {
        it('should always contain the root folder in first position', async () => {
            // Arrange
            const rootFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));

            fileSystemMock.setup((x) => x.getDirectoryPath('/home/user/Music')).returns(() => '/home/user');
            fileSystemMock.setup((x) => x.getDirectoryPath('/home/user/Music/subfolder1')).returns(() => '/home/user/Music');

            // Act
            const subfolderBreadCrumbs: SubfolderModel[] = await service.getSubfolderBreadCrumbsAsync(
                rootFolder,
                '/home/user/Music/subfolder1'
            );

            // Assert
            assert.strictEqual(subfolderBreadCrumbs[0].path, rootFolder.path);
        });

        it('should only contain the root folder if the subfolder path is the root folder path', async () => {
            // Arrange
            const rootFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));

            // Act
            const subfolderBreadCrumbs: SubfolderModel[] = await service.getSubfolderBreadCrumbsAsync(rootFolder, rootFolder.path);

            // Assert
            assert.strictEqual(subfolderBreadCrumbs.length, 1);
            assert.strictEqual(subfolderBreadCrumbs[0].path, rootFolder.path);
        });

        it('should contain subdirectories of the root folder until the given subfolder path included', async () => {
            // Arrange
            const rootFolder: FolderModel = new FolderModel(new Folder('/home/user/Music'));

            fileSystemMock
                .setup((x) => x.getDirectoryPath('/home/user/Music/subfolder1/subfolder2/subfolder3'))
                .returns(() => '/home/user/Music/subfolder1/subfolder2');

            fileSystemMock
                .setup((x) => x.getDirectoryPath('/home/user/Music/subfolder1/subfolder2'))
                .returns(() => '/home/user/Music/subfolder1');

            fileSystemMock.setup((x) => x.getDirectoryPath('/home/user/Music/subfolder1')).returns(() => '/home/user/Music');

            // Act
            const subfolderBreadCrumbs: SubfolderModel[] = await service.getSubfolderBreadCrumbsAsync(
                rootFolder,
                '/home/user/Music/subfolder1/subfolder2/subfolder3'
            );

            // Assert
            assert.strictEqual(subfolderBreadCrumbs.length, 4);
            assert.strictEqual(subfolderBreadCrumbs[0].path, '/home/user/Music');
            assert.strictEqual(subfolderBreadCrumbs[1].path, '/home/user/Music/subfolder1');
            assert.strictEqual(subfolderBreadCrumbs[2].path, '/home/user/Music/subfolder1/subfolder2');
            assert.strictEqual(subfolderBreadCrumbs[3].path, '/home/user/Music/subfolder1/subfolder2/subfolder3');
        });
    });
});
