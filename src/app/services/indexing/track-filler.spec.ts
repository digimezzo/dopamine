import { IMock, It, Mock, Times } from 'typemoq';
import { DateTime } from '../../common/date-time';
import { Logger } from '../../common/logger';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';
import { MimeTypes } from '../../common/metadata/mime-types';
import { TrackFieldCreator } from './track-field-creator';
import { TrackFiller } from './track-filler';
import { FileMetadataFactoryBase } from '../../common/metadata/file-metadata.factory.base';
import { AlbumKeyGenerator } from '../../data/album-key-generator';
import { FileAccessBase } from '../../common/io/file-access.base';
import { Track } from '../../data/entities/track';
import { MetadataPatcher } from '../../common/metadata/metadata-patcher';

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
    let fileMetadataFactoryMock: IMock<FileMetadataFactoryBase>;
    let trackFieldCreatorMock: IMock<TrackFieldCreator>;
    let metadataPatcherMock: IMock<MetadataPatcher>;
    let albumKeyGeneratorMock: IMock<AlbumKeyGenerator>;
    let fileAccessMock: IMock<FileAccessBase>;
    let mimeTypesMock: IMock<MimeTypes>;
    let dateTimeMock: IMock<DateTime>;
    let loggerMock: IMock<Logger>;

    function createTrackFiller(): TrackFiller {
        return new TrackFiller(
            fileMetadataFactoryMock.object,
            trackFieldCreatorMock.object,
            metadataPatcherMock.object,
            albumKeyGeneratorMock.object,
            fileAccessMock.object,
            mimeTypesMock.object,
            dateTimeMock.object,
            loggerMock.object,
        );
    }

    beforeEach(() => {
        fileMetadataFactoryMock = Mock.ofType<FileMetadataFactoryBase>();
        trackFieldCreatorMock = Mock.ofType<TrackFieldCreator>();
        metadataPatcherMock = Mock.ofType<MetadataPatcher>();
        albumKeyGeneratorMock = Mock.ofType<AlbumKeyGenerator>();
        fileAccessMock = Mock.ofType<FileAccessBase>();
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
        fileAccessMock.setup((x) => x.getFileSizeInBytes('/home/user/Music/Track 1.mp3')).returns(() => 123);
        fileAccessMock.setup((x) => x.getDateCreatedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 456);
    });

    describe('addFileMetadataToTrackAsync', () => {
        it('should fill in track artists with a multi value track field', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.artists = ['Artist 1', 'Artist 2'];

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            metadataPatcherMock.setup((x) => x.joinUnsplittableMetadata(['Artist 1', 'Artist 2'])).returns(() => ['Artist 1', 'Artist 2']);

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            metadataPatcherMock.verify((x) => x.joinUnsplittableMetadata(['Artist 1', 'Artist 2']), Times.exactly(1));
            trackFieldCreatorMock.verify((x) => x.createMultiTextField(['Artist 1', 'Artist 2']), Times.exactly(1));
            expect(track.artists).toEqual(';Artist 1;;Artist 2;');
        });

        it('should fill in track genres with a multi value track field', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];
            fileMetadataStub.genres = ['Genre 1', 'Genre 2'];

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            metadataPatcherMock.setup((x) => x.joinUnsplittableMetadata(['Genre 1', 'Genre 2'])).returns(() => ['Genre 1', 'Genre 2']);

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            metadataPatcherMock.verify((x) => x.joinUnsplittableMetadata(['Genre 1', 'Genre 2']), Times.exactly(1));
            trackFieldCreatorMock.verify((x) => x.createMultiTextField(['Genre 1', 'Genre 2']), Times.exactly(1));
            expect(track.genres).toEqual(';Genre 1;;Genre 2;');
        });

        it('should fill in track albumTitle with a single value track field', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];
            fileMetadataStub.album = 'Album title';

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createTextField('Album title'), Times.exactly(1));
            expect(track.albumTitle).toEqual('Album title');
        });

        it('should fill in track albumArtists with a multi value track field', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            metadataPatcherMock
                .setup((x) => x.joinUnsplittableMetadata(['Album artist 1', 'Album artist 2']))
                .returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            metadataPatcherMock.verify((x) => x.joinUnsplittableMetadata(['Album artist 1', 'Album artist 2']), Times.exactly(2));
            trackFieldCreatorMock.verify((x) => x.createMultiTextField(['Album artist 1', 'Album artist 2']), Times.exactly(1));
            expect(track.albumArtists).toEqual(';Album artist 1;;Album artist 2;');
        });

        it('should fill in track albumKey with a generated album key', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];
            fileMetadataStub.album = 'Album title';

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            metadataPatcherMock
                .setup((x) => x.joinUnsplittableMetadata(['Album artist 1', 'Album artist 2']))
                .returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            metadataPatcherMock.verify((x) => x.joinUnsplittableMetadata(['Album artist 1', 'Album artist 2']), Times.exactly(2));
            albumKeyGeneratorMock.verify((x) => x.generateAlbumKey('Album title', ['Album artist 1', 'Album artist 2']), Times.exactly(1));
            expect(track.albumKey).toEqual(';Album title;;Album artist 1;;Album artist 2;');
        });

        it('should fill in track albumKey with a generated album key when albumArtists is empty and artists is not empty', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = [];
            fileMetadataStub.artists = ['Artist 1', 'Artist 2'];
            fileMetadataStub.album = 'Album title';

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            metadataPatcherMock.setup((x) => x.joinUnsplittableMetadata(['Artist 1', 'Artist 2'])).returns(() => ['Artist 1', 'Artist 2']);

            albumKeyGeneratorMock.reset();
            albumKeyGeneratorMock
                .setup((x) => x.generateAlbumKey('Album title', ['Artist 1', 'Artist 2']))
                .returns(() => ';Album title;;Artist 1;;Artist 2;');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            metadataPatcherMock.verify((x) => x.joinUnsplittableMetadata(['Artist 1', 'Artist 2']), Times.exactly(2));
            albumKeyGeneratorMock.verify((x) => x.generateAlbumKey('Album title', ['Artist 1', 'Artist 2']), Times.once());
            expect(track.albumKey).toEqual(';Album title;;Artist 1;;Artist 2;');
        });

        it('should fill in track albumKey with a generated album key when albumArtists and artists are empty', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = [];
            fileMetadataStub.artists = [];
            fileMetadataStub.album = 'Album title';

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            metadataPatcherMock.setup((x) => x.joinUnsplittableMetadata([])).returns(() => []);

            albumKeyGeneratorMock.reset();
            albumKeyGeneratorMock.setup((x) => x.generateAlbumKey('Album title', [])).returns(() => ';Album title;');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            metadataPatcherMock.verify((x) => x.joinUnsplittableMetadata([]), Times.exactly(3));
            albumKeyGeneratorMock.verify((x) => x.generateAlbumKey('Album title', []), Times.once());
            expect(track.albumKey).toEqual(';Album title;');
        });

        it('should fill in track fileName with the file name of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            fileAccessMock.verify((x) => x.getFileName('/home/user/Music/Track 1.mp3'), Times.exactly(1));
            expect(track.fileName).toEqual('Track 1');
        });

        it('should fill in track mimeType with the mime type of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            fileAccessMock.verify((x) => x.getFileExtension('/home/user/Music/Track 1.mp3'), Times.exactly(1));
            mimeTypesMock.verify((x) => x.getMimeTypeForFileExtension('.mp3'), Times.exactly(1));
            expect(track.mimeType).toEqual('audio/mpeg');
        });

        it('should fill in track fileSize with the file size of the audio file in bytes', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            fileAccessMock.verify((x) => x.getFileSizeInBytes('/home/user/Music/Track 1.mp3'), Times.exactly(1));

            expect(track.fileSize).toEqual(123);
        });

        it('should fill in track bitRate with the bit rate of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];
            fileMetadataStub.bitRate = 320;

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(320), Times.exactly(1));
            expect(track.bitRate).toEqual(320);
        });

        it('should fill in track sampleRate with the sample rate of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];
            fileMetadataStub.sampleRate = 44;

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(44), Times.exactly(1));
            expect(track.sampleRate).toEqual(44);
        });

        it('should fill in track trackTitle with a single value track field', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.title = 'Track title';

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createTextField('Track title'), Times.exactly(1));
            expect(track.trackTitle).toEqual('Track title');
        });

        it('should fill in track trackNumber with the track number of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.trackNumber = 1;

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(1), Times.exactly(1));
            expect(track.trackNumber).toEqual(1);
        });

        it('should fill in track trackCount with the track count of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];
            fileMetadataStub.trackCount = 15;

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(15), Times.exactly(1));
            expect(track.trackCount).toEqual(15);
        });

        it('should fill in track discNumber with the disc number of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];
            fileMetadataStub.discNumber = 1;

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(1), Times.exactly(1));
            expect(track.discNumber).toEqual(1);
        });

        it('should fill in track discCount with the disc count of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];
            fileMetadataStub.discCount = 2;

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(2), Times.exactly(1));
            expect(track.discCount).toEqual(2);
        });

        it('should fill in track duration with the duration of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.durationInMilliseconds = 123456000;

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);

            trackFieldCreatorMock.setup((x) => x.createNumberField(123456000)).returns(() => 123456000);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(123456000), Times.exactly(1));
            expect(track.duration).toEqual(123456000);
        });

        it('should fill in track year with the year of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];
            fileMetadataStub.year = 2020;

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(2020), Times.exactly(1));
            expect(track.year).toEqual(2020);
        });

        it('should fill in track hasLyrics with 0 if the audio file lyrics are empty', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.lyrics = '';

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            expect(track.hasLyrics).toEqual(0);
        });

        it('should fill in track hasLyrics with 0 if the audio file lyrics are not empty', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];
            fileMetadataStub.lyrics = 'Blabla';

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            expect(track.hasLyrics).toEqual(1);
        });

        it('should fill in track dateAdded wit hthe current date and time in ticks', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            dateTimeMock.setup((x) => x.convertDateToTicks(It.isAny())).returns(() => 123456);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            expect(track.dateAdded).toEqual(123456);
        });

        it('should fill in track dateFileCreated with the date that the file was created in ticks', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            expect(track.dateFileCreated).toEqual(456);
        });

        it('should fill in track dateLastSynced with the current date and time in ticks', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            dateTimeMock.setup((x) => x.convertDateToTicks(It.isAny())).returns(() => 123456);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            expect(track.dateLastSynced).toEqual(123456);
        });

        it('should fill in track dateFileModified with the date that the file was modified in ticks', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            expect(track.dateFileModified).toEqual(789);
        });

        it('should fill in track needsIndexing with 0', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            expect(track.needsIndexing).toEqual(0);
        });

        it('should fill in track needsAlbumArtworkIndexing with 1', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            expect(track.needsAlbumArtworkIndexing).toEqual(1);
        });

        it('should fill in track rating with the rating of the audio file', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.rating = 4;

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            trackFieldCreatorMock.verify((x) => x.createNumberField(4), Times.exactly(1));
            expect(track.rating).toEqual(4);
        });

        it('should fill in track indexingSuccess with 1 if no errors occur', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            expect(track.indexingSuccess).toEqual(1);
        });

        it('should fill in an empty track indexingFailureReason if no errors occur', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            expect(track.indexingFailureReason).toEqual('');
        });

        it('should fill in track indexingSuccess with 0 if errors occur', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).throws(new Error('The error text'));

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            expect(track.indexingSuccess).toEqual(0);
        });

        it('should fill in track indexingFailureReason with the error text if an error occur', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).throws(new Error('The error text'));

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            expect(track.indexingFailureReason).toEqual('The error text');
        });

        it('should fill all metadata when fillOnlyEssentialMetadata is false', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.artists = ['Artist 1', 'Artist 2'];
            fileMetadataStub.genres = ['Genre 1', 'Genre 2'];
            fileMetadataStub.album = 'Album title';
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];
            fileMetadataStub.album = 'Album title';
            fileMetadataStub.bitRate = 320;
            fileMetadataStub.sampleRate = 44;
            fileMetadataStub.title = 'Track title';
            fileMetadataStub.trackNumber = 1;
            fileMetadataStub.trackCount = 15;
            fileMetadataStub.discNumber = 1;
            fileMetadataStub.discCount = 2;
            fileMetadataStub.durationInMilliseconds = 123456000;
            fileMetadataStub.year = 2020;
            fileMetadataStub.lyrics = 'Blabla';
            fileMetadataStub.rating = 4;

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            trackFieldCreatorMock.setup((x) => x.createNumberField(123456000)).returns(() => 123456000);
            trackFieldCreatorMock.setup((x) => x.createNumberField(123456)).returns(() => 123456);
            dateTimeMock.setup((x) => x.convertDateToTicks(It.isAny())).returns(() => 123456);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            metadataPatcherMock.setup((x) => x.joinUnsplittableMetadata(['Artist 1', 'Artist 2'])).returns(() => ['Artist 1', 'Artist 2']);
            metadataPatcherMock.setup((x) => x.joinUnsplittableMetadata(['Genre 1', 'Genre 2'])).returns(() => ['Genre 1', 'Genre 2']);
            metadataPatcherMock
                .setup((x) => x.joinUnsplittableMetadata(['Album artist 1', 'Album artist 2']))
                .returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, false);

            // Assert
            expect(track.artists).toEqual(';Artist 1;;Artist 2;');
            expect(track.rating).toEqual(4);
            expect(track.fileName).toEqual('Track 1');
            expect(track.duration).toEqual(123456000);
            expect(track.trackTitle).toEqual('Track title');
            expect(track.trackNumber).toEqual(1);
            expect(track.fileSize).toEqual(123);

            expect(track.genres).toEqual(';Genre 1;;Genre 2;');
            expect(track.albumTitle).toEqual('Album title');
            expect(track.albumArtists).toEqual(';Album artist 1;;Album artist 2;');
            expect(track.albumKey).toEqual(';Album title;;Album artist 1;;Album artist 2;');
            expect(track.mimeType).toEqual('audio/mpeg');
            expect(track.bitRate).toEqual(320);
            expect(track.sampleRate).toEqual(44);
            expect(track.trackCount).toEqual(15);
            expect(track.discNumber).toEqual(1);
            expect(track.discCount).toEqual(2);
            expect(track.year).toEqual(2020);
            expect(track.hasLyrics).toEqual(1);
            expect(track.dateAdded).toEqual(123456);
            expect(track.dateFileCreated).toEqual(456);
            expect(track.dateLastSynced).toEqual(123456);
            expect(track.dateFileModified).toEqual(789);

            expect(track.needsIndexing).toEqual(0);
            expect(track.needsAlbumArtworkIndexing).toEqual(1);
            expect(track.indexingSuccess).toEqual(1);
            expect(track.indexingFailureReason).toEqual('');
        });

        it('should only fill essential metadata when fillOnlyEssentialMetadata is true', async () => {
            // Arrange
            const fileMetadataStub = new FileMetadataImplementation();
            fileMetadataStub.artists = ['Artist 1', 'Artist 2'];
            fileMetadataStub.genres = ['Genre 1', 'Genre 2'];
            fileMetadataStub.album = 'Album title';
            fileMetadataStub.albumArtists = ['Album artist 1', 'Album artist 2'];
            fileMetadataStub.album = 'Album title';
            fileMetadataStub.bitRate = 320;
            fileMetadataStub.sampleRate = 44;
            fileMetadataStub.title = 'Track title';
            fileMetadataStub.trackNumber = 1;
            fileMetadataStub.trackCount = 15;
            fileMetadataStub.discNumber = 1;
            fileMetadataStub.discCount = 2;
            fileMetadataStub.durationInMilliseconds = 123456000;
            fileMetadataStub.year = 2020;
            fileMetadataStub.lyrics = 'Blabla';
            fileMetadataStub.rating = 4;

            fileMetadataFactoryMock
                .setup((x) => x.createAsync('/home/user/Music/Track 1.mp3'))
                .returns(() => Promise.resolve(fileMetadataStub));
            fileAccessMock.setup((x) => x.getDateModifiedInTicks('/home/user/Music/Track 1.mp3')).returns(() => 789);
            trackFieldCreatorMock.setup((x) => x.createNumberField(123456000)).returns(() => 123456000);
            trackFieldCreatorMock.setup((x) => x.createNumberField(123456)).returns(() => 123456);
            dateTimeMock.setup((x) => x.convertDateToTicks(It.isAny())).returns(() => 123456);

            const trackFiller: TrackFiller = createTrackFiller();
            const track: Track = new Track('/home/user/Music/Track 1.mp3');

            metadataPatcherMock.setup((x) => x.joinUnsplittableMetadata(['Artist 1', 'Artist 2'])).returns(() => ['Artist 1', 'Artist 2']);
            metadataPatcherMock
                .setup((x) => x.joinUnsplittableMetadata(['Album artist 1', 'Album artist 2']))
                .returns(() => ['Album artist 1', 'Album artist 2']);

            // Act
            await trackFiller.addFileMetadataToTrackAsync(track, true);

            // Assert
            expect(track.artists).toEqual(';Artist 1;;Artist 2;');
            expect(track.rating).toEqual(4);
            expect(track.fileName).toEqual('Track 1');
            expect(track.duration).toEqual(123456000);
            expect(track.trackTitle).toEqual('Track title');
            expect(track.trackNumber).toEqual(1);
            expect(track.fileSize).toEqual(123);

            expect(track.genres).toEqual('');
            expect(track.albumTitle).toEqual('');
            expect(track.albumArtists).toEqual('');
            expect(track.albumKey).toEqual(';Album title;;Album artist 1;;Album artist 2;');
            expect(track.mimeType).toEqual('');
            expect(track.bitRate).toEqual(0);
            expect(track.sampleRate).toEqual(0);
            expect(track.trackCount).toEqual(0);
            expect(track.discNumber).toEqual(0);
            expect(track.discCount).toEqual(0);
            expect(track.year).toEqual(0);
            expect(track.hasLyrics).toEqual(0);
            expect(track.dateAdded).toEqual(0);
            expect(track.dateFileCreated).toEqual(0);
            expect(track.dateLastSynced).toEqual(0);
            expect(track.dateFileModified).toEqual(0);

            expect(track.needsIndexing).toEqual(0);
            expect(track.needsAlbumArtworkIndexing).toEqual(1);
            expect(track.indexingSuccess).toEqual(1);
            expect(track.indexingFailureReason).toEqual('');
        });
    });
});
