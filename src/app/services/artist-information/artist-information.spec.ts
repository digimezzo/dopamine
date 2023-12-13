import { IMock, It, Mock, Times } from 'typemoq';
import { ArtistInformation } from './artist-information';
import { DesktopBase } from '../../common/io/desktop.base';

describe('ArtistInformation', () => {
    let desktopMock: IMock<DesktopBase>;

    beforeEach(() => {
        desktopMock = Mock.ofType<DesktopBase>();
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const artist: ArtistInformation = new ArtistInformation(desktopMock.object, 'name', 'url', 'imageUrl', 'biography');

            // Assert
            expect(artist).toBeDefined();
        });

        it('should set properties', () => {
            // Arrange

            // Act
            const artist: ArtistInformation = new ArtistInformation(desktopMock.object, 'name', 'url', 'imageUrl', 'biography');

            // Assert
            expect(artist.name).toEqual('name');
            expect(artist.url).toEqual('url');
            expect(artist.imageUrl).toEqual('imageUrl');
            expect(artist.biography).toEqual('biography');
        });
    });

    describe('empty', () => {
        it('should create instance with empty properties', () => {
            // Arrange

            // Act
            const artist: ArtistInformation = ArtistInformation.empty();

            // Assert
            expect(artist).toBeDefined();
            expect(artist.name).toEqual('');
            expect(artist.name).toEqual('');
            expect(artist.name).toEqual('');
            expect(artist.name).toEqual('');
        });
    });

    describe('hasBiography', () => {
        it('should be true when there is a biography', () => {
            // Arrange
            const artist: ArtistInformation = new ArtistInformation(desktopMock.object, 'name', 'url', 'imageUrl', 'biography');

            // Act, Assert
            expect(artist.hasBiography).toBeTruthy();
        });

        it('should be false when there is no biography', () => {
            // Arrange
            const artist: ArtistInformation = new ArtistInformation(desktopMock.object, 'name', 'url', 'imageUrl', '');

            // Act, Assert
            expect(artist.hasBiography).toBeFalsy();
        });
    });

    describe('hasSimilarArtists', () => {
        it('should be true when there are similar artists', () => {
            // Arrange
            const artist: ArtistInformation = new ArtistInformation(desktopMock.object, 'name', 'url', 'imageUrl', 'biography');
            artist.addSimilarArtist('similarName', 'similarUrl', 'similarImageUrl');

            // Act, Assert
            expect(artist.hasSimilarArtists).toBeTruthy();
        });

        it('should be false when there are no similar artists', () => {
            // Arrange
            const artist: ArtistInformation = new ArtistInformation(desktopMock.object, 'name', 'url', 'imageUrl', 'biography');

            // Act, Assert
            expect(artist.hasSimilarArtists).toBeFalsy();
        });
    });

    describe('addSimilarArtist', () => {
        it('should add a similar artist', () => {
            // Arrange
            const artist: ArtistInformation = new ArtistInformation(desktopMock.object, 'name', 'url', 'imageUrl', 'biography');
            artist.addSimilarArtist('similarName', 'similarUrl', 'similarImageUrl');

            // Act, Assert
            expect(artist.hasSimilarArtists).toBeTruthy();
            expect(artist.similarArtists.length).toEqual(1);
            expect(artist.similarArtists[0].name).toEqual('similarName');
            expect(artist.similarArtists[0].url).toEqual('similarUrl');
            expect(artist.similarArtists[0].imageUrl).toEqual('similarImageUrl');
        });
    });

    describe('browseToUrlAsync', () => {
        it('should browse to url when desktop is defined and url is not empty', async () => {
            // Arrange
            const artist: ArtistInformation = new ArtistInformation(desktopMock.object, 'name', 'url', 'imageUrl', 'biography');

            // Act
            await artist.browseToUrlAsync();

            // Assert
            desktopMock.verify((x) => x.openLinkAsync('url'), Times.once());
        });

        it('should not browse to url when desktop is undefined', async () => {
            // Arrange
            const artist: ArtistInformation = new ArtistInformation(undefined, 'name', 'url', 'imageUrl', 'biography');

            // Act
            await artist.browseToUrlAsync();

            // Assert
            desktopMock.verify((x) => x.openLinkAsync(It.isAny()), Times.never());
        });
        it('should not browse to url when url is empty', async () => {
            // Arrange
            const artist: ArtistInformation = new ArtistInformation(desktopMock.object, 'name', '', 'imageUrl', 'biography');

            // Act
            await artist.browseToUrlAsync();

            // Assert
            desktopMock.verify((x) => x.openLinkAsync(It.isAny()), Times.never());
        });
    });
});
