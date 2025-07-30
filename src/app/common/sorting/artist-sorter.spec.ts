import { IMock, Mock } from 'typemoq';
import { ArtistModel } from '../../services/artist/artist-model';
import { TranslatorServiceBase } from '../../services/translator/translator.service.base';
import { ArtistSorter } from './artist-sorter';
import { Logger } from '../logger';

describe('ArtistSorter', () => {
    let artistModel1: ArtistModel;
    let artistModel2: ArtistModel;
    let artistModel3: ArtistModel;
    let artistModel4: ArtistModel;
    let artistModel5: ArtistModel;
    let artistModel6: ArtistModel;
    let artistModel7: ArtistModel;
    let artistModel8: ArtistModel;
    let artistModel9: ArtistModel;
    let artistModel10: ArtistModel;
    let artistModel11: ArtistModel;
    let artistModel12: ArtistModel;

    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let loggerMock: IMock<Logger>;

    let artistSorter: ArtistSorter;
    let artists: ArtistModel[];

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        loggerMock = Mock.ofType<Logger>();

        artistModel1 = new ArtistModel('Artist1', translatorServiceMock.object);
        artistModel2 = new ArtistModel('Artist2', translatorServiceMock.object);
        artistModel3 = new ArtistModel('Artist3', translatorServiceMock.object);
        artistModel4 = new ArtistModel('Artist4', translatorServiceMock.object);
        artistModel5 = new ArtistModel('Artist5', translatorServiceMock.object);
        artistModel6 = new ArtistModel('Artist6', translatorServiceMock.object);
        artistModel7 = new ArtistModel('Artist7', translatorServiceMock.object);
        artistModel8 = new ArtistModel('Artist8', translatorServiceMock.object);
        artistModel9 = new ArtistModel('Artist9', translatorServiceMock.object);
        artistModel10 = new ArtistModel('Artist10', translatorServiceMock.object);
        artistModel11 = new ArtistModel('', translatorServiceMock.object);
        artistModel12 = new ArtistModel('Артист', translatorServiceMock.object);

        artists = [
            artistModel2,
            artistModel10,
            artistModel6,
            artistModel4,
            artistModel9,
            artistModel8,
            artistModel1,
            artistModel7,
            artistModel5,
            artistModel11,
            artistModel12,
            artistModel3,
        ];

        artistSorter = new ArtistSorter(loggerMock.object);
    });

    describe('sortAscending', () => {
        it('should return an empty collection when undefined is provided', () => {
            // Arrange

            // Act
            const sortedArtists: ArtistModel[] = artistSorter.sortAscending(undefined);

            // Assert
            expect(sortedArtists.length).toEqual(0);
        });

        it('should return an empty collection if empty is provided', () => {
            // Arrange

            // Act
            const sortedArtists: ArtistModel[] = artistSorter.sortAscending([]);

            // Assert
            expect(sortedArtists.length).toEqual(0);
        });

        it('should sort ascending', () => {
            // Arrange

            // Act
            const sortedArtists: ArtistModel[] = artistSorter.sortAscending(artists);

            // Assert
            expect(sortedArtists.length).toEqual(12);
            expect(sortedArtists[0]).toBe(artistModel11);
            expect(sortedArtists[1]).toBe(artistModel12);
            expect(sortedArtists[2]).toBe(artistModel1);
            expect(sortedArtists[3]).toBe(artistModel2);
            expect(sortedArtists[4]).toBe(artistModel3);
            expect(sortedArtists[5]).toBe(artistModel4);
            expect(sortedArtists[6]).toBe(artistModel5);
            expect(sortedArtists[7]).toBe(artistModel6);
            expect(sortedArtists[8]).toBe(artistModel7);
            expect(sortedArtists[9]).toBe(artistModel8);
            expect(sortedArtists[10]).toBe(artistModel9);
            expect(sortedArtists[11]).toBe(artistModel10);
        });
    });

    describe('sortDescending', () => {
        it('should return an empty collection if undefined is provided', () => {
            // Arrange

            // Act
            const sortedArtists: ArtistModel[] = artistSorter.sortDescending(undefined);

            // Assert
            expect(sortedArtists.length).toEqual(0);
        });

        it('should return an empty collection if empty is provided', () => {
            // Arrange

            // Act
            const sortedArtists: ArtistModel[] = artistSorter.sortDescending([]);

            // Assert
            expect(sortedArtists.length).toEqual(0);
        });

        it('should sort descending', () => {
            // Arrange

            // Act
            const sortedArtists: ArtistModel[] = artistSorter.sortDescending(artists);

            // Assert
            expect(sortedArtists.length).toEqual(12);
            expect(sortedArtists[0]).toBe(artistModel10);
            expect(sortedArtists[1]).toBe(artistModel9);
            expect(sortedArtists[2]).toBe(artistModel8);
            expect(sortedArtists[3]).toBe(artistModel7);
            expect(sortedArtists[4]).toBe(artistModel6);
            expect(sortedArtists[5]).toBe(artistModel5);
            expect(sortedArtists[6]).toBe(artistModel4);
            expect(sortedArtists[7]).toBe(artistModel3);
            expect(sortedArtists[8]).toBe(artistModel2);
            expect(sortedArtists[9]).toBe(artistModel1);
            expect(sortedArtists[10]).toBe(artistModel12);
            expect(sortedArtists[11]).toBe(artistModel11);
        });
    });
});
