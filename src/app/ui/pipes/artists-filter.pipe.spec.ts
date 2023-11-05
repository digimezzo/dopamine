import { IMock, It, Mock } from 'typemoq';
import { ArtistModel } from '../services/artist/artist-model';
import { BaseSearchService } from '../services/search/base-search.service';
import { BaseTranslatorService } from '../services/translator/base-translator.service';
import { ArtistFilterPipe } from './artists-filter.pipe';

describe('ArtistFilterPipe', () => {
    let searchServiceMock: IMock<BaseSearchService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;

    function createPipe(): ArtistFilterPipe {
        return new ArtistFilterPipe(searchServiceMock.object);
    }

    function createArtists(): ArtistModel[] {
        const artist1: ArtistModel = new ArtistModel('artist1', translatorServiceMock.object);
        const artist2: ArtistModel = new ArtistModel('artist2', translatorServiceMock.object);

        return [artist1, artist2];
    }

    beforeEach(() => {
        searchServiceMock = Mock.ofType<BaseSearchService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
    });

    describe('transform', () => {
        it('should return the given artists if textToContain is undefined', () => {
            // Arrange
            const artists: ArtistModel[] = createArtists();
            const pipe: ArtistFilterPipe = createPipe();

            // Act
            const filteredArtists: ArtistModel[] = pipe.transform(artists, undefined);

            // Assert
            expect(filteredArtists).toEqual(artists);
        });

        it('should return the given artists if textToContain is empty', () => {
            // Arrange
            const artists: ArtistModel[] = createArtists();
            const pipe: ArtistFilterPipe = createPipe();

            // Act
            const filteredArtists: ArtistModel[] = pipe.transform(artists, '');

            // Assert
            expect(filteredArtists).toEqual(artists);
        });

        it('should return the given artists if textToContain is space', () => {
            // Arrange
            const artists: ArtistModel[] = createArtists();
            const pipe: ArtistFilterPipe = createPipe();

            // Act
            const filteredArtists: ArtistModel[] = pipe.transform(artists, ' ');

            // Assert
            expect(filteredArtists).toEqual(artists);
        });

        it('should return only artists with a name containing the search text', () => {
            // Arrange

            const artists: ArtistModel[] = createArtists();
            searchServiceMock.setup((x) => x.matchesSearchText('artist1', It.isAny())).returns(() => true);
            searchServiceMock.setup((x) => x.matchesSearchText('artist2', It.isAny())).returns(() => false);
            const pipe: ArtistFilterPipe = createPipe();

            // Act
            const filteredArtists: ArtistModel[] = pipe.transform(artists, 'dummy');

            // Assert
            expect(filteredArtists.length).toEqual(1);
            expect(filteredArtists[0]).toEqual(artists[0]);
        });

        it('should return no artists if none of their names contain the search text', () => {
            // Arrange

            const artists: ArtistModel[] = createArtists();
            searchServiceMock.setup((x) => x.matchesSearchText('artist1', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('artist2', It.isAny())).returns(() => false);
            const pipe: ArtistFilterPipe = createPipe();

            // Act
            const filteredArtists: ArtistModel[] = pipe.transform(artists, 'dummy');

            // Assert
            expect(filteredArtists.length).toEqual(0);
        });
    });
});
