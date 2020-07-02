import * as assert from 'assert';
import * as TypeMoq from 'typemoq';
import { Times, It } from 'typemoq';
import { Desktop } from '../../app/core/desktop';
import { TranslatorServiceBase } from '../../app/services/translator/translator-service-base';
import { AddFolderComponent } from '../../app/components/add-folder/add-folder.component';
import { FolderServiceBase } from '../../app/services/folder/folder-service-base';

describe('AddFolderComponent', () => {
    describe('addFolderAsync', () => {
        it('Should get translated text for the open folder dialog', async () => {
            // Arrange
            const desktopMock = TypeMoq.Mock.ofType<Desktop>();
            const translatorServiceMock = TypeMoq.Mock.ofType<TranslatorServiceBase>();
            const folderServiceMock = TypeMoq.Mock.ofType<FolderServiceBase>();
            const addFolderComponent: AddFolderComponent
                = new AddFolderComponent(desktopMock.object, translatorServiceMock.object, folderServiceMock.object);

            // Act
            await addFolderComponent.addFolderAsync();

            // Assert
            translatorServiceMock.verify(x => x.getAsync('Pages.Welcome.Music.SelectFolder'), Times.exactly(1));
        });

        it('Should allow selecting for a folder on the computer', async () => {
            // Arrange
            const desktopMock = TypeMoq.Mock.ofType<Desktop>();
            const translatorMock = TypeMoq.Mock.ofType<TranslatorServiceBase>();
            const folderServiceMock = TypeMoq.Mock.ofType<FolderServiceBase>();
            const addFolder: AddFolderComponent
                = new AddFolderComponent(desktopMock.object, translatorMock.object, folderServiceMock.object);

            translatorMock.setup(x => x.getAsync('Pages.Welcome.Music.SelectFolder')).returns(async () => 'Select a folder');

            // Act
            await addFolder.addFolderAsync();

            // Assert
            desktopMock.verify(x => x.showSelectFolderDialogAsync('Select a folder'), Times.exactly(1));
        });

        it('Should add a folder with the selected path to the database if the path is not empty', async () => {
            // Arrange
            const desktopMock = TypeMoq.Mock.ofType<Desktop>();
            const translatorMock = TypeMoq.Mock.ofType<TranslatorServiceBase>();
            const folderServiceMock = TypeMoq.Mock.ofType<FolderServiceBase>();
            const addFolderComponent: AddFolderComponent
                = new AddFolderComponent(desktopMock.object, translatorMock.object, folderServiceMock.object);

            translatorMock.setup(x => x.getAsync('Pages.Welcome.Music.SelectFolder')).returns(async () => 'Select a folder');
            desktopMock.setup(x => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '/home/me/Music');

            // Act
            await addFolderComponent.addFolderAsync();

            // Assert
            folderServiceMock.verify(x => x.addNewFolderAsync('/home/me/Music'), Times.exactly(1));
        });

        it('Should not add a folder with the selected path to the database if the path is empty', async () => {
            // Arrange
            const desktopMock = TypeMoq.Mock.ofType<Desktop>();
            const translatorMock = TypeMoq.Mock.ofType<TranslatorServiceBase>();
            const folderServiceMock = TypeMoq.Mock.ofType<FolderServiceBase>();
            const addFolderComponent: AddFolderComponent
                = new AddFolderComponent(desktopMock.object, translatorMock.object, folderServiceMock.object);

            translatorMock.setup(x => x.getAsync('Pages.Welcome.Music.SelectFolder')).returns(async () => 'Select a folder');
            desktopMock.setup(x => x.showSelectFolderDialogAsync('Select a folder')).returns(async () => '');

            // Act
            await addFolderComponent.addFolderAsync();

            // Assert
            folderServiceMock.verify(x => x.addNewFolderAsync(It.isAnyString()), Times.never());
        });

        it('Should provide a list of folders', () => {
            // Arrange
            const desktopMock = TypeMoq.Mock.ofType<Desktop>();
            const translatorMock = TypeMoq.Mock.ofType<TranslatorServiceBase>();
            const folderServiceMock = TypeMoq.Mock.ofType<FolderServiceBase>();
            const addFolderComponent: AddFolderComponent
                = new AddFolderComponent(desktopMock.object, translatorMock.object, folderServiceMock.object);

            // Act
            // Assert
            assert.ok(addFolderComponent.folders);
        });
    });

    describe('getFoldersAsync', () => {
        it('Should get folders from the database', async () => {
            // Arrange
            const desktopMock = TypeMoq.Mock.ofType<Desktop>();
            const translatorMock = TypeMoq.Mock.ofType<TranslatorServiceBase>();
            const folderServiceMock = TypeMoq.Mock.ofType<FolderServiceBase>();
            const addFolderComponent: AddFolderComponent
                = new AddFolderComponent(desktopMock.object, translatorMock.object, folderServiceMock.object);

            // Act
            await addFolderComponent.getFoldersAsync();

            // Assert
            folderServiceMock.verify(x => x.getFoldersAsync(), Times.exactly(1));
        });
    });

    describe('ngOnInit', () => {
        it('Should get folders from the database', async () => {
            // Arrange
            const desktopMock = TypeMoq.Mock.ofType<Desktop>();
            const translatorMock = TypeMoq.Mock.ofType<TranslatorServiceBase>();
            const folderServiceMock = TypeMoq.Mock.ofType<FolderServiceBase>();
            const addFolderComponent: AddFolderComponent
                = new AddFolderComponent(desktopMock.object, translatorMock.object, folderServiceMock.object);

            // Act
            await addFolderComponent.ngOnInit();

            // Assert
            folderServiceMock.verify(x => x.getFoldersAsync(), Times.exactly(1));
        });
    });
});
