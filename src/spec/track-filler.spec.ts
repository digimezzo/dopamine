import * as assert from 'assert';
import { Times } from 'typemoq';
import { DateTime } from '../app/core/date-time';
import { Track } from '../app/data/entities/track';
import { FileMetadataMock } from './mocking/file-metadata-mock';
import { TrackFillerMocker } from './mocking/track-filler-mocker';

describe('TrackFiller', () => {
    describe('addFileMetadataToTrackAsync', () => {
        it('Should fill in track artists with a multi value track field', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.artists = ['Artist 1', 'Artist 2'];

            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            mocker.trackFieldCreatorMock.verify(x => x.createMultiTextField(fileMetadataMock.artists), Times.exactly(1));
            assert.strictEqual(track.artists, ';Artist 1;;Artist 2;');
        });

        it('Should fill in track genres with a multi value track field', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.genres = ['Genre 1', 'Genre 2'];

            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            mocker.trackFieldCreatorMock.verify(x => x.createMultiTextField(fileMetadataMock.genres), Times.exactly(1));
            assert.strictEqual(track.genres, ';Genre 1;;Genre 2;');
        });

        it('Should fill in track albumTitle with a single value track field', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.album = 'Album title';

            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            mocker.trackFieldCreatorMock.verify(x => x.createTextField(fileMetadataMock.album), Times.exactly(1));
            assert.strictEqual(track.albumTitle, 'Album title');
        });

        it('Should fill in track albumArtists with a multi value track field', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.albumArtists = ['Album artist 1', 'Album artist 2'];

            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            mocker.trackFieldCreatorMock.verify(x => x.createMultiTextField(fileMetadataMock.albumArtists), Times.exactly(1));
            assert.strictEqual(track.albumArtists, ';Album artist 1;;Album artist 2;');
        });

        it('Should fill in track albumKey with a generated album key', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.album = 'Album title';
            fileMetadataMock.albumArtists = ['Album artist 1', 'Album artist 2'];

            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            mocker.albumKeyGeneratorMock.verify(
                x => x.generateAlbumKey('Album title', ['Album artist 1', 'Album artist 2']),
                Times.exactly(1)
            );
            assert.strictEqual(track.albumKey, ';Album title;;Album artist 1;;Album artist 2;');
        });

        it('Should fill in track fileName with the file name of the audio file', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            mocker.fileSystemMock.verify(x => x.getFileName('/home/user/Music/Track 1.mp3'), Times.exactly(1));
            assert.strictEqual(track.fileName, 'Track 1');
        });

        it('Should fill in track mimeType with the mime type of the audio file', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            mocker.fileSystemMock.verify(x => x.getFileExtension('/home/user/Music/Track 1.mp3'), Times.exactly(1));
            mocker.mimeTypesMock.verify(x => x.getMimeTypeForFileExtension('.mp3'), Times.exactly(1));
            assert.strictEqual(track.mimeType, 'audio/mpeg');
        });

        it('Should fill in track fileSize with the file size of the audio file in bytes', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            mocker.fileSystemMock.verify(x => x.getFilesizeInBytes('/home/user/Music/Track 1.mp3'), Times.exactly(1));

            assert.strictEqual(track.fileSize, 123);
        });

        it('Should fill in track bitRate with the bit rate of the audio file', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.bitRate = 320;
            const trackFillerMockingHelper: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await trackFillerMockingHelper.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFillerMockingHelper.trackFieldCreatorMock.verify(x => x.createNumberField(320), Times.exactly(1));
            assert.strictEqual(track.bitRate, 320);
        });

        it('Should fill in track sampleRate with the sample rate of the audio file', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.sampleRate = 44;
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            mocker.trackFieldCreatorMock.verify(x => x.createNumberField(44), Times.exactly(1));
            assert.strictEqual(track.sampleRate, 44);
        });

        it('Should fill in track trackTitle with a single value track field', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.title = 'Track title';
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            mocker.trackFieldCreatorMock.verify(x => x.createTextField(fileMetadataMock.title), Times.exactly(1));
            assert.strictEqual(track.trackTitle, 'Track title');
        });

        it('Should fill in track trackNumber with the track number of the audio file', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.trackNumber = 1;
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            mocker.trackFieldCreatorMock.verify(x => x.createNumberField(1), Times.exactly(1));
            assert.strictEqual(track.trackNumber, 1);
        });

        it('Should fill in track trackCount with the track count of the audio file', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.trackCount = 15;
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            mocker.trackFieldCreatorMock.verify(x => x.createNumberField(15), Times.exactly(1));
            assert.strictEqual(track.trackCount, 15);
        });

        it('Should fill in track discNumber with the disc number of the audio file', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.discNumber = 1;
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            mocker.trackFieldCreatorMock.verify(x => x.createNumberField(1), Times.exactly(1));
            assert.strictEqual(track.discNumber, 1);
        });

        it('Should fill in track discCount with the disc count of the audio file', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.discCount = 2;
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            mocker.trackFieldCreatorMock.verify(x => x.createNumberField(2), Times.exactly(1));
            assert.strictEqual(track.discCount, 2);
        });

        it('Should fill in track duration with the duration of the audio file', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.duration = 123456;
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            mocker.trackFieldCreatorMock.verify(x => x.createNumberField(123456), Times.exactly(1));
            assert.strictEqual(track.duration, 123456);
        });

        it('Should fill in track year with the year of the audio file', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.year = 2020;
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            mocker.trackFieldCreatorMock.verify(x => x.createNumberField(2020), Times.exactly(1));
            assert.strictEqual(track.year, 2020);
        });

        it('Should fill in track hasLyrics with 0 if the audio file lyrics are undefined', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.lyrics = undefined;
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            assert.strictEqual(track.hasLyrics, 0);
        });

        it('Should fill in track hasLyrics with 0 if the audio file lyrics are empty', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.lyrics = '';
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            assert.strictEqual(track.hasLyrics, 0);
        });

        it('Should fill in track hasLyrics with 0 if the audio file lyrics are not empty', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.lyrics = 'Blabla';
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            assert.strictEqual(track.hasLyrics, 1);
        });

        it('Should fill in track dateAdded wit hthe current date and time in ticks', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            const dateTicksBefore: number = DateTime.getTicks(new Date());
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);
            const dateTicksAfter: number = DateTime.getTicks(new Date());

            // Assert
            assert.ok(track.dateAdded >= dateTicksBefore && track.dateAdded <= dateTicksAfter);
        });

        it('Should fill in track dateFileCreated with the date that the file was created in ticks', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Asser
            assert.strictEqual(track.dateFileCreated, 456);
        });

        it('Should fill in track dateLastSynced wit hthe current date and time in ticks', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            const dateTicksBefore: number = DateTime.getTicks(new Date());
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);
            const dateTicksAfter: number = DateTime.getTicks(new Date());

            // Assert
            assert.ok(track.dateLastSynced >= dateTicksBefore && track.dateLastSynced <= dateTicksAfter);
        });

        it('Should fill in track dateFileModified with the date that the file was modified in ticks', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Asser
            assert.strictEqual(track.dateFileModified, 789);
        });

        it('Should fill in track needsIndexing with 0', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Asser
            assert.strictEqual(track.needsIndexing, 0);
        });

        it('Should fill in track needsAlbumArtworkIndexing with 1', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Asser
            assert.strictEqual(track.needsAlbumArtworkIndexing, 1);
        });

        it('Should fill in track rating with the rating of the audio file', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            fileMetadataMock.rating = 4;
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            mocker.trackFieldCreatorMock.verify(
                x => x.createNumberField(4),
                Times.exactly(1)
            );
            assert.strictEqual(track.rating, 4);
        });

        it('Should fill in track indexingSuccess with 1 if no errors occur', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            assert.strictEqual(track.indexingSuccess, 1);
        });

        it('Should fill in an empty track indexingFailureReason if no errors occur', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, false);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            assert.strictEqual(track.indexingFailureReason, '');
        });

        it('Should fill in track indexingSuccess with 0 if errors occur', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, true);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            assert.strictEqual(track.indexingSuccess, 0);
        });

        it('Should fill in track indexingFailureReason with the error text if an error occur', async () => {
            // Arrange
            const fileMetadataMock: FileMetadataMock = new FileMetadataMock();
            const mocker: TrackFillerMocker = TrackFillerMocker.create(fileMetadataMock, true);

            // Act
            const track: Track = new Track('/home/user/Music/Track 1.mp3');
            await mocker.trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            assert.strictEqual(track.indexingFailureReason, 'The error text');
        });
    });
});
