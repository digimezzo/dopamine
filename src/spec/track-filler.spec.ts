import * as assert from 'assert';
import { Times } from 'typemoq';
import { Track } from '../app/data/entities/track';
import { FileMetadataMock } from './mocking/file-metadata-mock';
import { TrackFillerMockingHelper } from './mocking/track-filler-mocking-helper';

describe('TrackFiller', () => {
    describe('addFileMetadataToTrackAsync', () => {
        it('Should fill in track artists with a multi value track field', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.artists = ['Artist 1', 'Artist 2'];

            const trackFillerMockingHelper: TrackFillerMockingHelper = TrackFillerMockingHelper.create(fileMetadataMock);
            trackFillerMockingHelper.trackFieldCreatorMock.setup(
                x => x.createMultiTextField(['Artist 1', 'Artist 2'])
            ).returns(() => ';Artist 1;;Artist 2;');

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await trackFillerMockingHelper.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFillerMockingHelper.trackFieldCreatorMock.verify(
                x => x.createMultiTextField(fileMetadataMock.artists),
                Times.exactly(1)
            );
            assert.strictEqual(track.artists, ';Artist 1;;Artist 2;');
        });

        it('Should fill in track genres with a multi value track field', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.genres = ['Genre 1', 'Genre 2'];

            const trackFillerMockingHelper: TrackFillerMockingHelper = TrackFillerMockingHelper.create(fileMetadataMock);
            trackFillerMockingHelper.trackFieldCreatorMock.setup(
                x => x.createMultiTextField(['Genre 1', 'Genre 2'])
            ).returns(() => ';Genre 1;;Genre 2;');

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await trackFillerMockingHelper.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFillerMockingHelper.trackFieldCreatorMock.verify(
                x => x.createMultiTextField(fileMetadataMock.genres),
                Times.exactly(1)
            );
            assert.strictEqual(track.genres, ';Genre 1;;Genre 2;');
        });

        it('Should fill in track albumTitle with a single value track field', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.album = 'Album title';

            const trackFillerMockingHelper: TrackFillerMockingHelper = TrackFillerMockingHelper.create(fileMetadataMock);
            trackFillerMockingHelper.trackFieldCreatorMock.setup(
                x => x.createTextField('Album title')
            ).returns(() => 'Album title');

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await trackFillerMockingHelper.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFillerMockingHelper.trackFieldCreatorMock.verify(
                x => x.createTextField(fileMetadataMock.album),
                Times.exactly(1)
            );
            assert.strictEqual(track.albumTitle, 'Album title');
        });

        it('Should fill in track albumArtists with a multi value track field', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.albumArtists = ['Album artist 1', 'Album artist 2'];

            const trackFillerMockingHelper: TrackFillerMockingHelper = TrackFillerMockingHelper.create(fileMetadataMock);
            trackFillerMockingHelper.trackFieldCreatorMock.setup(
                x => x.createMultiTextField(['Album artist 1', 'Album artist 2'])
            ).returns(() => ';Album artist 1;;Album artist 2;');

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await trackFillerMockingHelper.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFillerMockingHelper.trackFieldCreatorMock.verify(
                x => x.createMultiTextField(fileMetadataMock.albumArtists),
                Times.exactly(1)
            );
            assert.strictEqual(track.albumArtists, ';Album artist 1;;Album artist 2;');
        });

        it('Should fill in track albumKey with a generated album key', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.album = 'Album title';
            fileMetadataMock.albumArtists = ['Album artist 1', 'Album artist 2'];

            const trackFillerMockingHelper: TrackFillerMockingHelper = TrackFillerMockingHelper.create(fileMetadataMock);
            trackFillerMockingHelper.albumKeyGeneratorMock.setup(
                x => x.generateAlbumKey('Album title', ['Album artist 1', 'Album artist 2'])
            ).returns(() => ';Album title;;Album artist 1;;Album artist 2;');

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await trackFillerMockingHelper.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFillerMockingHelper.albumKeyGeneratorMock.verify(
                x => x.generateAlbumKey('Album title', ['Album artist 1', 'Album artist 2']),
                Times.exactly(1)
            );
            assert.strictEqual(track.albumKey, ';Album title;;Album artist 1;;Album artist 2;');
        });

        it('Should fill in track fileName with the file name of the audio file', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();

            const trackFillerMockingHelper: TrackFillerMockingHelper = TrackFillerMockingHelper.create(fileMetadataMock);
            trackFillerMockingHelper.fileSystemMock.setup(
                x => x.getFileName('/home/user/Music/Track 1.mp3')
            ).returns(() => 'Track 1');

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await trackFillerMockingHelper.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFillerMockingHelper.fileSystemMock.verify(
                x => x.getFileName('/home/user/Music/Track 1.mp3'),
                Times.exactly(1)
            );
            assert.strictEqual(track.fileName, 'Track 1');
        });

        it('Should fill in track mimeType with the mime type of the audio file', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();

            const trackFillerMockingHelper: TrackFillerMockingHelper = TrackFillerMockingHelper.create(fileMetadataMock);
            trackFillerMockingHelper.fileSystemMock.setup(
                x => x.getFileExtension('/home/user/Music/Track 1.mp3')
            ).returns(() => '.mp3');
            trackFillerMockingHelper.mimeTypesMock.setup(
                x => x.getMimeTypeForFileExtension('.mp3')
            ).returns(() => 'audio/mpeg');

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await trackFillerMockingHelper.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFillerMockingHelper.fileSystemMock.verify(
                x => x.getFileExtension('/home/user/Music/Track 1.mp3'),
                Times.exactly(1)
            );
            trackFillerMockingHelper.mimeTypesMock.verify(
                x => x.getMimeTypeForFileExtension('.mp3'),
                Times.exactly(1)
            );
            assert.strictEqual(track.mimeType, 'audio/mpeg');
        });

        it('Should fill in track fileSize with the file size of the audio file in bytes', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();

            const trackFillerMockingHelper: TrackFillerMockingHelper = TrackFillerMockingHelper.create(fileMetadataMock);
            trackFillerMockingHelper.fileSystemMock.setup(
                x => x.getFilesizeInBytes('/home/user/Music/Track 1.mp3')
            ).returns(() => 123);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await trackFillerMockingHelper.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFillerMockingHelper.fileSystemMock.verify(
                x => x.getFilesizeInBytes('/home/user/Music/Track 1.mp3'),
                Times.exactly(1)
            );
            assert.strictEqual(track.fileSize, 123);
        });
    });
});
