import { AlbumModel } from '../../services/album/album-model';
import { AlbumSorter } from './album-sorter';
import { AlbumData } from '../../data/entities/album-data';
import { IMock, Mock } from 'typemoq';
import { TranslatorServiceBase } from '../../services/translator/translator.service.base';
import { ApplicationPaths } from '../application/application-paths';
import { Logger } from '../logger';

describe('AlbumSorter', () => {
    let albumModel1: AlbumModel;
    let albumModel2: AlbumModel;
    let albumModel3: AlbumModel;
    let albumModel4: AlbumModel;
    let albumModel5: AlbumModel;
    let albumModel6: AlbumModel;
    let albumModel7: AlbumModel;
    let albumModel8: AlbumModel;
    let albumModel9: AlbumModel;
    let albumModel10: AlbumModel;

    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let applicationPathsMock: IMock<ApplicationPaths>;
    let loggerMock: IMock<Logger>;

    let albumSorter: AlbumSorter;
    let albums: AlbumModel[];

    function createAlbumModel(
        albumTitle: string,
        albumArtists: string[],
        artists: string[],
        year: number,
        dateFileCreated: number,
        dateAdded: number,
        dateLastPlayed: number,
    ): AlbumModel {
        const albumData: AlbumData = new AlbumData();
        albumData.albumTitle = albumTitle;
        albumData.albumArtists = albumArtists.map((x) => `;${x};`).join('');
        albumData.artists = artists.map((x) => `;${x};`).join('');
        albumData.albumKey = `;${albumTitle};;${albumArtists[0]}`;
        albumData.artworkId = '';
        albumData.year = year;
        albumData.dateFileCreated = dateFileCreated;
        albumData.dateAdded = dateAdded;
        albumData.dateLastPlayed = dateLastPlayed;

        return new AlbumModel(albumData, translatorServiceMock.object, applicationPathsMock.object);
    }

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        applicationPathsMock = Mock.ofType<ApplicationPaths>();
        loggerMock = Mock.ofType<Logger>();

        albumModel1 = createAlbumModel('Album 1', ['Artist 10'], ['Artist 1'], 2001, 10, 1, 2);
        albumModel2 = createAlbumModel('Album 2', ['Artist 2'], ['Artist 2'], 2002, 9, 2, 1);
        albumModel3 = createAlbumModel('Album 3', ['Artist 3'], ['Artist 3'], 2003, 8, 3, 3);
        albumModel4 = createAlbumModel('Album 4', ['Artist 4'], ['Artist 4'], 2004, 7, 4, 4);
        albumModel5 = createAlbumModel('Album 5', ['Artist 5'], ['Artist 5'], 2006, 6, 5, 5);
        albumModel6 = createAlbumModel('Album 6', ['Artist 6'], ['Artist 6'], 2005, 1, 10, 6);
        albumModel7 = createAlbumModel('Album 7', ['Artist 7'], ['Artist 7'], 2007, 2, 9, 7);
        albumModel8 = createAlbumModel('Album 8', ['Artist 8'], ['Artist 8'], 2008, 3, 8, 8);
        albumModel9 = createAlbumModel('Album 9', ['Artist 9'], ['Artist 9'], 2009, 4, 7, 10);
        albumModel10 = createAlbumModel('Album 10', ['Artist 1'], ['Artist 10'], 2010, 5, 6, 9);

        albums = [
            albumModel2,
            albumModel10,
            albumModel6,
            albumModel4,
            albumModel9,
            albumModel8,
            albumModel1,
            albumModel7,
            albumModel5,
            albumModel3,
        ];

        albumSorter = new AlbumSorter(loggerMock.object);
    });

    describe('sortByAlbumTitleAscending', () => {
        it('should return an empty collection when undefined is provided', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByAlbumTitleAscending(undefined);

            // Assert
            expect(sortedAlbums.length).toEqual(0);
        });

        it('should return an empty collection if empty is provided', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByAlbumTitleAscending([]);

            // Assert
            expect(sortedAlbums.length).toEqual(0);
        });

        it('should sort by album title ascending', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByAlbumTitleAscending(albums);

            // Assert
            expect(sortedAlbums[0]).toBe(albumModel1);
            expect(sortedAlbums[1]).toBe(albumModel2);
            expect(sortedAlbums[2]).toBe(albumModel3);
            expect(sortedAlbums[3]).toBe(albumModel4);
            expect(sortedAlbums[4]).toBe(albumModel5);
            expect(sortedAlbums[5]).toBe(albumModel6);
            expect(sortedAlbums[6]).toBe(albumModel7);
            expect(sortedAlbums[7]).toBe(albumModel8);
            expect(sortedAlbums[8]).toBe(albumModel9);
            expect(sortedAlbums[9]).toBe(albumModel10);
        });
    });

    describe('sortByAlbumTitleDescending', () => {
        it('should return an empty collection when undefined is provided', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByAlbumTitleDescending(undefined);

            // Assert
            expect(sortedAlbums.length).toEqual(0);
        });

        it('should return an empty collection if empty is provided', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByAlbumTitleDescending([]);

            // Assert
            expect(sortedAlbums.length).toEqual(0);
        });

        it('should sort by album title descending', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByAlbumTitleDescending(albums);

            // Assert
            expect(sortedAlbums[0]).toBe(albumModel10);
            expect(sortedAlbums[1]).toBe(albumModel9);
            expect(sortedAlbums[2]).toBe(albumModel8);
            expect(sortedAlbums[3]).toBe(albumModel7);
            expect(sortedAlbums[4]).toBe(albumModel6);
            expect(sortedAlbums[5]).toBe(albumModel5);
            expect(sortedAlbums[6]).toBe(albumModel4);
            expect(sortedAlbums[7]).toBe(albumModel3);
            expect(sortedAlbums[8]).toBe(albumModel2);
            expect(sortedAlbums[9]).toBe(albumModel1);
        });
    });

    describe('sortByDateAdded', () => {
        it('should return an empty collection when undefined is provided', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByDateAdded(undefined);

            // Assert
            expect(sortedAlbums.length).toEqual(0);
        });

        it('should return an empty collection if empty is provided', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByDateAdded([]);

            // Assert
            expect(sortedAlbums.length).toEqual(0);
        });

        it('should sort by date added', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByDateAdded(albums);

            // Assert
            expect(sortedAlbums[0]).toBe(albumModel6);
            expect(sortedAlbums[1]).toBe(albumModel7);
            expect(sortedAlbums[2]).toBe(albumModel8);
            expect(sortedAlbums[3]).toBe(albumModel9);
            expect(sortedAlbums[4]).toBe(albumModel10);
            expect(sortedAlbums[5]).toBe(albumModel5);
            expect(sortedAlbums[6]).toBe(albumModel4);
            expect(sortedAlbums[7]).toBe(albumModel3);
            expect(sortedAlbums[8]).toBe(albumModel2);
            expect(sortedAlbums[9]).toBe(albumModel1);
        });
    });

    describe('sortByDateCreated', () => {
        it('should return an empty collection when undefined is provided', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByDateCreated(undefined);

            // Assert
            expect(sortedAlbums.length).toEqual(0);
        });

        it('should return an empty collection if empty is provided', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByDateCreated([]);

            // Assert
            expect(sortedAlbums.length).toEqual(0);
        });

        it('should sort by date added', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByDateCreated(albums);

            // Assert
            expect(sortedAlbums[0]).toBe(albumModel1);
            expect(sortedAlbums[1]).toBe(albumModel2);
            expect(sortedAlbums[2]).toBe(albumModel3);
            expect(sortedAlbums[3]).toBe(albumModel4);
            expect(sortedAlbums[4]).toBe(albumModel5);
            expect(sortedAlbums[5]).toBe(albumModel10);
            expect(sortedAlbums[6]).toBe(albumModel9);
            expect(sortedAlbums[7]).toBe(albumModel8);
            expect(sortedAlbums[8]).toBe(albumModel7);
            expect(sortedAlbums[9]).toBe(albumModel6);
        });
    });

    describe('sortByAlbumArtist', () => {
        it('should return an empty collection when undefined is provided', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByAlbumArtist(undefined);

            // Assert
            expect(sortedAlbums.length).toEqual(0);
        });

        it('should return an empty collection if empty is provided', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByAlbumArtist([]);

            // Assert
            expect(sortedAlbums.length).toEqual(0);
        });

        it('should sort by date added', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByAlbumArtist(albums);

            // Assert
            expect(sortedAlbums[0]).toBe(albumModel10);
            expect(sortedAlbums[1]).toBe(albumModel2);
            expect(sortedAlbums[2]).toBe(albumModel3);
            expect(sortedAlbums[3]).toBe(albumModel4);
            expect(sortedAlbums[4]).toBe(albumModel5);
            expect(sortedAlbums[5]).toBe(albumModel6);
            expect(sortedAlbums[6]).toBe(albumModel7);
            expect(sortedAlbums[7]).toBe(albumModel8);
            expect(sortedAlbums[8]).toBe(albumModel9);
            expect(sortedAlbums[9]).toBe(albumModel1);
        });
    });

    describe('sortByYearAscending', () => {
        it('should return an empty collection when undefined is provided', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByYearAscending(undefined);

            // Assert
            expect(sortedAlbums.length).toEqual(0);
        });

        it('should return an empty collection if empty is provided', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByYearAscending([]);

            // Assert
            expect(sortedAlbums.length).toEqual(0);
        });

        it('should sort by date added', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByYearAscending(albums);

            // Assert
            expect(sortedAlbums[0]).toBe(albumModel1);
            expect(sortedAlbums[1]).toBe(albumModel2);
            expect(sortedAlbums[2]).toBe(albumModel3);
            expect(sortedAlbums[3]).toBe(albumModel4);
            expect(sortedAlbums[4]).toBe(albumModel6);
            expect(sortedAlbums[5]).toBe(albumModel5);
            expect(sortedAlbums[6]).toBe(albumModel7);
            expect(sortedAlbums[7]).toBe(albumModel8);
            expect(sortedAlbums[8]).toBe(albumModel9);
            expect(sortedAlbums[9]).toBe(albumModel10);
        });
    });

    describe('sortByYearDescending', () => {
        it('should return an empty collection when undefined is provided', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByYearDescending(undefined);

            // Assert
            expect(sortedAlbums.length).toEqual(0);
        });

        it('should return an empty collection if empty is provided', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByYearAscending([]);

            // Assert
            expect(sortedAlbums.length).toEqual(0);
        });

        it('should sort by date added', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByYearDescending(albums);

            // Assert
            expect(sortedAlbums[0]).toBe(albumModel10);
            expect(sortedAlbums[1]).toBe(albumModel9);
            expect(sortedAlbums[2]).toBe(albumModel8);
            expect(sortedAlbums[3]).toBe(albumModel7);
            expect(sortedAlbums[4]).toBe(albumModel5);
            expect(sortedAlbums[5]).toBe(albumModel6);
            expect(sortedAlbums[6]).toBe(albumModel4);
            expect(sortedAlbums[7]).toBe(albumModel3);
            expect(sortedAlbums[8]).toBe(albumModel2);
            expect(sortedAlbums[9]).toBe(albumModel1);
        });
    });

    describe('sortByDateLastPlayed', () => {
        it('should return an empty collection when undefined is provided', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByDateLastPlayed(undefined);

            // Assert
            expect(sortedAlbums.length).toEqual(0);
        });

        it('should return an empty collection if empty is provided', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByDateLastPlayed([]);

            // Assert
            expect(sortedAlbums.length).toEqual(0);
        });

        it('should sort by date added', () => {
            // Arrange

            // Act
            const sortedAlbums: AlbumModel[] = albumSorter.sortByDateLastPlayed(albums);

            // Assert
            expect(sortedAlbums[0]).toBe(albumModel9);
            expect(sortedAlbums[1]).toBe(albumModel10);
            expect(sortedAlbums[2]).toBe(albumModel8);
            expect(sortedAlbums[3]).toBe(albumModel7);
            expect(sortedAlbums[4]).toBe(albumModel6);
            expect(sortedAlbums[5]).toBe(albumModel5);
            expect(sortedAlbums[6]).toBe(albumModel4);
            expect(sortedAlbums[7]).toBe(albumModel3);
            expect(sortedAlbums[8]).toBe(albumModel1);
            expect(sortedAlbums[9]).toBe(albumModel2);
        });
    });
});
