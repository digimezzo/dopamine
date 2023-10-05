import { IMock, Mock } from 'typemoq';
import { GuidFactory } from '../../common/guid.factory';
import { AlbumArtworkCacheId } from './album-artwork-cache-id';

describe('AlbumArtworkCacheId', () => {
    let albumArtworkCacheId: AlbumArtworkCacheId;
    let guidFactoryMock: IMock<GuidFactory>;

    beforeEach(() => {
        guidFactoryMock = Mock.ofType<GuidFactory>();

        albumArtworkCacheId = new AlbumArtworkCacheId(guidFactoryMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(albumArtworkCacheId).toBeDefined();
        });

        it('should define id', () => {
            // Arrange

            // Act

            // Assert
            expect(albumArtworkCacheId.id).toBeDefined();
        });

        it('should create id that starts with album-', () => {
            // Arrange

            // Act

            // Assert
            expect(albumArtworkCacheId.id.startsWith('album-')).toBeTruthy();
        });

        it('should create id that has a length of 42 characters', () => {
            // Arrange

            // Act

            // Assert
            expect(albumArtworkCacheId.id.length).toEqual(42);
        });

        it('should create unique ids', () => {
            // Arrange

            // Act
            const albumArtworkCacheId2: AlbumArtworkCacheId = new AlbumArtworkCacheId(guidFactoryMock.object);

            // Assert
            expect(albumArtworkCacheId.id).not.toEqual(albumArtworkCacheId2.id);
        });
    });
});
