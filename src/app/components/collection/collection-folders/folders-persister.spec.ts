import { IMock, Mock } from 'typemoq';
import { Folder } from '../../../common/data/entities/folder';
import { Logger } from '../../../common/logger';
import { FolderModel } from '../../../services/folder/folder-model';
import { SubfolderModel } from '../../../services/folder/subfolder-model';
import { FoldersPersister } from './folders-persister';

describe('FoldersPersister', () => {
    let settingsStub: any;
    let loggerMock: IMock<Logger>;

    let foldersPersister: FoldersPersister;

    beforeEach(() => {
        settingsStub = { foldersTabOpenedFolder: '', foldersTabOpenedSubfolder: '' };
        loggerMock = Mock.ofType<Logger>();

        foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(foldersPersister).toBeDefined();
        });
    });

    describe('getOpenedFolder', () => {
        it('should return undefined given that the provided list of available folders is undefined', () => {
            // Arrange
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedFolder: FolderModel = foldersPersister.getOpenedFolder(undefined);

            // Assert
            expect(openedFolder).toBeUndefined();
        });

        it('should return undefined given that the provided list of available folders is empty', () => {
            // Arrange
            const availableFolders: FolderModel[] = [];
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedFolder: FolderModel = foldersPersister.getOpenedFolder(availableFolders);

            // Assert
            expect(openedFolder).toBeUndefined();
        });

        it('should return the first folder of the provided list of available folders given that there is no saved opened folder', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/some/folder'));
            const availableFolders: FolderModel[] = [folder1];

            settingsStub.foldersTabOpenedFolder = '';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedFolder: FolderModel = foldersPersister.getOpenedFolder(availableFolders);

            // Assert
            expect(openedFolder).toBe(availableFolders[0]);
        });

        it('should return the first folder of the provided list of available folders given that the saved opened folder is not found in the provided list of available folders', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/some/folder'));
            const folder2: FolderModel = new FolderModel(new Folder('/some/other/folder'));
            const availableFolders: FolderModel[] = [folder1, folder2];

            settingsStub.foldersTabOpenedFolder = '/some/unknown/folder';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedFolder: FolderModel = foldersPersister.getOpenedFolder(availableFolders);

            // Assert
            expect(openedFolder).toBe(availableFolders[0]);
        });

        it('should return the opened folder given that the saved opened folder is found in the provided list of available folders', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/some/folder'));
            const folder2: FolderModel = new FolderModel(new Folder('/some/other/folder'));
            const availableFolders: FolderModel[] = [folder1, folder2];

            settingsStub.foldersTabOpenedFolder = '/some/folder';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedFolder: FolderModel = foldersPersister.getOpenedFolder(availableFolders);

            // Assert
            expect(openedFolder).toBe(folder1);
        });
    });

    describe('setOpenedFolder', () => {
        it('should set an undefined opened folder given that the opened folder is undefined', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/some/folder'));
            const folder2: FolderModel = new FolderModel(new Folder('/some/other/folder'));

            settingsStub.foldersTabOpenedFolder = '';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            foldersPersister.setOpenedFolder(undefined);

            // Assert
            expect(foldersPersister.getOpenedFolder(undefined)).toBeUndefined();
        });

        it('should set an empty opened folder in the settings given that the opened folder is undefined', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/some/folder'));
            const folder2: FolderModel = new FolderModel(new Folder('/some/other/folder'));

            settingsStub.foldersTabOpenedFolder = '';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            foldersPersister.setOpenedFolder(undefined);

            // Assert
            expect(settingsStub.foldersTabOpenedFolder).toEqual('');
        });

        it('should set the opened folder given that the opened folder is not undefined', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/some/folder'));
            const folder2: FolderModel = new FolderModel(new Folder('/some/other/folder'));
            const availableFolders: FolderModel[] = [folder1, folder2];

            settingsStub.foldersTabOpenedFolder = '';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            foldersPersister.setOpenedFolder(folder1);

            // Assert
            expect(foldersPersister.getOpenedFolder(availableFolders)).toBe(folder1);
        });

        it('should set the opened folder in the settings given that the opened folder is not undefined', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/some/folder'));
            const folder2: FolderModel = new FolderModel(new Folder('/some/other/folder'));

            settingsStub.foldersTabOpenedFolder = '';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            foldersPersister.setOpenedFolder(folder1);

            // Assert
            expect(settingsStub.foldersTabOpenedFolder).toEqual(folder1.path);
        });

        it('should clear the opened subfolder in the settings given that the opened folder is undefined', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/some/folder'));
            const folder2: FolderModel = new FolderModel(new Folder('/some/other/folder'));

            settingsStub.foldersTabOpenedSubfolder = '/some/folder/subfolder';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            foldersPersister.setOpenedFolder(undefined);

            // Assert
            expect(settingsStub.foldersTabOpenedSubfolder).toEqual('');
        });

        it('should not clear the opened subfolder in the settings given that the opened folder is not undefined', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/some/folder'));
            const folder2: FolderModel = new FolderModel(new Folder('/some/other/folder'));

            settingsStub.foldersTabOpenedSubfolder = '/some/folder/subfolder';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            foldersPersister.setOpenedFolder(folder1);

            // Assert
            expect(settingsStub.foldersTabOpenedSubfolder).toEqual('/some/folder/subfolder');
        });
    });

    describe('getOpenedSubfolder', () => {
        it('should return undefined given that the opened folder is undefined', () => {
            // Arrange
            settingsStub.foldersTabOpenedFolder = '';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedSubfolder: SubfolderModel = foldersPersister.getOpenedSubfolder();

            // Assert
            expect(openedSubfolder).toBeUndefined();
        });

        it('should return undefined given that the opened folder is not undefined but the opened subfolder is undefined', () => {
            // Arrange
            settingsStub.foldersTabOpenedFolder = '/some/folder';
            settingsStub.foldersTabOpenedSubfolder = '';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedSubfolder: SubfolderModel = foldersPersister.getOpenedSubfolder();

            // Assert
            expect(openedSubfolder).toBeUndefined();
        });

        it('should return undefined given that the opened subfolder is not a child folder of the opened folder', () => {
            // Arrange
            settingsStub.foldersTabOpenedFolder = '/some/folder';
            settingsStub.foldersTabOpenedSubfolder = '/some/not/folder/subfolder';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedSubfolder: SubfolderModel = foldersPersister.getOpenedSubfolder();

            // Assert
            expect(openedSubfolder).toBeUndefined();
        });

        it('should return the opened subfolder given that the opened subfolder is a child folder of the opened folder', () => {
            // Arrange
            settingsStub.foldersTabOpenedFolder = '/some/folder';
            settingsStub.foldersTabOpenedSubfolder = '/some/folder/subfolder';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedSubfolder: SubfolderModel = foldersPersister.getOpenedSubfolder();

            // Assert
            expect(openedSubfolder.path).toEqual('/some/folder/subfolder');
        });
    });

    describe('setOpenedSubfolder', () => {
        it('should set an undefined opened subfolder given that the opened subfolder is undefined', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/some/folder'));
            const folder2: FolderModel = new FolderModel(new Folder('/some/other/folder'));
            const availableFolders: FolderModel[] = [folder1, folder2];

            settingsStub.foldersTabOpenedFolder = '/some/folder';
            settingsStub.foldersTabOpenedSubfolder = '/some/folder/subfolder';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            foldersPersister.setOpenedSubfolder(undefined);

            // Assert
            expect(foldersPersister.getOpenedSubfolder()).toBe(undefined);
        });

        it('should set an empty opened subfolder in the settings given that the opened subfolder is undefined', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('/some/folder'));
            const folder2: FolderModel = new FolderModel(new Folder('/some/other/folder'));

            settingsStub.foldersTabOpenedFolder = '/some/folder';
            settingsStub.foldersTabOpenedSubfolder = '/some/folder/subfolder';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            foldersPersister.setOpenedSubfolder(undefined);

            // Assert
            expect(settingsStub.foldersTabOpenedSubfolder).toEqual('');
        });

        it('should set the opened subfolder given that the opened subfolder is not undefined', () => {
            // Arrange
            const subfolder: SubfolderModel = new SubfolderModel('/some/folder/subfolder', false);

            settingsStub.foldersTabOpenedFolder = '/some/folder';
            settingsStub.foldersTabOpenedSubfolder = '';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            foldersPersister.setOpenedSubfolder(subfolder);

            // Assert
            expect(foldersPersister.getOpenedSubfolder().path).toEqual(subfolder.path);
        });

        it('should set the opened subfolder in the settings given that the opened subfolder is not undefined', () => {
            // Arrange
            const subfolder: SubfolderModel = new SubfolderModel('/some/folder/subfolder', false);

            settingsStub.foldersTabOpenedFolder = '/some/folder';
            settingsStub.foldersTabOpenedSubfolder = '';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            foldersPersister.setOpenedSubfolder(subfolder);

            // Assert
            expect(settingsStub.foldersTabOpenedSubfolder).toEqual(subfolder.path);
        });
    });
});
