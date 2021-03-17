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
        settingsStub = { foldersTabActiveFolder: '', foldersTabActiveSubfolder: '' };
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

    describe('saveActiveFolderToSettings', () => {
        it('should clear the active folder in the settings if the given active folder is undefined', () => {
            // Arrange
            settingsStub.foldersTabActiveFolder = '/some/folder';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            foldersPersister.saveActiveFolderToSettings(undefined);

            // Assert
            expect(settingsStub.foldersTabActiveFolder).toEqual('');
        });

        it('should save the active folder to the settings if the given active folder is not undefined', () => {
            // Arrange
            const activeFolder: FolderModel = new FolderModel(new Folder('/some/folder'));

            // Act
            foldersPersister.saveActiveFolderToSettings(activeFolder);

            // Assert
            expect(settingsStub.foldersTabActiveFolder).toEqual('/some/folder');
        });

        it('should clear the active subfolder in the settings if the given active folder is undefined', () => {
            // Arrange
            settingsStub.foldersTabActiveSubfolder = '/some/subfolder';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            foldersPersister.saveActiveFolderToSettings(undefined);

            // Assert
            expect(settingsStub.foldersTabActiveSubfolder).toEqual('');
        });

        it('should not clear the active subfolder in the settings if the given active folder is not undefined', () => {
            // Arrange
            settingsStub.foldersTabActiveSubfolder = '/some/subfolder';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);
            const activeFolder: FolderModel = new FolderModel(new Folder('/some/folder'));

            // Act
            foldersPersister.saveActiveFolderToSettings(activeFolder);

            // Assert
            expect(settingsStub.foldersTabActiveSubfolder).toEqual('/some/subfolder');
        });
    });

    describe('SaveActiveSubfolderToSettings', () => {
        it('should clear the active subfolder in the settings if the given active subfolder is undefined', () => {
            // Arrange
            settingsStub.foldersTabActiveSubfolder = '/some/subfolder';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            foldersPersister.saveActiveSubfolderToSettings(undefined);

            // Assert
            expect(settingsStub.foldersTabActiveSubfolder).toEqual('');
        });

        it('should save the active subfolder to the settings if the given active subfolder is not undefined', () => {
            // Arrange
            const activeSubfolder: SubfolderModel = new SubfolderModel('/some/subfolder', false);

            // Act
            foldersPersister.saveActiveSubfolderToSettings(activeSubfolder);

            // Assert
            expect(settingsStub.foldersTabActiveSubfolder).toEqual('/some/subfolder');
        });
    });

    describe('getActiveFolderFromSettings', () => {
        it('should return undefined if available folders is undefined', () => {
            // Arrange

            // Act
            const activeFolderFromSettings: FolderModel = foldersPersister.getActiveFolderFromSettings(undefined);

            // Assert
            expect(activeFolderFromSettings).toBeUndefined();
        });

        it('should return undefined if there are no available folders', () => {
            // Arrange
            const availableFolders: FolderModel[] = [];

            // Act
            const activeFolderFromSettings: FolderModel = foldersPersister.getActiveFolderFromSettings(availableFolders);

            // Assert
            expect(activeFolderFromSettings).toBeUndefined();
        });

        it('should return the first folder if active folder from settings is undefined', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('Folder1'));
            const folder2: FolderModel = new FolderModel(new Folder('Folder2'));
            const availableFolders: FolderModel[] = [folder1, folder2];
            settingsStub.foldersTabActiveFolder = undefined;
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const activeFolderFromSettings: FolderModel = foldersPersister.getActiveFolderFromSettings(availableFolders);

            // Assert
            expect(activeFolderFromSettings).toEqual(folder1);
        });

        it('should return the first folder if active folder from settings is empty', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('Folder1'));
            const folder2: FolderModel = new FolderModel(new Folder('Folder2'));
            const availableFolders: FolderModel[] = [folder1, folder2];
            settingsStub.foldersTabActiveFolder = '';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const activeFolderFromSettings: FolderModel = foldersPersister.getActiveFolderFromSettings(availableFolders);

            // Assert
            expect(activeFolderFromSettings).toEqual(folder1);
        });

        it('should return the first folder if an active folder is found in the settings which is not included in available folders', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('Folder1'));
            const folder2: FolderModel = new FolderModel(new Folder('Folder2'));
            const availableFolders: FolderModel[] = [folder1, folder2];
            settingsStub.foldersTabActiveFolder = 'Folder3';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const activeFolderFromSettings: FolderModel = foldersPersister.getActiveFolderFromSettings(availableFolders);

            // Assert
            expect(activeFolderFromSettings).toEqual(folder1);
        });

        it('should return the folder from the settings if an active folder is found in the settings which is included in available folders', () => {
            // Arrange
            const folder1: FolderModel = new FolderModel(new Folder('Folder1'));
            const folder2: FolderModel = new FolderModel(new Folder('Folder2'));
            const availableFolders: FolderModel[] = [folder1, folder2];
            settingsStub.foldersTabActiveFolder = 'Folder2';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const activeFolderFromSettings: FolderModel = foldersPersister.getActiveFolderFromSettings(availableFolders);

            // Assert
            expect(activeFolderFromSettings).toEqual(folder2);
        });
    });

    describe('getActiveSubfolderFromSettings', () => {
        it('should return undefined if active folder in settings is undefined', () => {
            // Arrange
            settingsStub.foldersTabActiveFolder = undefined;
            settingsStub.foldersTabActiveSubfolder = 'Subfolder1';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const activeSubfolderFromSettings: SubfolderModel = foldersPersister.getActiveSubfolderFromSettings();

            // Assert
            expect(activeSubfolderFromSettings).toBeUndefined();
        });

        it('should return undefined if active folder in settings is empty', () => {
            // Arrange
            settingsStub.foldersTabActiveFolder = '';
            settingsStub.foldersTabActiveSubfolder = 'Subfolder1';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const activeSubfolderFromSettings: SubfolderModel = foldersPersister.getActiveSubfolderFromSettings();

            // Assert
            expect(activeSubfolderFromSettings).toBeUndefined();
        });

        it('should return undefined if active subfolder in settings is undefined', () => {
            // Arrange
            settingsStub.foldersTabActiveFolder = 'Folder1';
            settingsStub.foldersTabActiveSubfolder = undefined;
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const activeSubfolderFromSettings: SubfolderModel = foldersPersister.getActiveSubfolderFromSettings();

            // Assert
            expect(activeSubfolderFromSettings).toBeUndefined();
        });

        it('should return undefined if active subfolder in settings is empty', () => {
            // Arrange
            settingsStub.foldersTabActiveFolder = 'Folder1';
            settingsStub.foldersTabActiveSubfolder = '';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const activeSubfolderFromSettings: SubfolderModel = foldersPersister.getActiveSubfolderFromSettings();

            // Assert
            expect(activeSubfolderFromSettings).toBeUndefined();
        });

        it('should return undefined if active subfolder in settings is not a child folder of active folder in settings', () => {
            // Arrange
            settingsStub.foldersTabActiveFolder = '/home/user/Music';
            settingsStub.foldersTabActiveSubfolder = '/home/user/Downloads/Music/Subfolder1';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const activeSubfolderFromSettings: SubfolderModel = foldersPersister.getActiveSubfolderFromSettings();

            // Assert
            expect(activeSubfolderFromSettings).toBeUndefined();
        });

        it('should return the subfolder from the settings if active subfolder in settings is a child folder of active folder in settings', () => {
            // Arrange
            settingsStub.foldersTabActiveFolder = '/home/user/Music';
            settingsStub.foldersTabActiveSubfolder = '/home/user/Music/Subfolder1';
            foldersPersister = new FoldersPersister(settingsStub, loggerMock.object);

            // Act
            const activeSubfolderFromSettings: SubfolderModel = foldersPersister.getActiveSubfolderFromSettings();

            // Assert
            expect(activeSubfolderFromSettings.path).toEqual('/home/user/Music/Subfolder1');
        });
    });
});
