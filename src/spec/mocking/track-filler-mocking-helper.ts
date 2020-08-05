import { IMock, Mock } from 'typemoq';
import { FileSystem } from '../../app/core/io/file-system';
import { Logger } from '../../app/core/logger';
import { AlbumKeyGenerator } from '../../app/data/album-key-generator';
import { FileMetadata } from '../../app/metadata/file-metadata';
import { FileMetadataFactory } from '../../app/metadata/file-metadata-factory';
import { MimeTypes } from '../../app/metadata/mime-types';
import { TrackFieldCreator } from '../../app/services/indexing/track-field-creator';
import { TrackFiller } from '../../app/services/indexing/track-filler';

export class TrackFillerMockingHelper {
    private constructor(
        public trackFiller: TrackFiller,
        public trackFieldCreatorMock: IMock<TrackFieldCreator>,
        public albumKeyGeneratorMock: IMock<AlbumKeyGenerator>,
        public mimeTypesMock: IMock<MimeTypes>,
        public fileSystemMock: IMock<FileSystem>) { }

    public static create(fileMetadata: FileMetadata): TrackFillerMockingHelper {
        const fileMetadataFactoryMock: IMock<FileMetadataFactory> = Mock.ofType<FileMetadataFactory>();
        const trackFieldCreatorMock: IMock<TrackFieldCreator> = Mock.ofType<TrackFieldCreator>();
        const albumkeyGeneratorMock: IMock<AlbumKeyGenerator> = Mock.ofType<AlbumKeyGenerator>();
        const fileSystemMock: IMock<FileSystem> = Mock.ofType<FileSystem>();
        const mimTypesMock: IMock<MimeTypes> = Mock.ofType<MimeTypes>();
        const loggerMock: IMock<Logger> = Mock.ofType<Logger>();

        fileMetadataFactoryMock.setup(
            x => x.createReadOnlyAsync('/home/user/Music/Track 1.mp3')
        ).returns(async () => fileMetadata);

        trackFieldCreatorMock.setup(x => x.createMultiTextField(['Artist 1', ' Artist 2'])).returns(() => ';Artist 1;;Artist 2;');
        trackFieldCreatorMock.setup(x => x.createMultiTextField(['Genre 1', ' Genre 2'])).returns(() => ';Genre 1;;Genre 2;');
        trackFieldCreatorMock.setup(x => x.createTextField('Album title  ')).returns(() => 'Album title');

        fileSystemMock.setup(x => x.getFileName('/home/user/Music/Track 1.mp3')).returns(() => 'Track 1');
        fileSystemMock.setup(x => x.getFileExtension('/home/user/Music/Track 1.mp3')).returns(() => '.mp3');
        fileSystemMock.setup(x => x.getFilesizeInBytes('/home/user/Music/Track 1.mp3')).returns(() => 123);
        fileSystemMock.setup(x => x.getDateCreatedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 456);
        fileSystemMock.setup(x => x.getDateModifiedInTicksAsync('/home/user/Music/Track 1.mp3')).returns(async () => 789);

        const trackFiller: TrackFiller = new TrackFiller(
            fileMetadataFactoryMock.object,
            trackFieldCreatorMock.object,
            albumkeyGeneratorMock.object,
            fileSystemMock.object,
            mimTypesMock.object,
            loggerMock.object
        );

        return new TrackFillerMockingHelper(
            trackFiller,
            trackFieldCreatorMock,
            albumkeyGeneratorMock,
            mimTypesMock,
            fileSystemMock
        );
    }
}
