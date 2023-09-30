import { IMock, It, Mock, Times } from 'typemoq';
import { BaseDesktop } from '../../common/io/base-desktop';
import { ArtistInformation } from './artist-information';

describe('ArtistInformation', () => {
    let desktopMock: IMock<BaseDesktop>;

    beforeEach(() => {
        desktopMock = Mock.ofType<BaseDesktop>();
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

    describe('isEmpty', () => {
        it('should be true when instance is empty', () => {
            // Arrange
            const artist: ArtistInformation = new ArtistInformation(undefined, '', '', '', '');

            // Act, Assert
            expect(artist.isEmpty).toBeTruthy();
        });

        it('should be false when instance is not empty', () => {
            // Arrange
            const artist: ArtistInformation = new ArtistInformation(desktopMock.object, 'name', 'url', 'imageUrl', 'biography');

            // Act, Assert
            expect(artist.isEmpty).toBeFalsy();
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

    describe('browseToUrl', () => {
        it('should browse to url when not empty', () => {
            // Arrange
            const artist: ArtistInformation = new ArtistInformation(desktopMock.object, 'name', 'url', 'imageUrl', 'biography');

            // Act
            artist.browseToUrl();

            // Assert
            desktopMock.verify((x) => x.openLinkAsync('url'), Times.once());
        });

        it('should not browse to url when empty', () => {
            // Arrange
            const artist: ArtistInformation = ArtistInformation.empty();

            // Act
            artist.browseToUrl();

            // Assert
            desktopMock.verify((x) => x.openLinkAsync(It.isAny()), Times.never());
        });
    });
});
