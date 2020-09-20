import * as assert from 'assert';
import { It, Times } from 'typemoq';
import { Folder } from '../app/data/entities/folder';
import { AddFolderComponentMock } from './mocking/add-folder-component-mock';

describe('AddFolderComponent', () => {
    describe('constructor', () => {
        it('Should provide a list of folders', () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            // Act
            // Assert
            assert.ok(mock.addFolderComponent.folders);
        });
    });
    describe('addFolderAsync', () => {
        it('Should get translated text for the open folder dialog', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            // Act
            await mock.addFolderComponent.addFolderAsync();

            // Assert
            mock.translatorServiceMock.verify(x => x.getAsync('Pages.Welcome.Music.SelectFolder'), Times.exactly(1));
        });

        it('Should allow selecting for a folder on the computer', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            mock.translatorServiceMock.setup(x => x.getAsync('Pages.Welcome.Music.SelectFolder')).returns(async () => 'Select a folder');

            // Act
            await mock.addFolderComponent.addFolderAsync();

            // Assert
            mock.desktopMock.verify(x => x.showSelectFolderDialogAsync('Select a folder'), Times.exactly(1));
        });

        it('Should add a folder with the selected path to the database if the path is not empty', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            mock.translatorServiceMock.setup(x => x.getAsync('Pages.Welcome.Music.SelectFolder')).returns(async () => 'Select a folder');
            mock.desktopMock.setup(x => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/me/Music');

            // Act
            await mock.addFolderComponent.addFolderAsync();

            // Assert
            mock.folderServiceMock.verify(x => x.addNewFolderAsync('/home/me/Music'), Times.exactly(1));
        });

        it('Should not add a folder with the selected path to the database if the path is empty', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            mock.translatorServiceMock.setup(x => x.getAsync('Pages.Welcome.Music.SelectFolder')).returns(async () => 'Select a folder');
            mock.desktopMock.setup(x => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '');

            // Act
            await mock.addFolderComponent.addFolderAsync();

            // Assert
            mock.folderServiceMock.verify(x => x.addNewFolderAsync(It.isAnyString()), Times.never());
        });

        it('Should get all folders from the database if adding a folder succeeds', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            mock.translatorServiceMock.setup(x => x.getAsync('Pages.Welcome.Music.SelectFolder')).returns(async () => 'Select a folder');
            mock.desktopMock.setup(x => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');

            // Act
            await mock.addFolderComponent.addFolderAsync();

            // Assert
            mock.folderServiceMock.verify(x => x.getFolders(), Times.exactly(1));
        });

        it('Should not get all folders from the database if adding a folder fails', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            mock.translatorServiceMock.setup(x => x.getAsync('Pages.Welcome.Music.SelectFolder')).returns(async () => 'Select a folder');
            mock.desktopMock.setup(x => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');
            mock.folderServiceMock.setup(x => x.addNewFolderAsync('/home/user/music')).throws(new Error('An error occurred'));

            // Act
            await mock.addFolderComponent.addFolderAsync();

            // Assert
            mock.folderServiceMock.verify(x => x.getFolders(), Times.never());
        });

        it('Should get the translation for the error dialog if adding a folder fails', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            mock.translatorServiceMock.setup(x => x.getAsync('Pages.Welcome.Music.SelectFolder')).returns(async () => 'Select a folder');
            mock.desktopMock.setup(x => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');
            mock.folderServiceMock.setup(x => x.addNewFolderAsync('/home/user/music')).throws(new Error('An error occurred'));

            // Act
            await mock.addFolderComponent.addFolderAsync();

            // Assert
            mock.translatorServiceMock.verify(x => x.getAsync('ErrorTexts.AddFolderError'), Times.exactly(1));
        });

        it('Should show an error dialog if adding a folder fails', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            mock.translatorServiceMock.setup(x => x.getAsync('Pages.Welcome.Music.SelectFolder')).returns(async () => 'Select a folder');
            mock.translatorServiceMock.setup(x => x.getAsync('ErrorTexts.AddFolderError')).returns(async () => 'Error while adding folder');
            mock.desktopMock.setup(x => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/user/music');
            mock.folderServiceMock.setup(x => x.addNewFolderAsync('/home/user/music')).throws(new Error('An error occurred'));

            // Act
            await mock.addFolderComponent.addFolderAsync();

            // Assert
            mock.dialogServiceMock.verify(x => x.showErrorDialog('Error while adding folder'), Times.exactly(1));
        });
    });

    describe('getFoldersAsync', () => {
        it('Should get folders from the database', () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            // Act
            mock.addFolderComponent.getFolders();

            // Assert
            mock.folderServiceMock.verify(x => x.getFolders(), Times.exactly(1));
        });
    });

    describe('ngOnInit', () => {
        it('Should get folders from the database', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            // Act
            await mock.addFolderComponent.ngOnInit();

            // Assert
            mock.folderServiceMock.verify(x => x.getFolders(), Times.exactly(1));
        });
    });

    describe('deleteFolderAsync', () => {
        it('Should get translated text for the delete folder confirmation dialog title', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            const folderToDelete: Folder = new Folder('/home/user/Music');

            // Act
            await mock.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mock.translatorServiceMock.verify(x => x.getAsync('DialogTitles.ConfirmDeleteFolder'), Times.exactly(1));
        });

        it('Should get translated text for the delete folder confirmation dialog text', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            const folderToDelete: Folder = new Folder('/home/user/Music');

            // Act
            await mock.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mock.translatorServiceMock.verify(x => x.getAsync(
                'DialogTexts.ConfirmDeleteFolder',
                { folderPath: folderToDelete.path }), Times.exactly(1));
        });

        it('Should show a confirmation dialog', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            const folderToDelete: Folder = new Folder('/home/user/Music');

            mock.translatorServiceMock.setup(x => x.getAsync('DialogTitles.ConfirmDeleteFolder')).returns(async () => 'Delete folder?');
            mock.translatorServiceMock.setup(x => x.getAsync(
                'DialogTexts.ConfirmDeleteFolder',
                { folderPath: folderToDelete.path })).returns(async () => 'Are you sure you want to delete this folder?');

            // Act
            await mock.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mock.dialogServiceMock.verify(x => x.showConfirmationDialogAsync(
                'Delete folder?',
                'Are you sure you want to delete this folder?'), Times.exactly(1));
        });

        it('Should delete the folder if the user has confirmed deletion', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            const folderToDelete: Folder = new Folder('/home/user/Music');

            mock.translatorServiceMock.setup(x => x.getAsync('DialogTitles.ConfirmDeleteFolder')).returns(async () => 'Delete folder?');
            mock.translatorServiceMock.setup(x => x.getAsync(
                'DialogTexts.ConfirmDeleteFolder',
                { folderPath: folderToDelete.path })).returns(async () => 'Are you sure you want to delete this folder?');

            mock.dialogServiceMock.setup(x => x.showConfirmationDialogAsync(
                'Delete folder?',
                'Are you sure you want to delete this folder?')).returns(async () => true);

            // Act
            await mock.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mock.folderServiceMock.verify(x => x.deleteFolder(folderToDelete), Times.exactly(1));
        });

        it('Should not delete the folder if the user has not confirmed deletion', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            const folderToDelete: Folder = new Folder('/home/user/Music');

            mock.translatorServiceMock.setup(x => x.getAsync('DialogTitles.ConfirmDeleteFolder')).returns(async () => 'Delete folder?');
            mock.translatorServiceMock.setup(x => x.getAsync(
                'DialogTexts.ConfirmDeleteFolder',
                { folderPath: folderToDelete.path })).returns(async () => 'Are you sure you want to delete this folder?');

            mock.dialogServiceMock.setup(x => x.showConfirmationDialogAsync(
                'Delete folder?',
                'Are you sure you want to delete this folder?')).returns(async () => false);

            // Act
            await mock.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mock.folderServiceMock.verify(x => x.deleteFolder(folderToDelete), Times.never());
        });

        it('Should get all folders if the user has confirmed deletion', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            const folderToDelete: Folder = new Folder('/home/user/Music');

            mock.translatorServiceMock.setup(x => x.getAsync('DialogTitles.ConfirmDeleteFolder')).returns(async () => 'Delete folder?');
            mock.translatorServiceMock.setup(x => x.getAsync(
                'DialogTexts.ConfirmDeleteFolder',
                { folderPath: folderToDelete.path })).returns(async () => 'Are you sure you want to delete this folder?');

            mock.dialogServiceMock.setup(x => x.showConfirmationDialogAsync(
                'Delete folder?',
                'Are you sure you want to delete this folder?')).returns(async () => true);

            // Act
            await mock.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mock.folderServiceMock.verify(x => x.getFolders(), Times.exactly(1));
        });

        it('Should not get all the folders if the user has not confirmed deletion', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            const folderToDelete: Folder = new Folder('/home/user/Music');

            mock.translatorServiceMock.setup(x => x.getAsync('DialogTitles.ConfirmDeleteFolder')).returns(async () => 'Delete folder?');
            mock.translatorServiceMock.setup(x => x.getAsync(
                'DialogTexts.ConfirmDeleteFolder',
                { folderPath: folderToDelete.path })).returns(async () => 'Are you sure you want to delete this folder?');

            mock.dialogServiceMock.setup(x => x.showConfirmationDialogAsync(
                'Delete folder?',
                'Are you sure you want to delete this folder?')).returns(async () => false);

            // Act
            await mock.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mock.folderServiceMock.verify(x => x.getFolders(), Times.never());
        });

        it('Should get the translation for the error dialog if deleting a folder fails', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            const folderToDelete: Folder = new Folder('/home/user/Music');

            mock.translatorServiceMock.setup(x => x.getAsync('DialogTitles.ConfirmDeleteFolder')).returns(async () => 'Delete folder?');
            mock.translatorServiceMock.setup(x => x.getAsync(
                'DialogTexts.ConfirmDeleteFolder',
                { folderPath: folderToDelete.path })).returns(async () => 'Are you sure you want to delete this folder?');

            mock.dialogServiceMock.setup(x => x.showConfirmationDialogAsync(
                'Delete folder?',
                'Are you sure you want to delete this folder?')).returns(async () => true);

            mock.folderServiceMock.setup(x => x.deleteFolder(folderToDelete)).throws(new Error('An error occurred'));

            // Act
            await mock.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mock.translatorServiceMock.verify(x => x.getAsync('ErrorTexts.DeleteFolderError'), Times.exactly(1));
        });

        it('Should show an error dialog if deleting a folder fails', async () => {
            // Arrange
            const mock: AddFolderComponentMock = new AddFolderComponentMock();

            const folderToDelete: Folder = new Folder('/home/user/Music');

            mock.translatorServiceMock.setup(x => x.getAsync('DialogTitles.ConfirmDeleteFolder')).returns(async () => 'Delete folder?');
            mock.translatorServiceMock.setup(x => x.getAsync(
                'ErrorTexts.DeleteFolderError')).returns(async () => 'Error while deleting folder');
            mock.translatorServiceMock.setup(x => x.getAsync(
                'DialogTexts.ConfirmDeleteFolder',
                { folderPath: folderToDelete.path })).returns(async () => 'Are you sure you want to delete this folder?');

            mock.dialogServiceMock.setup(x => x.showConfirmationDialogAsync(
                'Delete folder?',
                'Are you sure you want to delete this folder?')).returns(async () => true);

            mock.folderServiceMock.setup(x => x.deleteFolder(folderToDelete)).throws(new Error('An error occurred'));

            // Act
            await mock.addFolderComponent.deleteFolderAsync(folderToDelete);

            // Assert
            mock.dialogServiceMock.verify(x => x.showErrorDialog('Error while deleting folder'), Times.exactly(1));
        });
    });
});
