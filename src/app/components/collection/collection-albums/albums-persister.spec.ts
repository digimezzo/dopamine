import { IMock, Mock } from 'typemoq';
import { Logger } from '../../../core/logger';
import { AlbumData } from '../../../data/album-data';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AlbumOrder } from '../album-order';
import { AlbumsPersister } from './albums-persister';

describe('AlbumsPersister', () => {
    let settingsStub: any;
    let loggerMock: IMock<Logger>;

    let albumsPersister: AlbumsPersister;

    beforeEach(() => {
        settingsStub = { albumsTabActiveAlbum: '', albumsTabActiveAlbumOrder: '' };
        loggerMock = Mock.ofType<Logger>();

        albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(albumsPersister).toBeDefined();
        });
    });

    describe('saveActiveAlbumToSettings', () => {
        it('should clear the active album in the settings if the given active album is undefined', () => {
            // Arrange
            settingsStub.albumsTabActiveAlbum = 'someAlbumKey';
            albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

            // Act
            albumsPersister.saveActiveAlbumToSettings(undefined);

            // Assert
            expect(settingsStub.albumsTabActiveAlbum).toEqual('');
        });

        it('should save the active album to the settings if the given active album is not undefined', () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const albumData: AlbumData = new AlbumData();
            albumData.albumKey = 'someAlbumKey';
            const activeAlbum: AlbumModel = new AlbumModel(albumData, translatorServiceMock.object);

            // Act
            albumsPersister.saveActiveAlbumToSettings(activeAlbum);

            // Assert
            expect(settingsStub.albumsTabActiveAlbum).toEqual('someAlbumKey');
        });
    });

    describe('getActiveAlbumFromSettings', () => {
        it('should return undefined if available albums is undefined', () => {
            // Arrange

            // Act
            const activeAlbumFromSettings: AlbumModel = albumsPersister.getActiveAlbumFromSettings(undefined);

            // Assert
            expect(activeAlbumFromSettings).toBeUndefined();
        });

        it('should return undefined if there are no available albums', () => {
            // Arrange
            const availableAlbums: AlbumModel[] = [];

            // Act
            const activeAlbumFromSettings: AlbumModel = albumsPersister.getActiveAlbumFromSettings(availableAlbums);

            // Assert
            expect(activeAlbumFromSettings).toBeUndefined();
        });

        it('should return the first album if active album from settings is undefined', () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'albumKey1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'albumKey2';
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const availableAlbums: AlbumModel[] = [album1, album2];
            settingsStub.albumsTabActiveAlbum = undefined;
            albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

            // Act
            const activeAlbumFromSettings: AlbumModel = albumsPersister.getActiveAlbumFromSettings(availableAlbums);

            // Assert
            expect(activeAlbumFromSettings).toEqual(album1);
        });

        it('should return the first album if active album from settings is empty', () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'albumKey1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'albumKey2';
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const availableAlbums: AlbumModel[] = [album1, album2];
            settingsStub.albumsTabActiveAlbum = '';
            albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

            // Act
            const activeAlbumFromSettings: AlbumModel = albumsPersister.getActiveAlbumFromSettings(availableAlbums);

            // Assert
            expect(activeAlbumFromSettings).toEqual(album1);
        });

        it('should return the first album if an active album is found in the settings which is not included in available albums', () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'albumKey1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'albumKey2';
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const availableAlbums: AlbumModel[] = [album1, album2];
            settingsStub.albumsTabActiveAlbum = 'albumKey3';
            albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

            // Act
            const activeAlbumFromSettings: AlbumModel = albumsPersister.getActiveAlbumFromSettings(availableAlbums);

            // Assert
            expect(activeAlbumFromSettings).toEqual(album1);
        });

        it('should return the album from the settings if an active album is found in the settings which is included in available albums', () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'albumKey1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'albumKey2';
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const availableAlbums: AlbumModel[] = [album1, album2];
            settingsStub.albumsTabActiveAlbum = 'albumKey2';
            albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

            // Act
            const activeAlbumFromSettings: AlbumModel = albumsPersister.getActiveAlbumFromSettings(availableAlbums);

            // Assert
            expect(activeAlbumFromSettings).toEqual(album2);
        });
    });

    describe('saveActiveAlbumOrderToSettings', () => {
        it('should save the active album order to the settings', () => {
            // Arrange
            settingsStub.albumsTabActiveAlbumOrder = 'byAlbumTitleAscending';

            // Act
            albumsPersister.saveActiveAlbumOrderToSettings(AlbumOrder.byLastPlayed);

            // Assert
            expect(settingsStub.albumsTabActiveAlbumOrder).toEqual('byLastPlayed');
        });
    });

    describe('getActiveAlbumOrderFromSettings', () => {
        it('should return byAlbumTitleAscending if no active album order is found in the settings', () => {
            // Arrange
            settingsStub.albumsTabActiveAlbumOrder = undefined;

            // Act
            const activeAlbumOrderFromSettings: AlbumOrder = albumsPersister.getActiveAlbumOrderFromSettings();

            // Assert
            expect(activeAlbumOrderFromSettings).toEqual(AlbumOrder.byAlbumTitleAscending);
        });

        it('should return the active album order from the settings if an active album order is found in the settings', () => {
            // Arrange
            settingsStub.albumsTabActiveAlbumOrder = 'byYearAscending';

            // Act
            const activeAlbumOrderFromSettings: AlbumOrder = albumsPersister.getActiveAlbumOrderFromSettings();

            // Assert
            expect(activeAlbumOrderFromSettings).toEqual(AlbumOrder.byYearAscending);
        });
    });
});
