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
        settingsStub = { albumsTabSelectedAlbum: '', albumsTabSelectedAlbumOrder: '' };
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

    describe('saveSelectedAlbumToSettings', () => {
        it('should clear the selected album in the settings if the given selected album is undefined', () => {
            // Arrange
            settingsStub.albumsTabSelectedAlbum = 'someAlbumKey';
            albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

            // Act
            albumsPersister.saveSelectedAlbumToSettings(undefined);

            // Assert
            expect(settingsStub.albumsTabSelectedAlbum).toEqual('');
        });

        it('should save the selected album to the settings if the given selected album is not undefined', () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const albumData: AlbumData = new AlbumData();
            albumData.albumKey = 'someAlbumKey';
            const selectedAlbum: AlbumModel = new AlbumModel(albumData, translatorServiceMock.object);

            // Act
            albumsPersister.saveSelectedAlbumToSettings(selectedAlbum);

            // Assert
            expect(settingsStub.albumsTabSelectedAlbum).toEqual('someAlbumKey');
        });
    });

    describe('getSelectedAlbumFromSettings', () => {
        it('should return undefined if available albums is undefined', () => {
            // Arrange

            // Act
            const selectedAlbumFromSettings: AlbumModel = albumsPersister.getSelectedAlbumFromSettings(undefined);

            // Assert
            expect(selectedAlbumFromSettings).toBeUndefined();
        });

        it('should return undefined if there are no available albums', () => {
            // Arrange
            const availableAlbums: AlbumModel[] = [];

            // Act
            const selectedAlbumFromSettings: AlbumModel = albumsPersister.getSelectedAlbumFromSettings(availableAlbums);

            // Assert
            expect(selectedAlbumFromSettings).toBeUndefined();
        });

        it('should return the first album if selected album from settings is undefined', () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'albumKey1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'albumKey2';
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const availableAlbums: AlbumModel[] = [album1, album2];
            settingsStub.albumsTabSelectedAlbum = undefined;
            albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

            // Act
            const selectedAlbumFromSettings: AlbumModel = albumsPersister.getSelectedAlbumFromSettings(availableAlbums);

            // Assert
            expect(selectedAlbumFromSettings).toEqual(album1);
        });

        it('should return the first album if selected album from settings is empty', () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'albumKey1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'albumKey2';
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const availableAlbums: AlbumModel[] = [album1, album2];
            settingsStub.albumsTabSelectedAlbum = '';
            albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

            // Act
            const selectedAlbumFromSettings: AlbumModel = albumsPersister.getSelectedAlbumFromSettings(availableAlbums);

            // Assert
            expect(selectedAlbumFromSettings).toEqual(album1);
        });

        it('should return the first album if an selected album is found in the settings which is not included in available albums', () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'albumKey1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'albumKey2';
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const availableAlbums: AlbumModel[] = [album1, album2];
            settingsStub.albumsTabSelectedAlbum = 'albumKey3';
            albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

            // Act
            const selectedAlbumFromSettings: AlbumModel = albumsPersister.getSelectedAlbumFromSettings(availableAlbums);

            // Assert
            expect(selectedAlbumFromSettings).toEqual(album1);
        });

        it('should return the album from the settings if an selected album is found in the settings which is included in available albums', () => {
            // Arrange
            const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
            const albumData1: AlbumData = new AlbumData();
            albumData1.albumKey = 'albumKey1';
            const albumData2: AlbumData = new AlbumData();
            albumData2.albumKey = 'albumKey2';
            const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
            const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
            const availableAlbums: AlbumModel[] = [album1, album2];
            settingsStub.albumsTabSelectedAlbum = 'albumKey2';
            albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

            // Act
            const selectedAlbumFromSettings: AlbumModel = albumsPersister.getSelectedAlbumFromSettings(availableAlbums);

            // Assert
            expect(selectedAlbumFromSettings).toEqual(album2);
        });
    });

    describe('saveSelectedAlbumOrderToSettings', () => {
        it('should save the selected album order to the settings', () => {
            // Arrange
            settingsStub.albumsTabSelectedAlbumOrder = 'byAlbumTitleAscending';

            // Act
            albumsPersister.saveSelectedAlbumOrderToSettings(AlbumOrder.byLastPlayed);

            // Assert
            expect(settingsStub.albumsTabSelectedAlbumOrder).toEqual('byLastPlayed');
        });
    });

    describe('getSelectedAlbumOrderFromSettings', () => {
        it('should return byAlbumTitleAscending if no selected album order is found in the settings', () => {
            // Arrange
            settingsStub.albumsTabSelectedAlbumOrder = undefined;

            // Act
            const selectedAlbumOrderFromSettings: AlbumOrder = albumsPersister.getSelectedAlbumOrderFromSettings();

            // Assert
            expect(selectedAlbumOrderFromSettings).toEqual(AlbumOrder.byAlbumTitleAscending);
        });

        it('should return the selected album order from the settings if an selected album order is found in the settings', () => {
            // Arrange
            settingsStub.albumsTabSelectedAlbumOrder = 'byYearAscending';

            // Act
            const selectedAlbumOrderFromSettings: AlbumOrder = albumsPersister.getSelectedAlbumOrderFromSettings();

            // Assert
            expect(selectedAlbumOrderFromSettings).toEqual(AlbumOrder.byYearAscending);
        });
    });
});
