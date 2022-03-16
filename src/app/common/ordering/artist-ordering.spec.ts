import { IMock, Mock } from 'typemoq';
import { ArtistModel } from '../../services/artist/artist-model';
import { BaseTranslatorService } from '../../services/translator/base-translator.service';
import { ArtistOrdering } from './artist-ordering';

describe('ArtistOrdering', () => {
    let artistModel1: ArtistModel;
    let artistModel2: ArtistModel;
    let artistModel3: ArtistModel;
    let artistModel4: ArtistModel;

    let translatorServiceMock: IMock<BaseTranslatorService>;

    let artistOrdering: ArtistOrdering;
    let artists: ArtistModel[];

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();

        artistModel1 = new ArtistModel('Artist1', translatorServiceMock.object);
        artistModel2 = new ArtistModel('Artist2', translatorServiceMock.object);
        artistModel3 = new ArtistModel('Artist3', translatorServiceMock.object);
        artistModel4 = new ArtistModel('Artist4', translatorServiceMock.object);

        artists = [artistModel2, artistModel4, artistModel1, artistModel3];

        artistOrdering = new ArtistOrdering();
    });

    describe('getTracksOrderedByTitleAscending', () => {
        it('should return an empty collection if artistsToOrder is undefined', () => {
            // Arrange

            // Act
            const orderedArtists: ArtistModel[] = artistOrdering.getArtistsOrderedAscending(undefined);

            // Assert
            expect(orderedArtists.length).toEqual(0);
        });

        it('should return an empty collection if artistsToOrder is empty', () => {
            // Arrange

            // Act
            const orderedArtists: ArtistModel[] = artistOrdering.getArtistsOrderedAscending([]);

            // Assert
            expect(orderedArtists.length).toEqual(0);
        });

        it('should order tracks by title ascending', () => {
            // Arrange

            // Act
            const orderedArtists: ArtistModel[] = artistOrdering.getArtistsOrderedAscending(artists);

            // Assert
            expect(orderedArtists[0]).toBe(artistModel1);
            expect(orderedArtists[1]).toBe(artistModel2);
            expect(orderedArtists[2]).toBe(artistModel3);
            expect(orderedArtists[3]).toBe(artistModel4);
        });
    });

    describe('getTracksOrderedByTitleDescending', () => {
        it('should return an empty collection if artistsToOrder is undefined', () => {
            // Arrange

            // Act
            const orderedArtists: ArtistModel[] = artistOrdering.getArtistsOrderedDescending(undefined);

            // Assert
            expect(orderedArtists.length).toEqual(0);
        });

        it('should return an empty collection if artistsToOrder is empty', () => {
            // Arrange

            // Act
            const orderedArtists: ArtistModel[] = artistOrdering.getArtistsOrderedDescending([]);

            // Assert
            expect(orderedArtists.length).toEqual(0);
        });

        it('should order tracks by title descending', () => {
            // Arrange

            // Act
            const orderedArtists: ArtistModel[] = artistOrdering.getArtistsOrderedDescending(artists);

            // Assert
            expect(orderedArtists[0]).toBe(artistModel4);
            expect(orderedArtists[1]).toBe(artistModel3);
            expect(orderedArtists[2]).toBe(artistModel2);
            expect(orderedArtists[3]).toBe(artistModel1);
        });
    });
});
