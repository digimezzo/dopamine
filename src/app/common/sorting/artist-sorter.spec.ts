import { IMock, Mock } from 'typemoq';
import { ArtistModel } from '../../services/artist/artist-model';
import { TranslatorServiceBase } from '../../services/translator/translator.service.base';
import { ArtistSorter } from './artist-sorter';
import { Logger } from '../logger';
import { ApplicationPaths } from '../application/application-paths';

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

    let loggerMock: IMock<Logger>;

    let artistSorter: ArtistSorter;
    let artists: ArtistModel[];

    beforeEach(() => {
        loggerMock = Mock.ofType<Logger>();

        artistModel1 = createArtistModel('Artist1');
        artistModel2 = createArtistModel('Artist2');
        artistModel3 = createArtistModel('Artist3');
        artistModel4 = createArtistModel('Artist4');
        artistModel5 = createArtistModel('Artist5');
        artistModel6 = createArtistModel('Artist6');
        artistModel7 = createArtistModel('Artist7');
        artistModel8 = createArtistModel('Artist8');
        artistModel9 = createArtistModel('Artist9');
        artistModel10 = createArtistModel('Artist10');
        artistModel11 = createArtistModel('');
        artistModel12 = createArtistModel('Артист');

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

    function createArtistModel(artistName: string, ignoredPrefixes: string[] = []): ArtistModel {
        return new ArtistModel(
            artistName,
            undefined,
            Mock.ofType<TranslatorServiceBase>().object,
            Mock.ofType<ApplicationPaths>().object,
            ignoredPrefixes,
        );
    }

    it('should sort by prefix-free names in both directions', () => {
        const prefixes = ['The', 'A'];
        const prefixedArtists = ['The Who', 'Therapy?', 'The Beatles', 'A Tribe Called Quest', 'ABBA'].map((name) =>
            createArtistModel(name, prefixes),
        );
        const ascending = ['ABBA', 'The Beatles', 'Therapy?', 'A Tribe Called Quest', 'The Who'];
        expect(artistSorter.sortAscending(prefixedArtists).map((artist) => artist.name)).toEqual(ascending);
        expect(artistSorter.sortDescending(prefixedArtists).map((artist) => artist.name)).toEqual([...ascending].reverse());
    });

    it('should compute each artist sort key only once per sort without retaining stale names', () => {
        const firstArtist = createArtistModel('The Zombies', ['The']);
        const secondArtist = createArtistModel('ABBA', ['The']);
        const firstGetter = jest.spyOn(firstArtist, 'sortableName', 'get');
        const secondGetter = jest.spyOn(secondArtist, 'sortableName', 'get');
        const input = [firstArtist, secondArtist];

        expect(artistSorter.sortAscending(input)).toEqual([secondArtist, firstArtist]);
        expect(firstGetter).toHaveBeenCalledTimes(1);
        expect(secondGetter).toHaveBeenCalledTimes(1);
        expect(input).toEqual([firstArtist, secondArtist]);

        firstArtist.name = 'The Aardvarks';
        expect(artistSorter.sortAscending(input)).toEqual([firstArtist, secondArtist]);
        expect(firstGetter).toHaveBeenCalledTimes(2);
        expect(secondGetter).toHaveBeenCalledTimes(2);

        expect(artistSorter.sortDescending(input)).toEqual([secondArtist, firstArtist]);
        expect(firstGetter).toHaveBeenCalledTimes(3);
        expect(secondGetter).toHaveBeenCalledTimes(3);
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
