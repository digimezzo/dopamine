import { PlaylistDecodeResult } from './playlist-decode-result';
import { PlaylistEntry } from './playlist-entry';

describe('PlaylistDecodeResult', () => {
    beforeEach(() => {});

    describe('constructor', () => {
        it('should create', () => {
            // Arrange
            const playlistEntry1: PlaylistEntry = new PlaylistEntry('Reference path 1', 'Decoded Path 1');
            const playlistEntry2: PlaylistEntry = new PlaylistEntry('Reference path 2', 'Decoded Path 2');
            const playlistEntries: PlaylistEntry[] = [playlistEntry1, playlistEntry2];

            // Act
            const playlistDecodeResult: PlaylistDecodeResult = new PlaylistDecodeResult('Playlist name', playlistEntries);

            // Assert
            expect(playlistDecodeResult).toBeDefined();
        });

        it('should set playlistName', () => {
            // Arrange
            const playlistEntry1: PlaylistEntry = new PlaylistEntry('Reference path 1', 'Decoded Path 1');
            const playlistEntry2: PlaylistEntry = new PlaylistEntry('Reference path 2', 'Decoded Path 2');
            const playlistEntries: PlaylistEntry[] = [playlistEntry1, playlistEntry2];

            // Act
            const playlistDecodeResult: PlaylistDecodeResult = new PlaylistDecodeResult('Playlist name', playlistEntries);

            // Assert
            expect(playlistDecodeResult.playlistName).toEqual('Playlist name');
        });

        it('should return no paths if playlistEntries is undefined', () => {
            // Arrange

            // Act
            const playlistDecodeResult: PlaylistDecodeResult = new PlaylistDecodeResult('Playlist name', undefined);

            // Assert
            expect(playlistDecodeResult.paths.length).toEqual(0);
        });

        it('should return no paths if playlistEntries is empty', () => {
            // Arrange

            // Act
            const playlistDecodeResult: PlaylistDecodeResult = new PlaylistDecodeResult('Playlist name', []);

            // Assert
            expect(playlistDecodeResult.paths.length).toEqual(0);
        });

        it('should return the decodedPaths in playlistEntries', () => {
            // Arrange
            const playlistEntry1: PlaylistEntry = new PlaylistEntry('Reference path 1', 'Decoded Path 1');
            const playlistEntry2: PlaylistEntry = new PlaylistEntry('Reference path 2', 'Decoded Path 2');
            const playlistEntries: PlaylistEntry[] = [playlistEntry1, playlistEntry2];

            // Act
            const playlistDecodeResult: PlaylistDecodeResult = new PlaylistDecodeResult('Playlist name', playlistEntries);

            // Assert
            expect(playlistDecodeResult.paths.length).toEqual(2);
            expect(playlistDecodeResult.paths[0]).toEqual('Decoded Path 1');
            expect(playlistDecodeResult.paths[1]).toEqual('Decoded Path 2');
        });
    });
});
