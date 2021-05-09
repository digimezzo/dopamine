import { IMock, Mock } from 'typemoq';
import { Logger } from '../../../core/logger';
import { Folder } from '../../../data/entities/folder';
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

    describe('saveOpenedFolderToSettings', () => {
        it('should clear the opened folder in the settings if the given opened folder is undefined', () => {
            // Arrange
            settingsStub.foldersTabOpenedFolder = '/some/folder';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            foldersPersister.saveOpenedFolderToSettings(undefined);

            // Assert
            expect(settingsStub.foldersTabOpenedFolder).toEqual('');
        });

        it('should save the opened folder to the settings if the given opened folder is not undefined', () => {
            // Arrange
            const openedFolder: FolderModel = new FolderModel(new Folder('/some/folder'));

            // Act
            foldersPersister.saveOpenedFolderToSettings(openedFolder);

            // Assert
            expect(settingsStub.foldersTabOpenedFolder).toEqual('/some/folder');
        });

        it('should clear the opened subfolder in the settings if the given opened folder is undefined', () => {
            // Arrange
            settingsStub.foldersTabOpenedSubfolder = '/some/subfolder';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            foldersPersister.saveOpenedFolderToSettings(undefined);

            // Assert
            expect(settingsStub.foldersTabOpenedSubfolder).toEqual('');
        });

        it('should not clear the opened subfolder in the settings if the given opened folder is not undefined', () => {
            // Arrange
            settingsStub.foldersTabOpenedSubfolder = '/some/subfolder';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);
            const openedFolder: FolderModel = new FolderModel(new Folder('/some/folder'));

            // Act
            foldersPersister.saveOpenedFolderToSettings(openedFolder);

            // Assert
            expect(settingsStub.foldersTabOpenedSubfolder).toEqual('/some/subfolder');
        });
    });

    describe('saveOpenedSubfolderToSettings', () => {
        it('should clear the opened subfolder in the settings if the given opened subfolder is undefined', () => {
            // Arrange
            settingsStub.foldersTabOpenedSubfolder = '/some/subfolder';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            foldersPersister.saveOpenedSubfolderToSettings(undefined);

            // Assert
            expect(settingsStub.foldersTabOpenedSubfolder).toEqual('');
        });

        it('should save the opened subfolder to the settings if the given opened subfolder is not undefined', () => {
            // Arrange
            const openedSubfolder: SubfolderModel = new SubfolderModel('/some/subfolder', false);

            // Act
            foldersPersister.saveOpenedSubfolderToSettings(openedSubfolder);

            // Assert
            expect(settingsStub.foldersTabOpenedSubfolder).toEqual('/some/subfolder');
        });
    });

    describe('getOpenedFolderFromSettings', () => {
        it('should return undefined if available folders is undefined', () => {
            // Arrange

            // Act
            const openedFolderFromSettings: FolderModel = foldersPersister.getOpenedFolderFromSettings(undefined);

            // Assert
            expect(openedFolderFromSettings).toBeUndefined();
        });

        it('should return undefined if there are no available folders', () => {
            // Arrange
            const availableFolders: FolderModel[] = [];

            // Act
            const openedFolderFromSettings: FolderModel = foldersPersister.getOpenedFolderFromSettings(availableFolders);

            // Assert
            expect(openedFolderFromSettings).toBeUndefined();
        });

        it('should return the first folder if opened folder from settings is undefined', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('Folder1'));
            const folder2: FolderModel = new FolderModel(new Folder('Folder2'));
            const availableFolders: FolderModel[] = [folder1, folder2];
            settingsStub.foldersTabOpenedFolder = undefined;
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedFolderFromSettings: FolderModel = foldersPersister.getOpenedFolderFromSettings(availableFolders);

            // Assert
            expect(openedFolderFromSettings).toEqual(folder1);
        });

        it('should return the first folder if opened folder from settings is empty', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('Folder1'));
            const folder2: FolderModel = new FolderModel(new Folder('Folder2'));
            const availableFolders: FolderModel[] = [folder1, folder2];
            settingsStub.foldersTabOpenedFolder = '';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedFolderFromSettings: FolderModel = foldersPersister.getOpenedFolderFromSettings(availableFolders);

            // Assert
            expect(openedFolderFromSettings).toEqual(folder1);
        });

        it('should return the first folder if an opened folder is found in the settings which is not included in available folders', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('Folder1'));
            const folder2: FolderModel = new FolderModel(new Folder('Folder2'));
            const availableFolders: FolderModel[] = [folder1, folder2];
            settingsStub.foldersTabOpenedFolder = 'Folder3';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedFolderFromSettings: FolderModel = foldersPersister.getOpenedFolderFromSettings(availableFolders);

            // Assert
            expect(openedFolderFromSettings).toEqual(folder1);
        });

        it('should return the folder from the settings if an opened folder is found in the settings which is included in available folders', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('Folder1'));
            const folder2: FolderModel = new FolderModel(new Folder('Folder2'));
            const availableFolders: FolderModel[] = [folder1, folder2];
            settingsStub.foldersTabOpenedFolder = 'Folder2';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedFolderFromSettings: FolderModel = foldersPersister.getOpenedFolderFromSettings(availableFolders);

            // Assert
            expect(openedFolderFromSettings).toEqual(folder2);
        });
    });

    describe('getOpenedSubfolderFromSettings', () => {
        it('should return undefined if opened folder in settings is undefined', () => {
            // Arrange
            settingsStub.foldersTabOpenedFolder = undefined;
            settingsStub.foldersTabOpenedSubfolder = 'Subfolder1';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedSubfolderFromSettings: SubfolderModel = foldersPersister.getOpenedSubfolderFromSettings();

            // Assert
            expect(openedSubfolderFromSettings).toBeUndefined();
        });

        it('should return undefined if opened folder in settings is empty', () => {
            // Arrange
            settingsStub.foldersTabOpenedFolder = '';
            settingsStub.foldersTabOpenedSubfolder = 'Subfolder1';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedSubfolderFromSettings: SubfolderModel = foldersPersister.getOpenedSubfolderFromSettings();

            // Assert
            expect(openedSubfolderFromSettings).toBeUndefined();
        });

        it('should return undefined if opened subfolder in settings is undefined', () => {
            // Arrange
            settingsStub.foldersTabOpenedFolder = 'Folder1';
            settingsStub.foldersTabOpenedSubfolder = undefined;
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedSubfolderFromSettings: SubfolderModel = foldersPersister.getOpenedSubfolderFromSettings();

            // Assert
            expect(openedSubfolderFromSettings).toBeUndefined();
        });

        it('should return undefined if opened subfolder in settings is empty', () => {
            // Arrange
            settingsStub.foldersTabOpenedFolder = 'Folder1';
            settingsStub.foldersTabOpenedSubfolder = '';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedSubfolderFromSettings: SubfolderModel = foldersPersister.getOpenedSubfolderFromSettings();

            // Assert
            expect(openedSubfolderFromSettings).toBeUndefined();
        });

        it('should return undefined if opened subfolder in settings is not a child folder of opened folder in settings', () => {
            // Arrange
            settingsStub.foldersTabOpenedFolder = '/home/user/Music';
            settingsStub.foldersTabOpenedSubfolder = '/home/user/Downloads/Music/Subfolder1';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedSubfolderFromSettings: SubfolderModel = foldersPersister.getOpenedSubfolderFromSettings();

            // Assert
            expect(openedSubfolderFromSettings).toBeUndefined();
        });

        it('should return the subfolder from the settings if opened subfolder in settings is a child folder of opened folder in settings', () => {
            // Arrange
            settingsStub.foldersTabOpenedFolder = '/home/user/Music';
            settingsStub.foldersTabOpenedSubfolder = '/home/user/Music/Subfolder1';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const openedSubfolderFromSettings: SubfolderModel = foldersPersister.getOpenedSubfolderFromSettings();

            // Assert
            expect(openedSubfolderFromSettings.path).toEqual('/home/user/Music/Subfolder1');
        });
    });
});
