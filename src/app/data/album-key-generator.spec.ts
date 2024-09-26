import { AlbumKeyGenerator } from './album-key-generator';

describe('AlbumKeyGenerator', () => {
    let albumkeyGenerator: AlbumKeyGenerator;

    beforeEach(() => {
        albumkeyGenerator = new AlbumKeyGenerator();
    });

    describe('generateAlbumKey', () => {
        it('should generate an empty album key if album title is undefined', () => {
            // Arrange, Act
            const albumKey: string = albumkeyGenerator.generateAlbumKey(undefined, ['Artist 1', 'Artist 2']);

            // Assert
            expect(albumKey).toEqual('');
        });

        it('should generate an empty album key if album title is empty', () => {
            // Arrange, Act
            const albumKey: string = albumkeyGenerator.generateAlbumKey('', ['Artist 1', 'Artist 2']);

            // Assert
            expect(albumKey).toEqual('');
        });

        it('should generate an empty album key if album title is a space', () => {
            // Arrange, Act
            const albumKey: string = albumkeyGenerator.generateAlbumKey(' ', ['Artist 1', 'Artist 2']);

            // Assert
            expect(albumKey).toEqual('');
        });

        it('should generate an empty album key if album title is a multiple spaces', () => {
            // Arrange, Act
            const albumKey: string = albumkeyGenerator.generateAlbumKey('    ', ['Artist 1', 'Artist 2']);

            // Assert
            expect(albumKey).toEqual('');
        });

        it('should generate an album key using only the album title if album artists is undefined', () => {
            // Arrange, Act
            const albumKey: string = albumkeyGenerator.generateAlbumKey('The album title', undefined);

            // Assert
            expect(albumKey).toEqual(';The album title;');
        });

        it('should generate an album key using only the album title if album artists is empty', () => {
            // Arrange, Act
            const albumKey: string = albumkeyGenerator.generateAlbumKey('The album title', []);

            // Assert
            expect(albumKey).toEqual(';The album title;');
        });

        it('should generate an album key using album title and album artist given an album title and 1 album artist', () => {
            // Arrange, Act
            const albumKey: string = albumkeyGenerator.generateAlbumKey('The album title', ['Album artist 1']);

            // Assert
            expect(albumKey).toEqual(';The album title;;album artist 1;');
        });

        it('should generate an album key using album title and multiple album artists given an album title and multiple album artists', () => {
            // Arrange, Act
            const albumKey: string = albumkeyGenerator.generateAlbumKey('The album title', ['Album artist 1', 'Album artist 2']);

            // Assert
            expect(albumKey).toEqual(';The album title;;album artist 1;;album artist 2;');
        });
    });
});
