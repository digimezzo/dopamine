import { IndexableTrack } from './indexable-track';
import { IndexablePath } from './indexable-path';

describe('IndexableTrack', () => {
    describe('constructor', () => {
        it('should set path', () => {
            // Arrange
            const indexablePath: IndexablePath = new IndexablePath('/home/user/Music/Track.mp3', 123456789, 1);
            const indexableTrack: IndexableTrack = new IndexableTrack(indexablePath);

            // Act, Assert
            expect(indexableTrack.path).toEqual('/home/user/Music/Track.mp3');
        });

        it('should set dateModifiedTicks', () => {
            // Arrange
            const indexablePath: IndexablePath = new IndexablePath('/home/user/Music/Track.mp3', 123456789, 1);
            const indexableTrack: IndexableTrack = new IndexableTrack(indexablePath);

            // Act, Assert
            expect(indexableTrack.dateModifiedTicks).toEqual(123456789);
        });

        it('should set folderId', () => {
            // Arrange
            const indexablePath: IndexablePath = new IndexablePath('/home/user/Music/Track.mp3', 123456789, 1);
            const indexableTrack: IndexableTrack = new IndexableTrack(indexablePath);

            // Act, Assert
            expect(indexableTrack.folderId).toEqual(1);
        });

        it('should define track all properties', () => {
            // Arrange
            const indexablePath: IndexablePath = new IndexablePath('/home/user/Music/Track.mp3', 123456789, 1);
            const indexableTrack: IndexableTrack = new IndexableTrack(indexablePath);

            // Act, Assert
            expect(indexableTrack.folderId).toEqual(1);
            expect(indexableTrack.trackId).toEqual(0);
            expect(indexableTrack.artists).toEqual('');
            expect(indexableTrack.genres).toEqual('');
            expect(indexableTrack.albumTitle).toEqual('');
            expect(indexableTrack.albumArtists).toEqual('');
            expect(indexableTrack.albumKey).toEqual('');
            expect(indexableTrack.fileName).toEqual('');
            expect(indexableTrack.mimeType).toEqual('');
            expect(indexableTrack.fileSize).toEqual(0);
            expect(indexableTrack.bitRate).toEqual(0);
            expect(indexableTrack.sampleRate).toEqual(0);
            expect(indexableTrack.trackTitle).toEqual('');
            expect(indexableTrack.trackNumber).toEqual(0);
            expect(indexableTrack.trackCount).toEqual(0);
            expect(indexableTrack.discNumber).toEqual(0);
            expect(indexableTrack.discCount).toEqual(0);
            expect(indexableTrack.duration).toEqual(0);
            expect(indexableTrack.year).toEqual(0);
            expect(indexableTrack.hasLyrics).toEqual(0);
            expect(indexableTrack.dateAdded).toEqual(0);
            expect(indexableTrack.dateFileCreated).toEqual(0);
            expect(indexableTrack.dateLastSynced).toEqual(0);
            expect(indexableTrack.dateFileModified).toEqual(0);
            expect(indexableTrack.needsIndexing).toEqual(0);
            expect(indexableTrack.needsAlbumArtworkIndexing).toEqual(0);
            expect(indexableTrack.indexingSuccess).toEqual(1);
            expect(indexableTrack.indexingFailureReason).toEqual('');
            expect(indexableTrack.rating).toEqual(0);
            expect(indexableTrack.love).toEqual(0);
            expect(indexableTrack.playCount).toEqual(0);
            expect(indexableTrack.skipCount).toEqual(0);
            expect(indexableTrack.dateLastPlayed).toEqual(0);
        });
    });
});
