import * as assert from 'assert';
import { It, Times } from 'typemoq';
import { Folder } from '../app/data/entities/folder';
import { FolderModel } from '../app/services/folder/folder-model';
import { AddFolderComponentMocker } from './mocking/add-folder-component-mocker';

describe('AddFolderComponent', () => {
    describe('constructor', () => {
        it('should provide a list of folders', () => {
            // Arrange
            const mock: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            // Act

            // Assert
            assert.ok(mock.addFolderComponent.folders);
        });

        it('should set indexingService', () => {
            // Arrange
            const mock: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            // Act

            // Assert
            assert.ok(mock.addFolderComponent.indexingService);
        });
    });

    describe('constructor', () => {
        it('should not show check boxes by default', () => {
            // Arrange
            const mock: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            // Act

            // Assert
            assert.strictEqual(mock.addFolderComponent.showCheckBoxes, false);
        });
    });

    describe('addFolderAsync', () => {
        it('should get translated text for the open folder dialog', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.translatorServiceMock.verify((x) => x.getAsync('Pages.ManageCollection.SelectFolder'), Times.exactly(1));
        });

        it('should allow selecting for a folder on the computer', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.desktopMock.verify((x) => x.showSelectFolderDialogAsync('Select a folder'), Times.exactly(1));
        });

        it('should add a folder with the selected path to the database if the path is not empty', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            mocker.desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/me/Music');

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.folderServiceMock.verify((x) => x.addFolderAsync('/home/me/Music'), Times.exactly(1));
        });

        it('should not add a folder with the selected path to the database if the path is empty', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            mocker.desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '');

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.folderServiceMock.verify((x) => x.addFolderAsync(It.isAnyString()), Times.never());
        });

        it('should get all folders from the database if adding a folder succeeds', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            mocker.desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('should not get all folders from the database if adding a folder fails', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            mocker.desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');
            mocker.folderServiceMock.setup((x) => x.addFolderAsync('/home/user/music')).throws(new Error('An error occurred'));

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.folderServiceMock.verify((x) => x.getFolders(), Times.never());
        });

        it('should get the translation for the error dialog if adding a folder fails', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            mocker.desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');
            mocker.folderServiceMock.setup((x) => x.addFolderAsync('/home/user/music')).throws(new Error('An error occurred'));

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.translatorServiceMock.verify((x) => x.getAsync('ErrorTexts.AddFolderError'), Times.exactly(1));
        });

        it('should show an error dialog if adding a folder fails', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            mocker.translatorServiceMock
                .setup((x) => x.getAsync('ErrorTexts.AddFolderError'))
                .returns(async () => 'Error while adding folder');
            mocker.desktopMock.setup((x) => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');
            mocker.folderServiceMock.setup((x) => x.addFolderAsync('/home/user/music')).throws(new Error('An error occurred'));

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.dialogServiceMock.verify((x) => x.showErrorDialog('Error while adding folder'), Times.exactly(1));
        });
    });

    describe('getFoldersAsync', () => {
        it('should get folders from the database', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            // Act
            await mocker.addFolderComponent.getFoldersAsync();

            // Assert
            mocker.folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });
    });

    describe('ngOnInit', () => {
        it('should get folders from the database', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            // Act
            await mocker.addFolderComponent.ngOnInit();

            // Assert
            mocker.folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });
    });

    describe('deleteFolderAsync', () => {
        it('should get translated text for the delete folder confirmation dialog title', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.translatorServiceMock.verify((x) => x.getAsync('DialogTitles.ConfirmDeleteFolder'), Times.exactly(1));
        });

        it('should get translated text for the delete folder confirmation dialog text', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.translatorServiceMock.verify(
                (x) =>
                    x.getAsync('DialogTexts.ConfirmDeleteFolder', {
                        folderPath: folderToDelete.path,
                    }),
                Times.exactly(1)
            );
        });

        it('should show a confirmation dialog', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.dialogServiceMock.verify(
                (x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'),
                Times.exactly(1)
            );
        });

        it('should delete the folder if the user has confirmed deletion', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            mocker.dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(async () => true);

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.folderServiceMock.verify((x) => x.deleteFolder(folderToDelete), Times.exactly(1));
        });

        it('should not delete the folder if the user has not confirmed deletion', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            mocker.dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(async () => false);

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.folderServiceMock.verify((x) => x.deleteFolder(folderToDelete), Times.never());
        });

        it('should get all folders if the user has confirmed deletion', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            mocker.dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(async () => true);

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.folderServiceMock.verify((x) => x.getFolders(), Times.exactly(1));
        });

        it('should not get all the folders if the user has not confirmed deletion', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            mocker.dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(async () => false);

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.folderServiceMock.verify((x) => x.getFolders(), Times.never());
        });

        it('should get the translation for the error dialog if deleting a folder fails', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            mocker.dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(async () => true);

            mocker.folderServiceMock.setup((x) => x.deleteFolder(folderToDelete)).throws(new Error('An error occurred'));

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.translatorServiceMock.verify((x) => x.getAsync('ErrorTexts.DeleteFolderError'), Times.exactly(1));
        });

        it('should show an error dialog if deleting a folder fails', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            mocker.dialogServiceMock
                .setup((x) => x.showConfirmationDialogAsync('Delete folder?', 'Are you sure you want to delete this folder?'))
                .returns(async () => true);

            mocker.folderServiceMock.setup((x) => x.deleteFolder(folderToDelete)).throws(new Error('An error occurred'));

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.dialogServiceMock.verify((x) => x.showErrorDialog('Error while deleting folder'), Times.exactly(1));
        });
    });

    describe('showAllFoldersInCollection', () => {
        it('should get settings showAllFoldersInCollection', () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            // Act
            const showAllFoldersInCollection = mocker.addFolderComponent.showAllFoldersInCollection;

            // Assert
            mocker.settingsMock.verify((x) => x.showAllFoldersInCollection, Times.exactly(1));
        });

        it('should set settings showAllFoldersInCollection', () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(true);
            mocker.settingsMock.showAllFoldersInCollection = false;

            // Act
            mocker.addFolderComponent.showAllFoldersInCollection = true;

            // Assert
            assert.strictEqual(mocker.settingsMock.showAllFoldersInCollection, true);
        });
    });

    describe('setFolderVisibility', () => {
        it('should save folder visibility', () => {
            // Arrange
            const folder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            // Act
            mocker.addFolderComponent.setFolderVisibility(folder);

            // Assert
            mocker.folderServiceMock.verify((x) => x.setFolderVisibility(folder), Times.exactly(1));
        });

        it('should disable showAllFoldersInCollection', () => {
            // Arrange
            const folder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(true);

            // Act
            mocker.addFolderComponent.showAllFoldersInCollection = true;
            mocker.addFolderComponent.setFolderVisibility(folder);

            // Assert
            assert.strictEqual(mocker.addFolderComponent.showAllFoldersInCollection, false);
        });

        it('should set all folders visible if true', () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(true);

            // Act
            mocker.addFolderComponent.showAllFoldersInCollection = true;

            // Assert
            mocker.folderServiceMock.verify((x) => x.setAllFoldersVisible(), Times.exactly(1));
        });

        it('should not set all folders visible if false', () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(true);

            // Act
            mocker.addFolderComponent.showAllFoldersInCollection = false;

            // Assert
            mocker.folderServiceMock.verify((x) => x.setAllFoldersVisible(), Times.never());
        });
    });
});
