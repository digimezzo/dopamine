import { IMock, Mock } from 'typemoq';
import { GuidFactory } from '../../common/guid.factory';
import { ArtistArtworkCacheId } from './artist-artwork-cache-id';

describe('ArtistArtworkCacheId', () => {
    let guidFactoryMock: IMock<GuidFactory>;

    beforeEach(() => {
        guidFactoryMock = Mock.ofType<GuidFactory>();
        guidFactoryMock.setup((x) => x.create()).returns(() => '688af0b5-8c41-4a10-9d3e-2ba13a0d918d');
    });

    function createInstance(): ArtistArtworkCacheId {
        return new ArtistArtworkCacheId(guidFactoryMock.object);
    }

    function createDefaultInstance(): ArtistArtworkCacheId {
        return new ArtistArtworkCacheId();
    }

    describe('constructor with factory', () => {
        it('should create', () => {
            // Arrange, Act
            const instance: ArtistArtworkCacheId = createInstance();

            // Assert
            expect(instance).toBeDefined();
        });

        it('should define id', () => {
            // Arrange, Act
            const instance: ArtistArtworkCacheId = createInstance();

            // Assert
            expect(instance.id).toBeDefined();
        });

        it('should create id that starts with artist-', () => {
            // Arrange, Act
            const instance: ArtistArtworkCacheId = createInstance();

            // Assert
            expect(instance.id.startsWith('artist-')).toBeTruthy();
        });

        it('should create id that has a length of 42 characters', () => {
            // Arrange, Act
            const instance: ArtistArtworkCacheId = createInstance();

            // Assert
            expect(instance.id.length).toEqual(43);
        });
    });

    describe('default constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const instance: ArtistArtworkCacheId = createDefaultInstance();

            // Assert
            expect(instance).toBeDefined();
        });

        it('should create default id', () => {
            // Arrange, Act
            const instance: ArtistArtworkCacheId = createDefaultInstance();

            // Assert
            expect(instance.id).toEqual(ArtistArtworkCacheId.defaultArtworkId);
        });
    });
});