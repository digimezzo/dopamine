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
        availableAlbums = [album1, album2, album3];

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

    describe('setSelectedAlbums', () => {
        it('should empty the selected albums if selectedAlbums is undefined', () => {
            // Arrange

            // Act
            albumsPersister.setSelectedAlbums(undefined);

            // Assert
            expect(albumsPersister.getSelectedAlbums(availableAlbums)).toEqual([]);
        });

        it('should empty the selected albums if selectedAlbums is empty', () => {
            // Arrange

            // Act
            albumsPersister.setSelectedAlbums([]);

            // Assert
            expect(albumsPersister.getSelectedAlbums(availableAlbums)).toEqual([]);
        });

        it('should set the selected albums if selectedAlbums is valid', () => {
            // Arrange

            // Act
            albumsPersister.setSelectedAlbums([album2, album3]);

            // Assert
            expect(albumsPersister.getSelectedAlbums(availableAlbums)).toEqual([album2, album3]);
        });

        it('should save an empty selected album to the settings if selectedAlbums is undefined', () => {
            // Arrange
            settingsStub.albumsTabSelectedAlbum = 'someAlbum';

            // Act
            albumsPersister.setSelectedAlbums(undefined);

            // Assert
            expect(settingsStub.albumsTabSelectedAlbum).toEqual('');
        });

        it('should save an empty selected album to the settings if selectedAlbums is empty', () => {
            // Arrange
            settingsStub.albumsTabSelectedAlbum = 'someAlbum';

            // Act
            albumsPersister.setSelectedAlbums([]);

            // Assert
            expect(settingsStub.albumsTabSelectedAlbum).toEqual('');
        });

        it('should save the first selected album to the settings if selectedAlbums is valid', () => {
            // Arrange
            settingsStub.albumsTabSelectedAlbum = 'someAlbum';

            // Act
            albumsPersister.setSelectedAlbums([album2, album3]);

            // Assert
            expect(settingsStub.albumsTabSelectedAlbum).toEqual('albumKey2');
        });
    });

    describe('getSelectedAlbumOrder', () => {
        it('should return byAlbumTitleAscending if there is no selected album order', () => {
            // Arrange

            // Act
            const selectedAlbumorder: AlbumOrder = albumsPersister.getSelectedAlbumOrder();

            // Assert
            expect(selectedAlbumorder).toEqual(AlbumOrder.byAlbumTitleAscending);
        });

        it('should return the selected album order if there is a selected album order', () => {
            // Arrange
            settingsStub.albumsTabSelectedAlbumOrder = 'byYearDescending';
            albumsPersister = new AlbumsPersister(settingsStub, loggerMock.object);

            // Act
            const selectedAlbumorder: AlbumOrder = albumsPersister.getSelectedAlbumOrder();

            // Assert
            expect(selectedAlbumorder).toEqual(AlbumOrder.byYearDescending);
        });
    });

    describe('setSelectedAlbumOrder', () => {
        it('should set the selected album order', () => {
            // Arrange

            // Act
            albumsPersister.setSelectedAlbumOrder(AlbumOrder.byYearDescending);

            // Assert
            expect(albumsPersister.getSelectedAlbumOrder()).toEqual(AlbumOrder.byYearDescending);
        });

        it('should save the selected album order to the settings', () => {
            // Arrange

            // Act
            albumsPersister.setSelectedAlbumOrder(AlbumOrder.byYearDescending);

            // Assert
            expect(settingsStub.albumsTabSelectedAlbumOrder).toEqual('byYearDescending');
        });
    });
});
