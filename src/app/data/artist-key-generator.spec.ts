import { ArtistsKeyGenerator } from './artists-key-generator';
import { IMock, It, Mock } from 'typemoq';
import { ArtistSplitter } from '../services/artist/artist-splitter';

describe('ArtistsKeyGenerator', () => {
    let artistSplitterMock: IMock<ArtistSplitter>;
    let artistkeyGenerator: ArtistsKeyGenerator;

    beforeEach(() => {
        artistSplitterMock = Mock.ofType<ArtistSplitter>();
        artistkeyGenerator = new ArtistsKeyGenerator(artistSplitterMock.object);
    });

    describe('generateArtistsKey', () => {
        it('should generate an empty artist key if artist is undefined', () => {
            // Arrange, Act
            const artistKey: string = artistkeyGenerator.generateArtistsKey(undefined);

            // Assert
            expect(artistKey).toEqual('');
        });

        it('should generate an empty artist key if artists is empty', () => {
            // Arrange, Act
            const artistKey: string = artistkeyGenerator.generateArtistsKey('');

            // Assert
            expect(artistKey).toEqual('');
        });

        it('should generate a key from delimited artists', () => {
            // Arrange
            artistSplitterMock.setup((x) => x.splitArtists(It.isAny())).returns(() => ['Metallica', 'Aerosmith']);

            // Act
            const artistKey: string = artistkeyGenerator.generateArtistsKey(';Metallica;Aerosmith;');

            // Assert
            expect(artistKey).toEqual(';metallica;;aerosmith;');
        });

        it('should generate a key from splitted artists', () => {
            // Arrange
            artistSplitterMock.setup((x) => x.splitArtists(It.isAny())).returns(() => ['Metallica', 'Aerosmith', 'Nightwish']);

            // Act
            const artistKey: string = artistkeyGenerator.generateArtistsKey(';Metallica;Aerosmith;Nightwish');

            // Assert
            expect(artistKey).toEqual(';metallica;;aerosmith;;nightwish;');
        });

        it('should ignore duplicate artists', () => {
            // Arrange
            artistSplitterMock.setup((x) => x.splitArtists(It.isAny())).returns(() => ['Metallica']);

            // Act
            const artistKey: string = artistkeyGenerator.generateArtistsKey(';Metallica;metaLLica;');

            // Assert
            expect(artistKey).toEqual(';metallica;');
        });
    });
});
