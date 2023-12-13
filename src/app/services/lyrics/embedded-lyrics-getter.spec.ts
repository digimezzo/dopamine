import { IMock, Mock } from 'typemoq';
import { EmbeddedLyricsGetter } from './embedded-lyrics-getter';
import { MockCreator } from '../../testing/mock-creator';
import { IFileMetadata } from '../../common/metadata/i-file-metadata';
import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { FileMetadataFactoryBase } from '../../common/metadata/file-metadata.factory.base';

describe('EmbeddedLyricsGetter', () => {
    let fileMetadataFactoryMock: IMock<FileMetadataFactoryBase>;

    beforeEach(() => {
        fileMetadataFactoryMock = Mock.ofType<FileMetadataFactoryBase>();
    });

    function createInstance(): EmbeddedLyricsGetter {
        return new EmbeddedLyricsGetter(fileMetadataFactoryMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const instance: EmbeddedLyricsGetter = createInstance();

            // Assert
            expect(instance).toBeDefined();
        });
    });

    describe('getLyricsAsync', () => {
        it('should return the file metadata lyrics if there are any', async () => {
            // Arrange
            const track = MockCreator.createTrackModel('path', 'title', 'artists');
            const metadataMock: IFileMetadata = { lyrics: 'lyrics' } as IFileMetadata;
            fileMetadataFactoryMock.setup((x) => x.createAsync(track.path)).returns(() => Promise.resolve(metadataMock));
            const instance: EmbeddedLyricsGetter = createInstance();

            // Act
            const lyrics: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyrics.track).toEqual(track);
            expect(lyrics.sourceName).toEqual('');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.embedded);
            expect(lyrics.text).toEqual('lyrics');
        });

        it('should return empty lyrics if there are no metadata lyrics', async () => {
            // Arrange
            const track = MockCreator.createTrackModel('path', 'title', 'artists');
            const metadataMock: IFileMetadata = { lyrics: '' } as IFileMetadata;
            fileMetadataFactoryMock.setup((x) => x.createAsync(track.path)).returns(() => Promise.resolve(metadataMock));
            const instance: EmbeddedLyricsGetter = createInstance();

            // Act
            const lyrics: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyrics.track).toEqual(track);
            expect(lyrics.sourceName).toEqual('');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.none);
            expect(lyrics.text).toEqual('');
        });
    });
});
