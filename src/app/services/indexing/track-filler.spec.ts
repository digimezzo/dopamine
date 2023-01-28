import { IMock, It, Mock, Times } from 'typemoq';
import { AlbumKeyGenerator } from '../../common/data/album-key-generator';
import { Track } from '../../common/data/entities/track';
import { DateTime } from '../../common/date-time';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { Logger } from '../../common/logger';
import { BaseFileMetadataFactory } from '../../common/metadata/base-file-metadata-factory';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';
import { MimeTypes } from '../../common/metadata/mime-types';
import { TrackFieldCreator } from './track-field-creator';
import { TrackFiller } from './track-filler';

class FileMetadataImplementation implements IFileMetadata {
    public path: string;
    public bitRate: number;
    public sampleRate: number;
    public durationInMilliseconds: number;
    public title: string;
    public album: string;
    public albumArtists: string[];
    public artists: string[];
    public genres: string[];
    public comment: string;
    public grouping: string;
    public year: number;
    public trackNumber: number;
    public trackCount: number;
    public discNumber: number;
    public discCount: number;
    public lyrics: string;
    public picture: Buffer;
    public rating: number;
    public save(): void {}
    public async loadAsync(): Promise<void> {}
}

describe('TrackFiller', () => {
    let fileMetadataFactoryMock: IMock<BaseFileMetadataFactory>;
    let trackFieldCreatorMock: IMock<TrackFieldCreator>;
    let albumKeyGeneratorMock: IMock<AlbumKeyGenerator>;
    let fileAccessMock: IMock<BaseFileAccess>;
    let mimeTypesMock: IMock<MimeTypes>;
    let dateTimeMock: IMock<DateTime>;
    let loggerMock: IMock<Logger>;

    function createTrackFiller(): TrackFiller {
        return new TrackFiller(
            fileMetadataFactoryMock.object,
            trackFieldCreatorMock.object,
            albumKeyGeneratorMock.object,
            fileAccessMock.object,
            mimeTypesMock.object,
            dateTimeMock.object,
            loggerMock.object
        );
    }

    beforeEach(() => {
        fileMetadataFactoryMock = Mock.ofType<BaseFileMetadataFactory>();
        trackFieldCreatorMock = Mock.ofType<TrackFieldCreator>();
        albumKeyGeneratorMock = Mock.ofType<AlbumKeyGenerator>();
        fileAccessMock = Mock.ofType<BaseFileAccess>();
        mimeTypesMock = Mock.ofType<MimeTypes>();
        dateTimeMock = Mock.ofType<DateTime>();
        loggerMock = Mock.ofType<Logger>();

        trackFieldCreatorMock.setup((x) => x.createMultiTextField(['Artist 1', 'Artist 2'])).returns(() => ';Artist 1;;Artist 2;');
        trackFieldCreatorMock.setup((x) => x.createMultiTextField(['Genre 1', 'Genre 2'])).returns(() => ';Genre 1;;Genre 2;');
        trackFieldCreatorMock.setup((x) => x.createTextField('Album title')).returns(() => 'Album title');
        trackFieldCreatorMock.setup((x) => x.createNumberField(320)).returns(() => 320);
        trackFieldCreatorMock.setup((x) => x.createNumberField(44)).returns(() => 44);
        trackFieldCreatorMock.setup((x) => x.createTextField('Track title')).returns(() => 'Track title');
        trackFieldCreatorMock.setup((x) => x.createNumberField(1)).returns(() => 1);
        trackFieldCreatorMock.setup((x) => x.createNumberField(2)).returns(() => 2);
        trackFieldCreatorMock.setup((x) => x.createNumberField(4)).returns(() => 4);
        trackFieldCreatorMock.setup((x) => x.createNumberField(15)).returns(() => 15);
        trackFieldCreatorMock.setup((x) => x.createNumberField(123456)).returns(() => 123456);
        trackFieldCreatorMock.setup((x) => x.createNumberField(2020)).returns(() => 2020);

        trackFieldCreatorMock
            .setup((x) => x.createMultiTextField(['Album artist 1', 'Album artist 2']))
            .returns(() => ';Album artist 1;;Album artist 2;');

        albumKeyGeneratorMock
            .setup((x) => x.generateAlbumKey('Album title', ['Album artist 1', 'Album artist 2']))
            .returns(() => ';Album title;;Album artist 1;;Album artist 2;');

        mimeTypesMock.setup((x) => x.getMimeTypeForFileExtension('.mp3')).returns(() => 'audio/mpeg');

        fileAccessMock.setup((x) => x.getFileName('/home/user/Music/Track 1.mp3')).returns(() => 'Track 1');
        fileAccessMock.setup((x) => x.getFileExtension('/home/user/Music/Track 1.mp3')).returns(() => '.mp3');
        fileAccessMock.setup((x) => x.getFileSizeInBytesAsync('/home/user/Music/Track 1.mp3')).returns(async () => 123);
        fileAccessMock.setup((x) => x.getDateCreatedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 456);
    });

    describe('addFileMetadataToTrackAsync', () => {
        it('should fill in track artists with a multi value track field', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.artists = ['Artist 1', 'Artist 2'];

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createMultiTextField(['Artist 1', 'Artist 2']), Times.exactly(1));
            expect(track.artists).toEqual(';Artist 1;;Artist 2;');
        });

        it('should fill in track genres with a multi value track field', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.genres = ['Genre 1', 'Genre 2'];

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createMultiTextField(['Genre 1', 'Genre 2']), Times.exactly(1));
            expect(track.genres).toEqual(';Genre 1;;Genre 2;');
        });

        it('should fill in track albumTitle with a single value track field', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.album = 'Album title';

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createTextField('Album title'), Times.exactly(1));
            expect(track.albumTitle).toEqual('Album title');
        });

        it('should fill in track albumArtists with a multi value track field', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createMultiTextField(['Album artist 1', 'Album artist 2']), Times.exactly(1));
            expect(track.albumArtists).toEqual(';Album artist 1;;Album artist 2;');
        });

        it('should fill in track albumKey with a generated album key', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];
            fileMetadataStub.album = 'Album title';

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            albumKeyGeneratorMock.verify((x) => x.generateAlbumKey('Album title', ['Album artist 1', 'Album artist 2']), Times.exactly(1));
            expect(track.albumKey).toEqual(';Album title;;Album artist 1;;Album artist 2;');
        });

        it('should fill in track fileName with the file name of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            fileAccessMock.verify((x) => x.getFileName('/home/user/Music/Track 1.mp3'), Times.exactly(1));
            expect(track.fileName).toEqual('Track 1');
        });

        it('should fill in track mimeType with the mime type of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            fileAccessMock.verify((x) => x.getFileExtension('/home/user/Music/Track 1.mp3'), Times.exactly(1));
            mimeTypesMock.verify((x) => x.getMimeTypeForFileExtension('.mp3'), Times.exactly(1));
            expect(track.mimeType).toEqual('audio/mpeg');
        });

        it('should fill in track fileSize with the file size of the audio file in bytes', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            fileAccessMock.verify((x) => x.getFileSizeInBytesAsync('/home/user/Music/Track 1.mp3'), Times.exactly(1));

            expect(track.fileSize).toEqual(123);
        });

        it('should fill in track bitRate with the bit rate of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.bitRate = 320;

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(320), Times.exactly(1));
            expect(track.bitRate).toEqual(320);
        });

        it('should fill in track sampleRate with the sample rate of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.sampleRate = 44;

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(44), Times.exactly(1));
            expect(track.sampleRate).toEqual(44);
        });

        it('should fill in track trackTitle with a single value track field', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.title = 'Track title';

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createTextField('Track title'), Times.exactly(1));
            expect(track.trackTitle).toEqual('Track title');
        });

        it('should fill in track trackNumber with the track number of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.trackNumber = 1;

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(1), Times.exactly(1));
            expect(track.trackNumber).toEqual(1);
        });

        it('should fill in track trackCount with the track count of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.trackCount = 15;

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(15), Times.exactly(1));
            expect(track.trackCount).toEqual(15);
        });

        it('should fill in track discNumber with the disc number of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.discNumber = 1;

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(1), Times.exactly(1));
            expect(track.discNumber).toEqual(1);
        });

        it('should fill in track discCount with the disc count of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.discCount = 2;

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(2), Times.exactly(1));
            expect(track.discCount).toEqual(2);
        });

        it('should fill in track duration with the duration of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.durationInMilliseconds = 123456000;

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);

            trackFieldCreatorMock.setup((x) => x.createNumberField(123456000)).returns(() => 123456000);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(123456000), Times.exactly(1));
            expect(track.duration).toEqual(123456000);
        });

        it('should fill in track year with the year of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.year = 2020;

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(2020), Times.exactly(1));
            expect(track.year).toEqual(2020);
        });

        it('should fill in track hasLyrics with 0 if the audio file lyrics are undefined', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.lyrics = undefined;

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            expect(track.hasLyrics).toEqual(0);
        });

        it('should fill in track hasLyrics with 0 if the audio file lyrics are empty', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.lyrics = '';

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            expect(track.hasLyrics).toEqual(0);
        });

        it('should fill in track hasLyrics with 0 if the audio file lyrics are not empty', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.lyrics = 'Blabla';

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            expect(track.hasLyrics).toEqual(1);
        });

        it('should fill in track dateAdded wit hthe current date and time in ticks', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            dateTimeMock.setup((x) => x.convertDateToTicks(It.isAny())).returns(() => 123456);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            expect(track.dateAdded).toEqual(123456);
        });

        it('should fill in track dateFileCreated with the date that the file was created in ticks', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Asser
            expect(track.dateFileCreated).toEqual(456);
        });

        it('should fill in track dateLastSynced with the current date and time in ticks', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
            dateTimeMock.setup((x) => x.convertDateToTicks(It.isAny())).returns(() => 123456);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            expect(track.dateLastSynced).toEqual(123456);
        });

        it('should fill in track dateFileModified with the date that the file was modified in ticks', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            expect(track.dateFileModified).toEqual(789);
        });

        it('should fill in track needsIndexing with 0', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            expect(track.needsIndexing).toEqual(0);
        });

        it('should fill in track needsAlbumArtworkIndexing with 1', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            expect(track.needsAlbumArtworkIndexing).toEqual(1);
        });

        it('should fill in track rating with the rating of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.rating = 4;

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(4), Times.exactly(1));
            expect(track.rating).toEqual(4);
        });

        it('should fill in track indexingSuccess with 1 if no errors occur', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            expect(track.indexingSuccess).toEqual(1);
        });

        it('should fill in an empty track indexingFailureReason if no errors occur', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            expect(track.indexingFailureReason).toEqual('');
        });

        it('should fill in track indexingSuccess with 0 if errors occur', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).throws(new Error('The error text'));

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            expect(track.indexingSuccess).toEqual(0);
        });

        it('should fill in track indexingFailureReason with the error text if an error occur', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();

            fileMetadataFactoryMock.setup((x) => x.createAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadataStub);
            fileAccessMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).throws(new Error('The error text'));

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track);

            // Assert
            expect(track.indexingFailureReason).toEqual('The error text');
        });
    });
});
