import { IMock, It, Mock } from 'typemoq';
import { AlbumData } from '../../../common/data/entities/album-data';
import { FileAccess } from '../../../common/io/file-access';
import { Shuffler } from '../../../common/shuffler';
import { AlbumModel } from '../../../services/album/album-model';
import { BaseTranslatorService } from '../../../services/translator/base-translator.service';
import { AlbumOrder } from '../album-order';
import { ItemSpaceCalculator } from '../item-space-calculator';
import { AlbumRow } from './album-row';
import { AlbumRowsGetter } from './album-rows-getter';

describe('AlbumRowsGetter', () => {
    let itemSpaceCalculatorMock: IMock<ItemSpaceCalculator>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let fileAccessMock: IMock<FileAccess>;
    let shufflerMock: IMock<Shuffler>;
    let albumRowsGetter: AlbumRowsGetter;

    const albumData1: AlbumData = new AlbumData();
    albumData1.albumTitle = 'Album title 1';
    albumData1.dateAdded = 2;
    albumData1.dateFileCreated = 3;
    albumData1.year = 2020;
    albumData1.dateLastPlayed = 5;

    const albumData2: AlbumData = new AlbumData();
    albumData2.albumTitle = 'Album title 2';
    albumData2.dateAdded = 5;
    albumData2.dateFileCreated = 5;
    albumData2.year = 2020;
    albumData2.dateLastPlayed = 3;

    const albumData3: AlbumData = new AlbumData();
    albumData3.albumTitle = 'Album title 3';
    albumData3.dateAdded = 1;
    albumData3.dateFileCreated = 6;
    albumData3.year = 2021;
    albumData3.dateLastPlayed = 1;

    const albumData4: AlbumData = new AlbumData();
    albumData4.dateAdded = 4;
    albumData4.dateFileCreated = 4;
    albumData4.year = 1980;
    albumData4.dateLastPlayed = 2;

    const albumData5: AlbumData = new AlbumData();
    albumData5.albumTitle = 'Album title 5';
    albumData5.dateAdded = 6;
    albumData5.dateFileCreated = 2;
    albumData5.year = 0;
    albumData5.dateLastPlayed = 4;

    const albumData6: AlbumData = new AlbumData();
    albumData6.albumTitle = 'Album title 6';
    albumData6.dateAdded = 3;
    albumData6.dateFileCreated = 1;
    albumData6.year = 2001;
    albumData6.dateLastPlayed = 6;

    let album1: AlbumModel;
    let album2: AlbumModel;
    let album3: AlbumModel;
    let album4: AlbumModel;
    let album5: AlbumModel;
    let album6: AlbumModel;

    let albums: AlbumModel[];

    beforeEach(() => {
        itemSpaceCalculatorMock = Mock.ofType<ItemSpaceCalculator>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        fileAccessMock = Mock.ofType<FileAccess>();
        shufflerMock = Mock.ofType<Shuffler>();

        itemSpaceCalculatorMock.setup((x) => x.calculateNumberOfItemsPerRow(It.isAny(), It.isAny())).returns(() => 2);
        translatorServiceMock.setup((x) => x.get('unknown-artist')).returns(() => 'Unknown artist');
        translatorServiceMock.setup((x) => x.get('unknown-title')).returns(() => 'Unknown title');

        album1 = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
        album2 = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
        album3 = new AlbumModel(albumData3, translatorServiceMock.object, fileAccessMock.object);
        album4 = new AlbumModel(albumData4, translatorServiceMock.object, fileAccessMock.object);
        album5 = new AlbumModel(albumData5, translatorServiceMock.object, fileAccessMock.object);
        album6 = new AlbumModel(albumData6, translatorServiceMock.object, fileAccessMock.object);

        albums = [album1, album2, album3, album4, album5, album6];

        shufflerMock.setup((x) => x.shuffle(albums)).returns(() => [album5, album3, album1, album6, album4, album2]);

        albumRowsGetter = new AlbumRowsGetter(itemSpaceCalculatorMock.object, shufflerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(albumRowsGetter).toBeDefined();
        });
    });

    describe('getAlbumRows', () => {
        it('should return empty album rows if albums is undefined', () => {
            // Arrange

            // Act
            const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, undefined, AlbumOrder.byAlbumTitleAscending);

            // Assert
            expect(albumRows.length).toBe(0);
        });

        it('should return empty album rows if albums is empty', () => {
            // Arrange

            // Act
            const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, [], AlbumOrder.byAlbumTitleAscending);

            // Assert
            expect(albumRows.length).toBe(0);
        });

        it('should return album rows by album title ascending when provided AlbumOrder.byAlbumTitleAscending', () => {
            // Arrange

            // Act
            const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byAlbumTitleAscending);

            // Assert
            expect(albumRows[0].albums[0]).toBe(album1);
            expect(albumRows[0].albums[1]).toBe(album2);
            expect(albumRows[1].albums[0]).toBe(album3);
            expect(albumRows[1].albums[1]).toBe(album5);
            expect(albumRows[2].albums[0]).toBe(album6);
            expect(albumRows[2].albums[1]).toBe(album4);
        });

        it('should return album rows by album title descending when provided AlbumOrder.byAlbumTitleDescending', () => {
            // Arrange

            // Act
            const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byAlbumTitleDescending);

            // Assert
            expect(albumRows[0].albums[0]).toBe(album4);
            expect(albumRows[0].albums[1]).toBe(album6);
            expect(albumRows[1].albums[0]).toBe(album5);
            expect(albumRows[1].albums[1]).toBe(album3);
            expect(albumRows[2].albums[0]).toBe(album2);
            expect(albumRows[2].albums[1]).toBe(album1);
        });

        it('should return album rows by date added descending when provided AlbumOrder.byDateAdded', () => {
            // Arrange

            // Act
            const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byDateAdded);

            // Assert
            expect(albumRows[0].albums[0]).toBe(album5);
            expect(albumRows[0].albums[1]).toBe(album2);
            expect(albumRows[1].albums[0]).toBe(album4);
            expect(albumRows[1].albums[1]).toBe(album6);
            expect(albumRows[2].albums[0]).toBe(album1);
            expect(albumRows[2].albums[1]).toBe(album3);
        });

        it('should return album rows by date file created descending when provided AlbumOrder.byDateCreated', () => {
            // Arrange

            // Act
            const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byDateCreated);

            // Assert
            expect(albumRows[0].albums[0]).toBe(album3);
            expect(albumRows[0].albums[1]).toBe(album2);
            expect(albumRows[1].albums[0]).toBe(album4);
            expect(albumRows[1].albums[1]).toBe(album1);
            expect(albumRows[2].albums[0]).toBe(album5);
            expect(albumRows[2].albums[1]).toBe(album6);
        });

        it('should return album rows grouped by year ascending when provided AlbumOrder.byYearAscending', () => {
            // Arrange

            // Act
            const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byYearAscending);

            // Assert
            expect(albumRows[0].albums[0]).toBe(album5);
            expect(albumRows[0].albums[0].yearHeader).toEqual('?');
            expect(albumRows[0].albums[0].showYear).toBeTruthy();

            expect(albumRows[1].albums[0]).toBe(album4);
            expect(albumRows[1].albums[0].yearHeader).toEqual('1980');
            expect(albumRows[1].albums[0].showYear).toBeTruthy();

            expect(albumRows[2].albums[0]).toBe(album6);
            expect(albumRows[2].albums[0].yearHeader).toEqual('2001');
            expect(albumRows[2].albums[0].showYear).toBeTruthy();

            expect(albumRows[3].albums[0]).toBe(album2);
            expect(albumRows[3].albums[0].yearHeader).toEqual('2020');
            expect(albumRows[3].albums[0].showYear).toBeTruthy();

            expect(albumRows[3].albums[1]).toBe(album1);
            expect(albumRows[3].albums[1].yearHeader).toEqual('');
            expect(albumRows[3].albums[1].showYear).toBeTruthy();

            expect(albumRows[4].albums[0]).toBe(album3);
            expect(albumRows[4].albums[0].yearHeader).toEqual('2021');
            expect(albumRows[4].albums[0].showYear).toBeTruthy();
        });

        it('should return album rows grouped by year descending when provided AlbumOrder.byYearDescending', () => {
            // Arrange

            // Act
            const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byYearDescending);

            // Assert
            expect(albumRows[0].albums[0]).toBe(album3);
            expect(albumRows[0].albums[0].yearHeader).toEqual('2021');
            expect(albumRows[0].albums[0].showYear).toBeTruthy();

            expect(albumRows[1].albums[0]).toBe(album2);
            expect(albumRows[1].albums[0].yearHeader).toEqual('2020');
            expect(albumRows[1].albums[0].showYear).toBeTruthy();

            expect(albumRows[1].albums[1]).toBe(album1);
            expect(albumRows[1].albums[1].yearHeader).toEqual('');
            expect(albumRows[1].albums[1].showYear).toBeTruthy();

            expect(albumRows[2].albums[0]).toBe(album6);
            expect(albumRows[2].albums[0].yearHeader).toEqual('2001');
            expect(albumRows[2].albums[0].showYear).toBeTruthy();

            expect(albumRows[3].albums[0]).toBe(album4);
            expect(albumRows[3].albums[0].yearHeader).toEqual('1980');
            expect(albumRows[3].albums[0].showYear).toBeTruthy();

            expect(albumRows[4].albums[0]).toBe(album5);
            expect(albumRows[4].albums[0].yearHeader).toEqual('?');
            expect(albumRows[4].albums[0].showYear).toBeTruthy();
        });

        it('should return album rows by date last played descending when provided AlbumOrder.byLastPlayed', () => {
            // Arrange

            // Act
            const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byLastPlayed);

            // Assert
            expect(albumRows[0].albums[0]).toBe(album6);
            expect(albumRows[0].albums[1]).toBe(album1);
            expect(albumRows[1].albums[0]).toBe(album5);
            expect(albumRows[1].albums[1]).toBe(album2);
            expect(albumRows[2].albums[0]).toBe(album4);
            expect(albumRows[2].albums[1]).toBe(album3);
        });

        it('should return album rows in random order when provided AlbumOrder.random', () => {
            // Arrange

            // Act
            const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.random);

            // Assert
            expect(albumRows[0].albums[0]).toBe(album5);
            expect(albumRows[0].albums[1]).toBe(album3);
            expect(albumRows[1].albums[0]).toBe(album1);
            expect(albumRows[1].albums[1]).toBe(album6);
            expect(albumRows[2].albums[0]).toBe(album4);
            expect(albumRows[2].albums[1]).toBe(album2);
        });
    });
});
