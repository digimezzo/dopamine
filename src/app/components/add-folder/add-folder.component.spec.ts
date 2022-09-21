import { IMock, It, Mock, Times } from 'typemoq';
import { Folder } from '../../common/data/entities/folder';
import { BaseDesktop } from '../../common/io/base-desktop';
import { Logger } from '../../common/logger';
import { BaseSettings } from '../../common/settings/base-settings';
import { BaseDialogService } from '../../services/dialog/base-dialog.service';
import { BaseFolderService } from '../../services/folder/base-folder.service';
import { FolderModel } from '../../services/folder/folder-model';
import { BaseIndexingService } from '../../services/indexing/base-indexing.service';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { AddFolderComponent } from './add-folder.component';

describe('AddFolderComponent', () => {
    let desktopMock: IMock<BaseDesktop>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let folderServiceMock: IMock<BaseFolderService>;
    let dialogServiceMock: IMock<BaseDialogService>;
    let indexingServiceMock: IMock<BaseIndexingService>;
    let loggerMock: IMock<Logger>;
    let settingsStub: any;
    let settingsMock: IMock<BaseSettings>;
    let component: AddFolderComponent;
    let componentWithStub: AddFolderComponent;

    beforeEach(() => {
        desktopMock = Mock.ofType<BaseDesktop>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        folderServiceMock = Mock.ofType<BaseFolderService>();
        dialogServiceMock = Mock.ofType<BaseDialogService>();
        indexingServiceMock = Mock.ofType<BaseIndexingService>();
        loggerMock = Mock.ofType<Logger>();
        settingsStub = { showAllFoldersInCollection: false };
        settingsMock = Mock.ofType<BaseSettings>();

        translatorServiceMock.setup((x) => x.getAsync('select-folder')).returns(async () => 'Select a folder');
        translatorServiceMock.setup((x) => x.getAsync('delete-folder-error')).returns(async () => 'Error while deleting folder');

        component = new AddFolderComponent(
            desktopMock.object,
            translatorServiceMock.object,
            folderServiceMock.object,
            dialogServiceMock.object,
            indexingServiceMock.object,
            settingsMock.object,
            loggerMock.object
        );

        componentWithStub = new AddFolderComponent(
            desktopMock.object,
            translatorServiceMock.object,
            folderServiceMock.object,
            dialogServiceMock.object,
            indexingServiceMock.object,
            settingsStub,
            loggerMock.object
        );
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(componentWithStub).toBeDefined();
            expect(component).toBeDefined();
        });

        it('should define folders', () => {
            // Arrange

            // Act

            // Assert
            expect(component.folders).toBeDefined();
        });

        it('should define indexingService', () => {
            // Arrange

            // Act

            // Assert
            expect(component.indexingService).toBeDefined();
        });

        it('should not show check boxes by default', () => {
            // Arrange

            // Act

            // Assert
            expect(component.showCheckBoxes).toBeFalsy();
        });
    });

    describe('addFolderAsync', () => {
        it('should get translated text for the open folder dialog', async () => {
            // Arrange

            // Act
            await component.addFolderAsync();

            // Assert
            translatorServiceMock.verify((x) => x.getAsync('select-folder'), Times.exactly(1));
        });

        it('should allow selecting for a folder on the computer', async () => {
            // Arrange

            // Act
            await component.addFolderAsync();

            // Assert
            desktopMock.verify((x) => x.showSelectFolderDialogAsync('Select a folder'), Times.exactly(1));
        });

        it('should add a folder with the selected path to the database if the path is not empty', async () => {
            // Arrange
            desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/me/Music');

            // Act
            await component.addFolderAsync();

            // Assert
            folderServiceMock.verify((x) => x.addFolderAsync('/home/me/Music'), Times.exactly(1));
        });

        it('should not add a folder with the selected path to the database if the path is empty', async () => {
            // Arrange
            desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '');

            // Act
            await component.addFolderAsync();

            // Assert
            folderServiceMock.verify((x) => x.addFolderAsync(It.isAnyString()), Times.never());
        });

        it('should get all folders from the database if adding a folder succeeds', async () => {
            // Arrange
            desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');

            // Act
            await component.addFolderAsync();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('should not get all folders from the database if adding a folder fails', async () => {
            // Arrange
            desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');
            folderServiceMock.setup((x) => x.addFolderAsync('/home/user/music')).throws(new Error('An error occurred'));

            // Act
            await component.addFolderAsync();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.never());
        });

        it('should get the translation for the error dialog if adding a folder fails', async () => {
            // Arrange
            desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');
            folderServiceMock.setup((x) => x.addFolderAsync('/home/user/music')).throws(new Error('An error occurred'));

            // Act
            await component.addFolderAsync();

            // Assert
            translatorServiceMock.verify((x) => x.getAsync('add-folder-error'), Times.exactly(1));
        });

        it('should show an error dialog if adding a folder fails', async () => {
            // Arrange
            translatorServiceMock.setup((x) => x.getAsync('add-folder-error')).returns(async () => 'Error while adding folder');
            desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');
            folderServiceMock.setup((x) => x.addFolderAsync('/home/user/music')).throws(new Error('An error occurred'));

            // Act
            await component.addFolderAsync();

            // Assert
            dialogServiceMock.verify((x) => x.showErrorDialog('Error while adding folder'), Times.exactly(1));
        });
    });

    describe('getFoldersAsync', () => {
        it('should get folders from the database', async () => {
            // Arrange

            // Act
            await component.getFoldersAsync();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });
    });

    describe('ngOnInit', () => {
        it('should get folders from the database', async () => {
            // Arrange

            // Act
            await component.ngOnInit();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });
    });

    describe('deleteFolderAsync', () => {
        it('should get translated text for the delete folder confirmation dialog title', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(async () => 'Delete folder?');
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(async () => 'Are you sure you want to delete this folder?');

            // Act
            await component.deleteFolderAsync(folderToDelete);

            // Assert
            translatorServiceMock.verify((x) => x.getAsync('confirm-delete-folder'), Times.exactly(1));
        });

        it('should get translated text for the delete folder confirmation dialog text', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(async () => 'Delete folder?');
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(async () => 'Are you sure you want to delete this folder?');

            // Act
            await component.deleteFolderAsync(folderToDelete);

            // Assert
            translatorServiceMock.verify(
                (x) =>
                    x.getAsync('confirm-delete-folder-long', {
                        folderPath: folderToDelete.path,
                    }),
                Times.exactly(1)
            );
        });

        it('should show a confirmation dialog', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(async () => 'Delete folder?');
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(async () => 'Are you sure you want to delete this folder?');

            // Act
            await component.deleteFolderAsync(folderToDelete);

            // Assert
            dialogServiceMock.verify(
                (x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'),
                Times.exactly(1)
            );
        });

        it('should delete the folder if the user has confirmed deletion', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(async () => 'Delete folder?');
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(async () => 'Are you sure you want to delete this folder?');

            dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(async () => true);

            // Act
            await component.deleteFolderAsync(folderToDelete);

            // Assert
            folderServiceMock.verify((x) => x.deleteFolder(folderToDelete), Times.exactly(1));
        });

        it('should not delete the folder if the user has not confirmed deletion', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(async () => 'Delete folder?');
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(async () => 'Are you sure you want to delete this folder?');

            dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(async () => false);

            // Act
            await component.deleteFolderAsync(folderToDelete);

            // Assert
            folderServiceMock.verify((x) => x.deleteFolder(folderToDelete), Times.never());
        });

        it('should get all folders if the user has confirmed deletion', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(async () => 'Delete folder?');
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(async () => 'Are you sure you want to delete this folder?');

            dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(async () => true);

            // Act
            await component.deleteFolderAsync(folderToDelete);

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('should not get all the folders if the user has not confirmed deletion', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(async () => 'Delete folder?');
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(async () => 'Are you sure you want to delete this folder?');

            dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(async () => false);

            // Act
            await component.deleteFolderAsync(folderToDelete);

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.never());
        });

        it('should get the translation for the error dialog if deleting a folder fails', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(async () => 'Delete folder?');
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(async () => 'Are you sure you want to delete this folder?');

            dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(async () => true);

            folderServiceMock.setup((x) => x.deleteFolder(folderToDelete)).throws(new Error('An error occurred'));

            // Act
            await component.deleteFolderAsync(folderToDelete);

            // Assert
            translatorServiceMock.verify((x) => x.getAsync('delete-folder-error'), Times.exactly(1));
        });

        it('should show an error dialog if deleting a folder fails', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(async () => 'Delete folder?');
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(async () => 'Are you sure you want to delete this folder?');

            dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(async () => true);

            folderServiceMock.setup((x) => x.deleteFolder(folderToDelete)).throws(new Error('An error occurred'));

            // Act
            await component.deleteFolderAsync(folderToDelete);

            // Assert
            dialogServiceMock.verify((x) => x.showErrorDialog('Error while deleting folder'), Times.exactly(1));
        });
    });

    describe('showAllFoldersInCollection', () => {
        it('should get settings showAllFoldersInCollection', () => {
            // Arrange

            // Act
            const showAllFoldersInCollection = component.showAllFoldersInCollection;

            // Assert
            settingsMock.verify((x) => x.showAllFoldersInCollection, Times.exactly(1));
        });

        it('should set settings showAllFoldersInCollection', () => {
            // Arrange

            // Act
            componentWithStub.showAllFoldersInCollection = true;

            // Assert
            expect(settingsStub.showAllFoldersInCollection).toBeTruthy();
        });
    });

    describe('setFolderVisibility', () => {
        it('should save folder visibility', () => {
            // Arrange
            const folder: FolderModel = new FolderModel(new Folder('/home/user/Music'));

            // Act
            component.setFolderVisibility(folder);

            // Assert
            folderServiceMock.verify((x) => x.setFolderVisibility(folder), Times.exactly(1));
        });

        it('should disable showAllFoldersInCollection', () => {
            // Arrange
            const folder: FolderModel = new FolderModel(new Folder('/home/user/Music'));

            // Act
            componentWithStub.showAllFoldersInCollection = true;
            componentWithStub.setFolderVisibility(folder);

            // Assert
            expect(componentWithStub.showAllFoldersInCollection).toBeFalsy();
        });

        it('should set all folders visible if true', () => {
            // Arrange

            // Act
            component.showAllFoldersInCollection = true;

            // Assert
            folderServiceMock.verify((x) => x.setAllFoldersVisible(), Times.exactly(1));
        });

        it('should not set all folders visible if false', () => {
            // Arrange

            // Act
            component.showAllFoldersInCollection = false;

            // Assert
            folderServiceMock.verify((x) => x.setAllFoldersVisible(), Times.never());
        });
    });
});
