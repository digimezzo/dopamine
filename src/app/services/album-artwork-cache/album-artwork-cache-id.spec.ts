import { IMock, Mock } from 'typemoq';
import { GuidFactory } from '../../common/guid.factory';
import { AlbumArtworkCacheId } from './album-artwork-cache-id';

describe('AlbumArtworkCacheId', () => {
    let guidFactoryMock: IMock<GuidFactory>;

    beforeEach(() => {
        guidFactoryMock = Mock.ofType<GuidFactory>();
        guidFactoryMock.setup((x) => x.create()).returns(() => '688af0b5-8c41-4a10-9d3e-2ba13a0d918d');
    });

    function createInstance(): AlbumArtworkCacheId {
        return new AlbumArtworkCacheId(guidFactoryMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const instance: AlbumArtworkCacheId = createInstance();

            // Assert
            expect(instance).toBeDefined();
        });

        it('should define id', () => {
            // Arrange, Act
            const instance: AlbumArtworkCacheId = createInstance();

            // Assert
            expect(instance.id).toBeDefined();
        });

        it('should create id that starts with album-', () => {
            // Arrange, Act
            const instance: AlbumArtworkCacheId = createInstance();

            // Assert
            expect(instance.id.startsWith('album-')).toBeTruthy();
        });

        it('should create id that has a length of 42 characters', () => {
            // Arrange, Act
            const instance: AlbumArtworkCacheId = createInstance();

            // Assert
            expect(instance.id.length).toEqual(42);
        });
    });
});