import * as assert from 'assert';
import { It, Times } from 'typemoq';
import { Folder } from '../app/data/entities/folder';
import { FolderModel } from '../app/services/folder/folder-model';
import { AddFolderComponentMocker } from './mocking/add-folder-component-mocker';

describe('AddFolderComponent', () => {
    describe('constructor', () => {
        it('Should provide a list of folders', () => {
            // Arrange
            const mock: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            // Act

            // Assert
            assert.ok(mock.addFolderComponent.folders);
        });
    });

    describe('constructor', () => {
        it('Should not show check boxes by default', () => {
            // Arrange
            const mock: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            // Act

            // Assert
            assert.strictEqual(mock.addFolderComponent.showCheckBoxes, false);
        });
    });

    describe('addFolderAsync', () => {
        it('Should get translated text for the open folder dialog', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.translatorServiceMock.verify(x => x.getAsync('Pages.ManageCollection.SelectFolder'), Times.exactly(1));
        });

        it('Should allow selecting for a folder on the computer', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.desktopMock.verify(x => x.showSelectFolderDialogAsync('Select a folder'), Times.exactly(1));
        });

        it('Should add a folder with the selected path to the database if the path is not empty', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            mocker.desktopMock.setup(x => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/me/Music');

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.folderServiceMock.verify(x => x.addNewFolderAsync('/home/me/Music'), Times.exactly(1));
        });

        it('Should not add a folder with the selected path to the database if the path is empty', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            mocker.desktopMock.setup(x => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '');

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.folderServiceMock.verify(x => x.addNewFolderAsync(It.isAnyString()), Times.never());
        });

        it('Should get all folders from the database if adding a folder succeeds', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            mocker.desktopMock.setup(x => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.folderServiceMock.verify(x => x.getFolders(), Times.exactly(1));
        });

        it('Should not get all folders from the database if adding a folder fails', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            mocker.desktopMock.setup(x => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');
            mocker.folderServiceMock.setup(x => x.addNewFolderAsync('/home/user/music')).throws(new Error('An error occurred'));

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.folderServiceMock.verify(x => x.getFolders(), Times.never());
        });

        it('Should get the translation for the error dialog if adding a folder fails', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            mocker.desktopMock.setup(x => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');
            mocker.folderServiceMock.setup(x => x.addNewFolderAsync('/home/user/music')).throws(new Error('An error occurred'));

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.translatorServiceMock.verify(x => x.getAsync('ErrorTexts.AddFolderError'), Times.exactly(1));
        });

        it('Should show an error dialog if adding a folder fails', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            mocker.translatorServiceMock.setup(
                x => x.getAsync('ErrorTexts.AddFolderError')
            ).returns(async () => 'Error while adding folder');
            mocker.desktopMock.setup(x => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');
            mocker.folderServiceMock.setup(x => x.addNewFolderAsync('/home/user/music')).throws(new Error('An error occurred'));

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.dialogServiceMock.verify(x => x.showErrorDialog('Error while adding folder'), Times.exactly(1));
        });

        it('Should tell indexingService that the folders have changed if adding a folder succeeds', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            mocker.desktopMock.setup(x => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.indexingServiceMock.verify(x => x.foldersHaveChanged = true, Times.exactly(1));
        });

        it('Should not tell indexingService that the folders have changed if adding a folder fails', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            mocker.desktopMock.setup(x => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');
            mocker.folderServiceMock.setup(x => x.addNewFolderAsync('/home/user/music')).throws(new Error('An error occurred'));

            // Act
            await mocker.addFolderComponent.addFolderAsync();

            // Assert
            mocker.indexingServiceMock.verify(x => x.foldersHaveChanged = true, Times.never());
        });
    });

    describe('getFoldersAsync', () => {
        it('Should get folders from the database', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            // Act
            await mocker.addFolderComponent.getFoldersAsync();

            // Assert
            mocker.folderServiceMock.verify(x => x.getFolders(), Times.exactly(1));
        });
    });

    describe('ngOnInit', () => {
        it('Should get folders from the database', async () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            // Act
            await mocker.addFolderComponent.ngOnInit();

            // Assert
            mocker.folderServiceMock.verify(x => x.getFolders(), Times.exactly(1));
        });
    });

    describe('deleteFolderAsync', () => {
        it('Should get translated text for the delete folder confirmation dialog title', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.translatorServiceMock.verify(x => x.getAsync('DialogTitles.ConfirmDeleteFolder'), Times.exactly(1));
        });

        it('Should get translated text for the delete folder confirmation dialog text', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.translatorServiceMock.verify(x => x.getAsync(
                'DialogTexts.ConfirmDeleteFolder',
                { folderPath: folderToDelete.path }), Times.exactly(1));
        });

        it('Should show a confirmation dialog', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.dialogServiceMock.verify(x => x.showConfirmationDialogAsync(
                'Delete folder?',
                'Are you sure you want to delete this folder?'), Times.exactly(1));
        });

        it('Should delete the folder if the user has confirmed deletion', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            mocker.dialogServiceMock.setup(x => x.showConfirmationDialogAsync(
                'Delete folder?',
                'Are you sure you want to delete this folder?')).returns(async () => true);

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.folderServiceMock.verify(x => x.deleteFolder(folderToDelete), Times.exactly(1));
        });

        it('Should not delete the folder if the user has not confirmed deletion', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            mocker.dialogServiceMock.setup(x => x.showConfirmationDialogAsync(
                'Delete folder?',
                'Are you sure you want to delete this folder?')).returns(async () => false);

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.folderServiceMock.verify(x => x.deleteFolder(folderToDelete), Times.never());
        });

        it('Should get all folders if the user has confirmed deletion', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            mocker.dialogServiceMock.setup(x => x.showConfirmationDialogAsync(
                'Delete folder?',
                'Are you sure you want to delete this folder?')).returns(async () => true);

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.folderServiceMock.verify(x => x.getFolders(), Times.exactly(1));
        });

        it('Should not get all the folders if the user has not confirmed deletion', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            mocker.dialogServiceMock.setup(x => x.showConfirmationDialogAsync(
                'Delete folder?',
                'Are you sure you want to delete this folder?')).returns(async () => false);

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.folderServiceMock.verify(x => x.getFolders(), Times.never());
        });

        it('Should get the translation for the error dialog if deleting a folder fails', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            mocker.dialogServiceMock.setup(x => x.showConfirmationDialogAsync(
                'Delete folder?',
                'Are you sure you want to delete this folder?')).returns(async () => true);

            mocker.folderServiceMock.setup(x => x.deleteFolder(folderToDelete)).throws(new Error('An error occurred'));

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.translatorServiceMock.verify(x => x.getAsync('ErrorTexts.DeleteFolderError'), Times.exactly(1));
        });

        it('Should show an error dialog if deleting a folder fails', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            mocker.dialogServiceMock.setup(x => x.showConfirmationDialogAsync(
                'Delete folder?',
                'Are you sure you want to delete this folder?')).returns(async () => true);

            mocker.folderServiceMock.setup(x => x.deleteFolder(folderToDelete)).throws(new Error('An error occurred'));

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.dialogServiceMock.verify(x => x.showErrorDialog('Error while deleting folder'), Times.exactly(1));
        });

        it('Should tell indexingService that the folders have changed if deleting a folder succeeds', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            mocker.dialogServiceMock.setup(x => x.showConfirmationDialogAsync(
                'Delete folder?',
                'Are you sure you want to delete this folder?')).returns(async () => true);

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.indexingServiceMock.verify(x => x.foldersHaveChanged = true, Times.exactly(1));
        });

        it('Should not tell indexingService that the folders have changed if deleting a folder fails', async () => {
            // Arrange
            const folderToDelete: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false, folderToDelete);

            mocker.dialogServiceMock.setup(x => x.showConfirmationDialogAsync(
                'Delete folder?',
                'Are you sure you want to delete this folder?')).returns(async () => true);

            mocker.folderServiceMock.setup(x => x.deleteFolder(folderToDelete)).throws(new Error('An error occurred'));

            // Act
            await mocker.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mocker.indexingServiceMock.verify(x => x.foldersHaveChanged = true, Times.never());
        });
    });

    describe('showAllFoldersInCollection', () => {
        it('Should get settings showAllFoldersInCollection', () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            // Act
            const showAllFoldersInCollection = mocker.addFolderComponent.showAllFoldersInCollection;

            // Assert
            mocker.settingsMock.verify(x => x.showAllFoldersInCollection, Times.exactly(1));
        });

        it('Should set settings showAllFoldersInCollection', () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(true);
            mocker.settingsStub.showAllFoldersInCollection = false;

            // Act
            mocker.addFolderComponent.showAllFoldersInCollection = true;

            // Assert
            assert.strictEqual(mocker.settingsStub.showAllFoldersInCollection, true);
        });
    });

    describe('setFolderVisibility', () => {
        it('Should save folder visibility', () => {
            // Arrange
            const folder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(false);

            // Act
            mocker.addFolderComponent.setFolderVisibility(folder);

            // Assert
            mocker.folderServiceMock.verify(x => x.setFolderVisibility(folder), Times.exactly(1));
        });

        it('Should disable showAllFoldersInCollection', () => {
            // Arrange
            const folder: FolderModel = new FolderModel(new Folder('/home/user/Music'));
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(true);

            // Act
            mocker.addFolderComponent.showAllFoldersInCollection = true;
            mocker.addFolderComponent.setFolderVisibility(folder);

            // Assert
            assert.strictEqual(mocker.addFolderComponent.showAllFoldersInCollection, false);
        });

        it('Should set all folders visible if true', () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(true);

            // Act
            mocker.addFolderComponent.showAllFoldersInCollection = true;

            // Assert
            mocker.folderServiceMock.verify(x => x.setAllFoldersVisible(), Times.exactly(1));
        });

        it('Should not set all folders visible if false', () => {
            // Arrange
            const mocker: AddFolderComponentMocker = new AddFolderComponentMocker(true);

            // Act
            mocker.addFolderComponent.showAllFoldersInCollection = false;

            // Assert
            mocker.folderServiceMock.verify(x => x.setAllFoldersVisible(), Times.never());
        });
    });
});
