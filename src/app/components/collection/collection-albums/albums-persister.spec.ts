// import { IMock, Mock } from 'typemoq';
// import { Logger } from '../../../core/logger';
// import { AlbumData } from '../../../data/album-data';
// import { AlbumModel } from '../../../services/album/album-model';
// import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
// import { AlbumOrder } from '../album-order';
// import { AlbumsPersister } from './albums-persister';

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
    let translatorServiceMock: IMock<BaseTranslatorService>;

    let albumsPersister: AlbumsPersister;

    let albumData1: AlbumData;
    let albumData2: AlbumData;
    let albumData3: AlbumData;
    let album1: AlbumModel;
    let album2: AlbumModel;
    let album3: AlbumModel;
    let availableAlbums: AlbumModel[];

    beforeEach(() => {
        settingsStub = { albumsTabSelectedAlbum: '', albumsTabSelectedAlbumOrder: '' };
        loggerMock = Mock.ofType<Logger>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        albumData1 = new AlbumData();
        albumData1.albumKey = 'albumKey1';
        albumData2 = new AlbumData();
        albumData2.albumKey = 'albumKey2';
        albumData3 = new AlbumData();
        albumData3.albumKey = 'albumKey3';
        album1 = new AlbumModel(albumData1, translatorServiceMock.object);
        album2 = new AlbumModel(albumData2, translatorServiceMock.object);
        album3 = new AlbumModel(albumData3, translatorServiceMock.object);
        availableAlbums = [album1, album2];

        albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(albumsPersister).toBeDefined();
        });

        it('should initialize from the settings', () => {
            // Arrange
            settingsStub.albumsTabSelectedAlbum = 'albumKey1';
            settingsStub.albumsTabSelectedAlbumOrder = 'byYearDescending';
            albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

            // Act

            // Assert
            expect(albumsPersister.getSelectedAlbums(availableAlbums).length).toEqual(1);
            expect(albumsPersister.getSelectedAlbums(availableAlbums)[0]).toBe(album1);
            expect(albumsPersister.getSelectedAlbumOrder()).toEqual(AlbumOrder.byYearDescending);
        });
    });

    describe('getSelectedAlbumFromSettings', () => {
        it('should get the selected album from the settings', () => {
            // Arrange
            settingsStub.albumsTabSelectedAlbum = 'someAlbumKey';
            albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

            // Act
            const selectedAlbumFromSettings: string = albumsPersister.getSelectedAlbumFromSettings();

            // Assert
            expect(selectedAlbumFromSettings).toEqual('someAlbumKey');
        });
    });

    describe('saveSelectedAlbumToSettings', () => {
        it('should save the selected album to the settings', () => {
            // Arrange
            settingsStub.albumsTabSelectedAlbum = '';
            albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

            // Act
            albumsPersister.saveSelectedAlbumToSettings('someAlbumKey');

            // Assert
            expect(settingsStub.albumsTabSelectedAlbum).toEqual('someAlbumKey');
        });
    });

    describe('getSelectedAlbumOrderFromSettings', () => {
        it('should get the selected album order from the settings', () => {
            // Arrange
            settingsStub.albumsTabSelectedAlbumOrder = 'byYearDescending';
            albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

            // Act
            const selectedAlbumOrderFromSettings: string = albumsPersister.getSelectedAlbumOrderFromSettings();

            // Assert
            expect(selectedAlbumOrderFromSettings).toEqual('byYearDescending');
        });
    });

    describe('saveSelectedAlbumOrderToSettings', () => {
        it('should save the selected album to the settings', () => {
            // Arrange
            settingsStub.albumsTabSelectedAlbumOrder = '';
            albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

            // Act
            albumsPersister.saveSelectedAlbumOrderToSettings('byYearDescending');

            // Assert
            expect(settingsStub.albumsTabSelectedAlbumOrder).toEqual('byYearDescending');
        });
    });

    describe('getSelectedAlbums', () => {
        it('should return an empty collection given that availableAlbums is undefined', () => {
            // Arrange

            // Act
            const selectedAlbums: AlbumModel[] = albumsPersister.getSelectedAlbums(undefined);

            // Assert
            expect(selectedAlbums.length).toEqual(0);
        });

        it('should return an empty collection given that availableAlbums is empty', () => {
            // Arrange

            // Act
            const selectedAlbums: AlbumModel[] = albumsPersister.getSelectedAlbums([]);

            // Assert
            expect(selectedAlbums.length).toEqual(0);
        });

        it('should return the selected album given valid availableAlbums', () => {
            // Arrange
            albumsPersister.setSelectedAlbums([album1, album2]);

            // Act
            const selectedAlbums: AlbumModel[] = albumsPersister.getSelectedAlbums(availableAlbums);

            // Assert
            expect(selectedAlbums.length).toEqual(2);
            expect(selectedAlbums[0]).toBe(album1);
            expect(selectedAlbums[1]).toBe(album2);
        });
    });
    //     describe('saveSelectedAlbumToSettings', () => {
    //         it('should clear the selected album in the settings if the given selected album is undefined', () => {
    //             // Arrange
    //             settingsStub.albumsTabSelectedAlbum = 'someAlbumKey';
    //             albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

    //             // Act
    //             albumsPersister.saveSelectedAlbumsToSettings(undefined);

    //             // Assert
    //             expect(settingsStub.albumsTabSelectedAlbum).toEqual('');
    //         });

    //         it('should save the selected album to the settings if the given selected album is not undefined', () => {
    //             // Arrange
    //             const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
    //             const albumData: AlbumData = new AlbumData();
    //             albumData.albumKey = 'someAlbumKey';
    //             const selectedAlbum: AlbumModel = new AlbumModel(albumData, translatorServiceMock.object);

    //             // Act
    //             albumsPersister.saveSelectedAlbumsToSettings(selectedAlbum);

    //             // Assert
    //             expect(settingsStub.albumsTabSelectedAlbum).toEqual('someAlbumKey');
    //         });
    //     });

    //     describe('getSelectedAlbumFromSettings', () => {
    //         it('should return undefined if available albums is undefined', () => {
    //             // Arrange

    //             // Act
    //             const selectedAlbumFromSettings: AlbumModel = albumsPersister.getSelectedAlbumsFromSettings(undefined);

    //             // Assert
    //             expect(selectedAlbumFromSettings).toBeUndefined();
    //         });

    //         it('should return undefined if there are no available albums', () => {
    //             // Arrange
    //             const availableAlbums: AlbumModel[] = [];

    //             // Act
    //             const selectedAlbumFromSettings: AlbumModel = albumsPersister.getSelectedAlbumsFromSettings(availableAlbums);

    //             // Assert
    //             expect(selectedAlbumFromSettings).toBeUndefined();
    //         });

    //         it('should return the first album if selected album from settings is undefined', () => {
    //             // Arrange
    //             const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
    //             const albumData1: AlbumData = new AlbumData();
    //             albumData1.albumKey = 'albumKey1';
    //             const albumData2: AlbumData = new AlbumData();
    //             albumData2.albumKey = 'albumKey2';
    //             const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
    //             const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
    //             const availableAlbums: AlbumModel[] = [album1, album2];
    //             settingsStub.albumsTabSelectedAlbum = undefined;
    //             albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

    //             // Act
    //             const selectedAlbumFromSettings: AlbumModel = albumsPersister.getSelectedAlbumsFromSettings(availableAlbums);

    //             // Assert
    //             expect(selectedAlbumFromSettings).toEqual(album1);
    //         });

    //         it('should return the first album if selected album from settings is empty', () => {
    //             // Arrange
    //             const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
    //             const albumData1: AlbumData = new AlbumData();
    //             albumData1.albumKey = 'albumKey1';
    //             const albumData2: AlbumData = new AlbumData();
    //             albumData2.albumKey = 'albumKey2';
    //             const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
    //             const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
    //             const availableAlbums: AlbumModel[] = [album1, album2];
    //             settingsStub.albumsTabSelectedAlbum = '';
    //             albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

    //             // Act
    //             const selectedAlbumFromSettings: AlbumModel = albumsPersister.getSelectedAlbumsFromSettings(availableAlbums);

    //             // Assert
    //             expect(selectedAlbumFromSettings).toEqual(album1);
    //         });

    //         it('should return the first album if an selected album is found in the settings which is not included in available albums', () => {
    //             // Arrange
    //             const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
    //             const albumData1: AlbumData = new AlbumData();
    //             albumData1.albumKey = 'albumKey1';
    //             const albumData2: AlbumData = new AlbumData();
    //             albumData2.albumKey = 'albumKey2';
    //             const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
    //             const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
    //             const availableAlbums: AlbumModel[] = [album1, album2];
    //             settingsStub.albumsTabSelectedAlbum = 'albumKey3';
    //             albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

    //             // Act
    //             const selectedAlbumFromSettings: AlbumModel = albumsPersister.getSelectedAlbumsFromSettings(availableAlbums);

    //             // Assert
    //             expect(selectedAlbumFromSettings).toEqual(album1);
    //         });

    //         it('should return the album from the settings if an selected album is found in the settings which is included in available albums', () => {
    //             // Arrange
    //             const translatorServiceMock: IMock<BaseTranslatorService> = Mock.ofType<BaseTranslatorService>();
    //             const albumData1: AlbumData = new AlbumData();
    //             albumData1.albumKey = 'albumKey1';
    //             const albumData2: AlbumData = new AlbumData();
    //             albumData2.albumKey = 'albumKey2';
    //             const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object);
    //             const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object);
    //             const availableAlbums: AlbumModel[] = [album1, album2];
    //             settingsStub.albumsTabSelectedAlbum = 'albumKey2';
    //             albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

    //             // Act
    //             const selectedAlbumFromSettings: AlbumModel = albumsPersister.getSelectedAlbumsFromSettings(availableAlbums);

    //             // Assert
    //             expect(selectedAlbumFromSettings).toEqual(album2);
    //         });
    //     });

    //     describe('saveSelectedAlbumOrderToSettings', () => {
    //         it('should save the selected album order to the settings', () => {
    //             // Arrange
    //             settingsStub.albumsTabSelectedAlbumOrder = 'byAlbumTitleAscending';

    //             // Act
    //             albumsPersister.saveSelectedAlbumOrderToSettings(AlbumOrder.byLastPlayed);

    //             // Assert
    //             expect(settingsStub.albumsTabSelectedAlbumOrder).toEqual('byLastPlayed');
    //         });
    //     });

    //     describe('getSelectedAlbumOrderFromSettings', () => {
    //         it('should return byAlbumTitleAscending if no selected album order is found in the settings', () => {
    //             // Arrange
    //             settingsStub.albumsTabSelectedAlbumOrder = undefined;

    //             // Act
    //             const selectedAlbumOrderFromSettings: AlbumOrder = albumsPersister.getSelectedAlbumOrderFromSettings();

    //             // Assert
    //             expect(selectedAlbumOrderFromSettings).toEqual(AlbumOrder.byAlbumTitleAscending);
    //         });

    //         it('should return the selected album order from the settings if an selected album order is found in the settings', () => {
    //             // Arrange
    //             settingsStub.albumsTabSelectedAlbumOrder = 'byYearAscending';

    //             // Act
    //             const selectedAlbumOrderFromSettings: AlbumOrder = albumsPersister.getSelectedAlbumOrderFromSettings();

    //             // Assert
    //             expect(selectedAlbumOrderFromSettings).toEqual(AlbumOrder.byYearAscending);
    //         });
    //     });
});
