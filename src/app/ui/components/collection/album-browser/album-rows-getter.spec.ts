import { IMock, It, Mock, Times } from 'typemoq';
import { AlbumData } from '../../../../data/entities/album-data';
import { AlbumOrder } from '../album-order';
import { ItemSpaceCalculator } from '../item-space-calculator';
import { AlbumRow } from './album-row';
import { AlbumRowsGetter } from './album-rows-getter';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { AlbumModel } from '../../../../services/album/album-model';
import { ApplicationPaths } from '../../../../common/application/application-paths';
import { AlbumSorter } from '../../../../common/sorting/album-sorter';

describe('AlbumRowsGetter', () => {
    let itemSpaceCalculatorMock: IMock<ItemSpaceCalculator>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let applicationPathsMock: IMock<ApplicationPaths>;
    let albumSorterMock: IMock<AlbumSorter>;
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
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        applicationPathsMock = Mock.ofType<ApplicationPaths>();
        albumSorterMock = Mock.ofType<AlbumSorter>();

        itemSpaceCalculatorMock.setup((x) => x.calculateNumberOfItemsPerRow(It.isAny(), It.isAny())).returns(() => 2);
        translatorServiceMock.setup((x) => x.get('unknown-artist')).returns(() => 'Unknown artist');
        translatorServiceMock.setup((x) => x.get('unknown-title')).returns(() => 'Unknown title');

        album1 = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
        album2 = new AlbumModel(albumData2, translatorServiceMock.object, applicationPathsMock.object);
        album3 = new AlbumModel(albumData3, translatorServiceMock.object, applicationPathsMock.object);
        album4 = new AlbumModel(albumData4, translatorServiceMock.object, applicationPathsMock.object);
        album5 = new AlbumModel(albumData5, translatorServiceMock.object, applicationPathsMock.object);
        album6 = new AlbumModel(albumData6, translatorServiceMock.object, applicationPathsMock.object);

        albums = [album1, album2, album3, album4, album5, album6];

        albumRowsGetter = new AlbumRowsGetter(itemSpaceCalculatorMock.object, albumSorterMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act, Assert
            expect(albumRowsGetter).toBeDefined();
        });
    });

    describe('getAlbumRows', () => {
        it('should return empty album rows if albums is empty', () => {
            // Arrange, Act
            const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, [], AlbumOrder.byAlbumTitleAscending);

            // Assert
            expect(albumRows.length).toBe(0);
        });

        it('should sort by album title ascending when provided AlbumOrder.byAlbumTitleAscending', () => {
            // Arrange
            albumSorterMock.setup((x) => x.sortAlbums(albums, AlbumOrder.byAlbumTitleAscending)).returns(() => albums);

            // Act
            albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byAlbumTitleAscending);

            // Assert
            albumSorterMock.verify((x) => x.sortAlbums(albums, AlbumOrder.byAlbumTitleAscending), Times.once());
        });

        it('should sort by album title descending when provided AlbumOrder.byAlbumTitleDescending', () => {
            // Arrange
            albumSorterMock.setup((x) => x.sortAlbums(albums, AlbumOrder.byAlbumTitleDescending)).returns(() => albums);

            // Act
            albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byAlbumTitleDescending);

            // Assert
            albumSorterMock.verify((x) => x.sortAlbums(albums, AlbumOrder.byAlbumTitleDescending), Times.once());
        });

        it('should sort by date added descending when provided AlbumOrder.byDateAdded', () => {
            // Arrange
            albumSorterMock.setup((x) => x.sortAlbums(albums, AlbumOrder.byDateAdded)).returns(() => albums);

            // Act
            albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byDateAdded);

            // Assert
            albumSorterMock.verify((x) => x.sortAlbums(albums, AlbumOrder.byDateAdded), Times.once());
        });

        it('should sort by date file created descending when provided AlbumOrder.byDateCreated', () => {
            // Arrange
            albumSorterMock.setup((x) => x.sortAlbums(albums, AlbumOrder.byDateCreated)).returns(() => albums);

            // Act
            albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byDateCreated);

            // Assert
            albumSorterMock.verify((x) => x.sortAlbums(albums, AlbumOrder.byDateCreated), Times.once());
        });

        it('should sort by year ascending when provided AlbumOrder.byYearAscending', () => {
            // Arrange
            albumSorterMock.setup((x) => x.sortAlbums(albums, AlbumOrder.byYearAscending)).returns(() => albums);

            // Act
            albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byYearAscending);

            // Assert
            albumSorterMock.verify(
                (x) =>
                    x.sortAlbums(
                        It.is<AlbumModel[]>(
                            (albumModels: AlbumModel[]) =>
                                albumModels[0].albumKey === albums[0].albumKey &&
                                albumModels[1].albumKey === albums[1].albumKey &&
                                albumModels[2].albumKey === albums[2].albumKey &&
                                albumModels[3].albumKey === albums[3].albumKey &&
                                albumModels[4].albumKey === albums[4].albumKey &&
                                albumModels[5].albumKey === albums[5].albumKey,
                        ),
                        AlbumOrder.byYearAscending,
                    ),
                Times.once(),
            );
        });

        it('should sort by year descending when provided AlbumOrder.byYearDescending', () => {
            // Arrange
            albumSorterMock.setup((x) => x.sortAlbums(albums, AlbumOrder.byYearDescending)).returns(() => albums);

            // Act
            albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byYearDescending);

            // Assert
            albumSorterMock.verify(
                (x) =>
                    x.sortAlbums(
                        It.is<AlbumModel[]>(
                            (albumModels: AlbumModel[]) =>
                                albumModels[0].albumKey === albums[0].albumKey &&
                                albumModels[1].albumKey === albums[1].albumKey &&
                                albumModels[2].albumKey === albums[2].albumKey &&
                                albumModels[3].albumKey === albums[3].albumKey &&
                                albumModels[4].albumKey === albums[4].albumKey &&
                                albumModels[5].albumKey === albums[5].albumKey,
                        ),
                        AlbumOrder.byYearDescending,
                    ),
                Times.once(),
            );
        });

        it('should return album rows by date last played descending when provided AlbumOrder.byLastPlayed', () => {
            // Arrange
            albumSorterMock.setup((x) => x.sortAlbums(albums, AlbumOrder.byLastPlayed)).returns(() => albums);

            // Act
            albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byLastPlayed);

            // Assert
            albumSorterMock.verify((x) => x.sortAlbums(albums, AlbumOrder.byLastPlayed), Times.once());
        });

        it('should sort in random order when provided AlbumOrder.random', () => {
            // Arrange
            albumSorterMock.setup((x) => x.sortAlbums(albums, AlbumOrder.random)).returns(() => albums);

            // Act
            albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.random);

            // Assert
            albumSorterMock.verify((x) => x.sortAlbums(albums, AlbumOrder.random), Times.once());
        });
    });
});
