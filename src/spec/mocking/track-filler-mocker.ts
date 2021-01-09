import { IMock, Mock } from 'typemoq';
import { FileSystem } from '../../app/core/io/file-system';
import { Logger } from '../../app/core/logger';
import { AlbumKeyGenerator } from '../../app/data/album-key-generator';
import { FileMetadata } from '../../app/metadata/file-metadata';
import { FileMetadataFactory } from '../../app/metadata/file-metadata-factory';
import { MimeTypes } from '../../app/metadata/mime-types';
import { TrackFieldCreator } from '../../app/services/indexing/track-field-creator';
import { TrackFiller } from '../../app/services/indexing/track-filler';

export class TrackFillerMocker {
    private constructor(
        public trackFiller: TrackFiller,
        public trackFieldCreatorMock: IMock<TrackFieldCreator>,
        public albumKeyGeneratorMock: IMock<AlbumKeyGenerator>,
        public mimeTypesMock: IMock<MimeTypes>,
        public fileSystemMock: IMock<FileSystem>
    ) {}

    public static create(fileMetadata: FileMetadata, shouldThrowError: boolean): TrackFillerMocker {
        const fileMetadataFactoryMock: IMock<FileMetadataFactory> = Mock.ofType<FileMetadataFactory>();
        const trackFieldCreatorMock: IMock<TrackFieldCreator> = Mock.ofType<TrackFieldCreator>();
        const albumKeyGeneratorMock: IMock<AlbumKeyGenerator> = Mock.ofType<AlbumKeyGenerator>();
        const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
        const mimeTypesMock: IMock<MimeTypes> = Mock.ofType<MimeTypes>();
        const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

        fileMetadataFactoryMock.setup((x) => x.createReadOnlyAsync('/home/user/Music/Track 1.mp3')).returns(async () => fileMetadata);

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

        fileSystemMock.setup((x) => x.getFileName('/home/user/Music/Track 1.mp3')).returns(() => 'Track 1');
        fileSystemMock.setup((x) => x.getFileExtension('/home/user/Music/Track 1.mp3')).returns(() => '.mp3');
        fileSystemMock.setup((x) => x.getFilesizeInBytesAsync('/home/user/Music/Track 1.mp3')).returns(async () => 123);
        fileSystemMock.setup((x) => x.getDateCreatedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 456);

        if (shouldThrowError) {
            fileSystemMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).throws(new Error('The error text'));
        } else {
            fileSystemMock.setup((x) => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);
        }

        mimeTypesMock.setup((x) => x.getMimeTypeForFileExtension('.mp3')).returns(() => 'audio/mpeg');

        const trackFiller: TrackFiller = new TrackFiller(
            fileMetadataFactoryMock.object,
            trackFieldCreatorMock.object,
            albumKeyGeneratorMock.object,
            fileSystemMock.object,
            mimeTypesMock.object,
            loggerMock.object
        );

        return new TrackFillerMocker(trackFiller, trackFieldCreatorMock, albumKeyGeneratorMock, mimeTypesMock, fileSystemMock);
    }
}
