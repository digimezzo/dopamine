import { IMock, It, Mock, Times } from 'typemoq';
import { AlbumData } from '../../../../data/entities/album-data';
import { AlbumOrder } from '../album-order';
import { ItemSpaceCalculator } from '../item-space-calculator';
import { AlbumRow } from './album-row';
import { AlbumRowsGetter } from './album-rows-getter';
import { Shuffler } from '../../../../common/shuffler';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { AlbumModel } from '../../../../services/album/album-model';
import { ApplicationPaths } from '../../../../common/application/application-paths';
import { AlbumSorter } from '../../../../common/sorting/album-sorter';

describe('AlbumRowsGetter', () => {
    let itemSpaceCalculatorMock: IMock<ItemSpaceCalculator>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let applicationPathsMock: IMock<ApplicationPaths>;
    let albumSorterMock: IMock<AlbumSorter>;
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
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        applicationPathsMock = Mock.ofType<ApplicationPaths>();
        albumSorterMock = Mock.ofType<AlbumSorter>();
        shufflerMock = Mock.ofType<Shuffler>();

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

        shufflerMock.setup((x) => x.shuffle(albums)).returns(() => [album5, album3, album1, album6, album4, album2]);

        albumRowsGetter = new AlbumRowsGetter(itemSpaceCalculatorMock.object, albumSorterMock.object, shufflerMock.object);
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
            const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, [], AlbumOrder.byAlbumTitleAscending, false);

            // Assert
            expect(albumRows.length).toBe(0);
        });

        it('should sort by album title ascending when provided AlbumOrder.byAlbumTitleAscending', () => {
            // Arrange
            albumSorterMock.setup((x) => x.sortByAlbumTitleAscending(albums)).returns(() => albums);

            // Act
            albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byAlbumTitleAscending, false);

            // Assert
            albumSorterMock.verify((x) => x.sortByAlbumTitleAscending(albums), Times.once());
        });

        it('should sort by album title descending when provided AlbumOrder.byAlbumTitleDescending', () => {
            // Arrange
            albumSorterMock.setup((x) => x.sortByAlbumTitleDescending(albums)).returns(() => albums);

            // Act
            albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byAlbumTitleDescending, false);

            // Assert
            albumSorterMock.verify((x) => x.sortByAlbumTitleDescending(albums), Times.once());
        });

        it('should sort by date added descending when provided AlbumOrder.byDateAdded', () => {
            // Arrange
            albumSorterMock.setup((x) => x.sortByDateAdded(albums)).returns(() => albums);

            // Act
            albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byDateAdded, false);

            // Assert
            albumSorterMock.verify((x) => x.sortByDateAdded(albums), Times.once());
        });

        it('should sort by date file created descending when provided AlbumOrder.byDateCreated', () => {
            // Arrange
            albumSorterMock.setup((x) => x.sortByDateCreated(albums)).returns(() => albums);

            // Act
            albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byDateCreated, false);

            // Assert
            albumSorterMock.verify((x) => x.sortByDateCreated(albums), Times.once());
        });

        it('should sort by year ascending when provided AlbumOrder.byYearAscending', () => {
            // Arrange
            albumSorterMock.setup((x) => x.sortByYearAscending(albums)).returns(() => albums);

            // Act
            albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byYearAscending, false);

            // Assert
            albumSorterMock.verify(
                (x) =>
                    x.sortByYearAscending(
                        It.is<AlbumModel[]>(
                            (albumModels: AlbumModel[]) =>
                                albumModels[0].albumKey === albums[0].albumKey &&
                                albumModels[1].albumKey === albums[1].albumKey &&
                                albumModels[2].albumKey === albums[2].albumKey &&
                                albumModels[3].albumKey === albums[3].albumKey &&
                                albumModels[4].albumKey === albums[4].albumKey &&
                                albumModels[5].albumKey === albums[5].albumKey,
                        ),
                    ),
                Times.once(),
            );
        });

        it('should sort by year descending when provided AlbumOrder.byYearDescending', () => {
            // Arrange
            albumSorterMock.setup((x) => x.sortByYearDescending(albums)).returns(() => albums);

            // Act
            albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byYearDescending, false);

            // Assert
            albumSorterMock.verify(
                (x) =>
                    x.sortByYearDescending(
                        It.is<AlbumModel[]>(
                            (albumModels: AlbumModel[]) =>
                                albumModels[0].albumKey === albums[0].albumKey &&
                                albumModels[1].albumKey === albums[1].albumKey &&
                                albumModels[2].albumKey === albums[2].albumKey &&
                                albumModels[3].albumKey === albums[3].albumKey &&
                                albumModels[4].albumKey === albums[4].albumKey &&
                                albumModels[5].albumKey === albums[5].albumKey,
                        ),
                    ),
                Times.once(),
            );
        });

        it('should return album rows by date last played descending when provided AlbumOrder.byLastPlayed', () => {
            // Arrange
            albumSorterMock.setup((x) => x.sortByDateLastPlayed(albums)).returns(() => albums);

            // Act
            albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byLastPlayed, false);

            // Assert
            albumSorterMock.verify((x) => x.sortByDateLastPlayed(albums), Times.once());
        });

        it('should sort in random order when provided AlbumOrder.random', () => {
            // Arrange
            shufflerMock.setup((x) => x.shuffle(albums)).returns(() => albums);

            // Act
            const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.random, false);

            // Assert
            shufflerMock.verify((x) => x.shuffle(albums), Times.once());
        });

        describe('year display logic', () => {
            it('should set showYear to false for all albums when not sorting by year', () => {
                // Arrange
                albumSorterMock.setup((x) => x.sortByAlbumTitleAscending(albums)).returns(() => albums);

                // Act
                const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byAlbumTitleAscending, false);

                // Assert
                for (const row of albumRows) {
                    for (const album of row.albums) {
                        expect(album.showYear).toBe(false);
                    }
                }
            });

            it('should set showYear to false for all albums when useCompactYearView is true', () => {
                // Arrange
                albumSorterMock.setup((x) => x.sortByYearAscending(albums)).returns(() => albums);

                // Act
                const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byYearAscending, true);

                // Assert
                for (const row of albumRows) {
                    for (const album of row.albums) {
                        expect(album.showYear).toBe(false);
                    }
                }
            });

            it('should set showYear to true for albums when sorting by year ascending and useCompactYearView is false', () => {
                // Arrange
                const testAlbums = [album1, album2, album3];
                albumSorterMock.setup((x) => x.sortByYearAscending(testAlbums)).returns(() => testAlbums);

                // Act
                const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, testAlbums, AlbumOrder.byYearAscending, false);

                // Assert
                let albumCount = 0;
                for (const row of albumRows) {
                    for (const album of row.albums) {
                        albumCount++;
                        if (row.albums[0].yearHeader.length > 0) {
                            expect(album.showYear).toBe(true);
                        }
                    }
                }
                expect(albumCount).toBeGreaterThan(0);
            });

            it('should set showYear to true for albums when sorting by year descending and useCompactYearView is false', () => {
                // Arrange
                const testAlbums = [album3, album1, album2];
                albumSorterMock.setup((x) => x.sortByYearDescending(testAlbums)).returns(() => testAlbums);

                // Act
                const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, testAlbums, AlbumOrder.byYearDescending, false);

                // Assert
                let albumCount = 0;
                for (const row of albumRows) {
                    for (const album of row.albums) {
                        albumCount++;
                        if (row.albums[0].yearHeader.length > 0) {
                            expect(album.showYear).toBe(true);
                        }
                    }
                }
                expect(albumCount).toBeGreaterThan(0);
            });

            it('should set yearHeader to formatted year for first album of each year group when sorting by year ascending', () => {
                // Arrange
                const albumsWithDifferentYears = [album4, album6, album1, album2, album3];
                albumSorterMock.setup((x) => x.sortByYearAscending(albumsWithDifferentYears)).returns(() => albumsWithDifferentYears);

                // Act
                const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(
                    280,
                    albumsWithDifferentYears,
                    AlbumOrder.byYearAscending,
                    false,
                );

                // Assert
                const firstAlbumOfEachYear: AlbumModel[] = [];
                for (const row of albumRows) {
                    if (row.albums[0].yearHeader.length > 0) {
                        firstAlbumOfEachYear.push(row.albums[0]);
                    }
                }

                expect(firstAlbumOfEachYear.length).toBeGreaterThan(0);
                for (const album of firstAlbumOfEachYear) {
                    expect(album.yearHeader).toBeTruthy();
                    expect(album.yearHeader).not.toBe('');
                }
            });

            it('should set yearHeader to formatted year for first album of each year group when sorting by year descending', () => {
                // Arrange
                const albumsWithDifferentYears = [album3, album1, album2, album6, album4];
                albumSorterMock.setup((x) => x.sortByYearDescending(albumsWithDifferentYears)).returns(() => albumsWithDifferentYears);

                // Act
                const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(
                    280,
                    albumsWithDifferentYears,
                    AlbumOrder.byYearDescending,
                    false,
                );

                // Assert
                const firstAlbumOfEachYear: AlbumModel[] = [];
                for (const row of albumRows) {
                    if (row.albums[0].yearHeader.length > 0) {
                        firstAlbumOfEachYear.push(row.albums[0]);
                    }
                }

                expect(firstAlbumOfEachYear.length).toBeGreaterThan(0);
                for (const album of firstAlbumOfEachYear) {
                    expect(album.yearHeader).toBeTruthy();
                    expect(album.yearHeader).not.toBe('');
                }
            });

            it('should not duplicate yearHeader for albums with the same year', () => {
                // Arrange
                const testAlbums = [album1, album2, album3];
                albumSorterMock.setup((x) => x.sortByYearAscending(testAlbums)).returns(() => testAlbums);

                // Act
                const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, testAlbums, AlbumOrder.byYearAscending, false);

                // Assert
                const yearHeaders: string[] = [];
                for (const row of albumRows) {
                    for (const album of row.albums) {
                        if (album.yearHeader && album.yearHeader.length > 0) {
                            yearHeaders.push(album.yearHeader);
                        }
                    }
                }

                const uniqueYearHeaders = [...new Set(yearHeaders)];
                expect(yearHeaders.length).toBe(uniqueYearHeaders.length);
            });

            it('should break row when year changes in non-compact view with year sorting', () => {
                // Arrange
                const albumsWithDifferentYears = [album4, album6, album1, album3];
                albumSorterMock.setup((x) => x.sortByYearAscending(albumsWithDifferentYears)).returns(() => albumsWithDifferentYears);

                // Act
                const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(
                    280,
                    albumsWithDifferentYears,
                    AlbumOrder.byYearAscending,
                    false,
                );

                // Assert - each year should start a new row
                const yearsInRows: number[][] = [];
                for (const row of albumRows) {
                    const yearsInThisRow: number[] = [];
                    for (const album of row.albums) {
                        yearsInThisRow.push(album.year);
                    }
                    yearsInRows.push(yearsInThisRow);
                }

                // Check that each row contains only one unique year
                for (const yearsInRow of yearsInRows) {
                    const uniqueYears = [...new Set(yearsInRow)];
                    expect(uniqueYears.length).toBe(1);
                }
            });

            it('should set yearHeader to empty string for albums that are not first in their year group', () => {
                // Arrange
                const testAlbums = [album1, album2, album3];
                albumSorterMock.setup((x) => x.sortByYearAscending(testAlbums)).returns(() => testAlbums);

                // Act
                const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, testAlbums, AlbumOrder.byYearAscending, false);

                // Assert
                let foundHeader = false;
                let foundEmpty = false;
                for (const row of albumRows) {
                    for (const album of row.albums) {
                        if (album.yearHeader && album.yearHeader.length > 0) {
                            foundHeader = true;
                        } else if (album.year === 2020) {
                            foundEmpty = true;
                        }
                    }
                }

                expect(foundHeader).toBe(true);
                expect(foundEmpty).toBe(true);
            });

            it('should not set yearHeader for any albums when not sorting by year', () => {
                // Arrange
                albumSorterMock.setup((x) => x.sortByAlbumTitleAscending(albums)).returns(() => albums);

                // Act
                const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byAlbumTitleAscending, false);

                // Assert
                for (const row of albumRows) {
                    for (const album of row.albums) {
                        expect(album.yearHeader).toBe('');
                    }
                }
            });

            it('should not set yearHeader for any albums when useCompactYearView is true', () => {
                // Arrange
                albumSorterMock.setup((x) => x.sortByYearAscending(albums)).returns(() => albums);

                // Act
                const albumRows: AlbumRow[] = albumRowsGetter.getAlbumRows(280, albums, AlbumOrder.byYearAscending, true);

                // Assert
                for (const row of albumRows) {
                    for (const album of row.albums) {
                        expect(album.yearHeader).toBe('');
                    }
                }
            });
        });
    });
});
