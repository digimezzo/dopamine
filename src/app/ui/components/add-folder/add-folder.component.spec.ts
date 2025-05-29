import { IMock, It, Mock, Times } from 'typemoq';
import { AddFolderComponent } from './add-folder.component';
import { SettingsBase } from '../../../common/settings/settings.base';
import { Logger } from '../../../common/logger';
import { DesktopBase } from '../../../common/io/desktop.base';
import { TranslatorServiceBase } from '../../../services/translator/translator.service.base';
import { FolderServiceBase } from '../../../services/folder/folder.service.base';
import { DialogServiceBase } from '../../../services/dialog/dialog.service.base';
import { IndexingService } from '../../../services/indexing/indexing.service';
import { FolderModel } from '../../../services/folder/folder-model';
import { Folder } from '../../../data/entities/folder';

describe('AddFolderComponent', () => {
    let desktopMock: IMock<DesktopBase>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let folderServiceMock: IMock<FolderServiceBase>;
    let dialogServiceMock: IMock<DialogServiceBase>;
    let indexingServiceMock: IMock<IndexingService>;
    let loggerMock: IMock<Logger>;
    let settingsStub: any;
    let settingsMock: IMock<SettingsBase>;
    let component: AddFolderComponent;
    let componentWithStub: AddFolderComponent;

    beforeEach(() => {
        desktopMock = Mock.ofType<DesktopBase>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        folderServiceMock = Mock.ofType<FolderServiceBase>();
        dialogServiceMock = Mock.ofType<DialogServiceBase>();
        indexingServiceMock = Mock.ofType<IndexingService>();
        loggerMock = Mock.ofType<Logger>();
        settingsStub = { showAllFoldersInCollection: false };
        settingsMock = Mock.ofType<SettingsBase>();

        translatorServiceMock.setup((x) => x.getAsync('select-folder')).returns(() => Promise.resolve('Select a folder'));
        translatorServiceMock.setup((x) => x.getAsync('delete-folder-error')).returns(() => Promise.resolve('Error while deleting folder'));

        component = new AddFolderComponent(
            desktopMock.object,
            translatorServiceMock.object,
            folderServiceMock.object,
            dialogServiceMock.object,
            indexingServiceMock.object,
            settingsMock.object,
            loggerMock.object,
        );

        componentWithStub = new AddFolderComponent(
            desktopMock.object,
            translatorServiceMock.object,
            folderServiceMock.object,
            dialogServiceMock.object,
            indexingServiceMock.object,
            settingsStub,
            loggerMock.object,
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
            desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(() => Promise.resolve('/home/me/Music'));

            // Act
            await component.addFolderAsync();

            // Assert
            folderServiceMock.verify((x) => x.addFolderAsync('/home/me/Music'), Times.exactly(1));
        });

        it('should not add a folder with the selected path to the database if the path is empty', async () => {
            // Arrange
            desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(() => Promise.resolve(''));

            // Act
            await component.addFolderAsync();

            // Assert
            folderServiceMock.verify((x) => x.addFolderAsync(It.isAnyString()), Times.never());
        });

        it('should get all folders from the database if adding a folder succeeds', async () => {
            // Arrange
            desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(() => Promise.resolve('/home/user/music'));

            // Act
            await component.addFolderAsync();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('should not get all folders from the database if adding a folder fails', async () => {
            // Arrange
            desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(() => Promise.resolve('/home/user/music'));
            folderServiceMock.setup((x) => x.addFolderAsync('/home/user/music')).throws(new Error('An error occurred'));

            // Act
            await component.addFolderAsync();

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.never());
        });

        it('should get the translation for the error dialog if adding a folder fails', async () => {
            // Arrange
            desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(() => Promise.resolve('/home/user/music'));
            folderServiceMock.setup((x) => x.addFolderAsync('/home/user/music')).throws(new Error('An error occurred'));

            // Act
            await component.addFolderAsync();

            // Assert
            translatorServiceMock.verify((x) => x.getAsync('add-folder-error'), Times.exactly(1));
        });

        it('should show an error dialog if adding a folder fails', async () => {
            // Arrange
            translatorServiceMock.setup((x) => x.getAsync('add-folder-error')).returns(() => Promise.resolve('Error while adding folder'));
            desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(() => Promise.resolve('/home/user/music'));
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
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(() => Promise.resolve('Delete folder?'));
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(() => Promise.resolve('Are you sure you want to delete this folder?'));

            // Act
            await component.deleteFolderAsync(folderToDelete);

            // Assert
            translatorServiceMock.verify((x) => x.getAsync('confirm-delete-folder'), Times.exactly(1));
        });

        it('should get translated text for the delete folder confirmation dialog text', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(() => Promise.resolve('Delete folder?'));
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(() => Promise.resolve('Are you sure you want to delete this folder?'));

            // Act
            await component.deleteFolderAsync(folderToDelete);

            // Assert
            translatorServiceMock.verify(
                (x) =>
                    x.getAsync('confirm-delete-folder-long', {
                        folderPath: folderToDelete.path,
                    }),
                Times.exactly(1),
            );
        });

        it('should show a confirmation dialog', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(() => Promise.resolve('Delete folder?'));
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(() => Promise.resolve('Are you sure you want to delete this folder?'));

            // Act
            await component.deleteFolderAsync(folderToDelete);

            // Assert
            dialogServiceMock.verify(
                (x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'),
                Times.exactly(1),
            );
        });

        it('should delete the folder if the user has confirmed deletion', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(() => Promise.resolve('Delete folder?'));
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(() => Promise.resolve('Are you sure you want to delete this folder?'));

            dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(() => Promise.resolve(true));

            // Act
            await component.deleteFolderAsync(folderToDelete);

            // Assert
            folderServiceMock.verify((x) => x.deleteFolder(folderToDelete), Times.exactly(1));
        });

        it('should not delete the folder if the user has not confirmed deletion', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(() => Promise.resolve('Delete folder?'));
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(() => Promise.resolve('Are you sure you want to delete this folder?'));

            dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(() => Promise.resolve(false));

            // Act
            await component.deleteFolderAsync(folderToDelete);

            // Assert
            folderServiceMock.verify((x) => x.deleteFolder(folderToDelete), Times.never());
        });

        it('should get all folders if the user has confirmed deletion', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(() => Promise.resolve('Delete folder?'));
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(() => Promise.resolve('Are you sure you want to delete this folder?'));

            dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(() => Promise.resolve(true));

            // Act
            await component.deleteFolderAsync(folderToDelete);

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('should not get all the folders if the user has not confirmed deletion', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(() => Promise.resolve('Delete folder?'));
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(() => Promise.resolve('Are you sure you want to delete this folder?'));

            dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(() => Promise.resolve(false));

            // Act
            await component.deleteFolderAsync(folderToDelete);

            // Assert
            folderServiceMock.verify((x) => x.getFolders(), Times.never());
        });

        it('should get the translation for the error dialog if deleting a folder fails', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(() => Promise.resolve('Delete folder?'));
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(() => Promise.resolve('Are you sure you want to delete this folder?'));

            dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(() => Promise.resolve(true));

            folderServiceMock.setup((x) => x.deleteFolder(folderToDelete)).throws(new Error('An error occurred'));

            // Act
            await component.deleteFolderAsync(folderToDelete);

            // Assert
            translatorServiceMock.verify((x) => x.getAsync('delete-folder-error'), Times.exactly(1));
        });

        it('should show an error dialog if deleting a folder fails', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            translatorServiceMock.setup((x) => x.getAsync('confirm-delete-folder')).returns(() => Promise.resolve('Delete folder?'));
            translatorServiceMock
                .setup((x) => x.getAsync('confirm-delete-folder-long', { folderPath: folderToDelete.path }))
                .returns(() => Promise.resolve('Are you sure you want to delete this folder?'));

            dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(() => Promise.resolve(true));

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
