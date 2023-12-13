import { LrcLyricsGetter } from './lrc-lyrics-getter';
import { MockCreator } from '../../testing/mock-creator';
import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { TrackModel } from '../track/track-model';
import { IMock, Mock } from 'typemoq';
import { FileAccessBase } from '../../common/io/file-access.base';

describe('LrcLyricsGetter', () => {
    let fileAccessMock: IMock<FileAccessBase>;

    beforeEach(() => {
        fileAccessMock = Mock.ofType<FileAccessBase>();
    });

    function createInstance(): LrcLyricsGetter {
        return new LrcLyricsGetter(fileAccessMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const instance: LrcLyricsGetter = createInstance();

            // Assert
            expect(instance).toBeDefined();
        });
    });

    describe('getLyricsAsync', () => {
        it('should return the lrc lyrics ignoring timestamps and metadata if lrc file exists', async () => {
            // Arrange
            const track: TrackModel = MockCreator.createTrackModel('/path/to/audio/file.mp3', 'title', 'artists');
            fileAccessMock.setup((x) => x.getPathWithoutExtension(track.path)).returns(() => '/path/to/audio/file');
            fileAccessMock.setup((x) => x.pathExists('/path/to/audio/file.lrc')).returns(() => true);

            const lrcFileLines: string[] = [
                '[ar:Chubby Checker oppure  Beatles, The]',
                "[al:Hits Of The 60's - Vol. 2 – Oldies]",
                "[ti:Let's Twist Again]",
                '[au:Written by Kal Mann / Dave Appell, 1961]',
                '[length: 2:23]',
                '[00:12.00]Line 1 lyrics',
                '[00:17.20]Line 2 lyrics',
                '[00:21.10]Line 3 lyrics',
                '[00:24.00]Line 4 lyrics',
                '[00:28.25]Line 5 lyrics',
                '[00:29.02]Line 6 lyrics',
            ];

            fileAccessMock.setup((x) => x.readLinesAsync('/path/to/audio/file.lrc')).returns(() => Promise.resolve(lrcFileLines));
            const instance: LrcLyricsGetter = createInstance();

            // Act
            const lyrics: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyrics.track).toEqual(track);
            expect(lyrics.sourceName).toEqual('');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.lrc);
            expect(lyrics.text).toEqual('Line 1 lyrics\nLine 2 lyrics\nLine 3 lyrics\nLine 4 lyrics\nLine 5 lyrics\nLine 6 lyrics');
        });

        it('should return empty lyrics if lrc file exists but is empty', async () => {
            // Arrange
            const track: TrackModel = MockCreator.createTrackModel('/path/to/audio/file.mp3', 'title', 'artists');
            fileAccessMock.setup((x) => x.getPathWithoutExtension(track.path)).returns(() => '/path/to/audio/file');
            fileAccessMock.setup((x) => x.pathExists('/path/to/audio/file.lrc')).returns(() => true);

            const lrcFileLines: string[] = [];

            fileAccessMock.setup((x) => x.readLinesAsync('/path/to/audio/file.lrc')).returns(() => Promise.resolve(lrcFileLines));
            const instance: LrcLyricsGetter = createInstance();

            // Act
            const lyrics: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyrics.track).toEqual(track);
            expect(lyrics.sourceName).toEqual('');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.none);
            expect(lyrics.text).toEqual('');
        });

        it('should return empty lyrics if lrc file does not exist', async () => {
            // Arrange
            const track: TrackModel = MockCreator.createTrackModel('/path/to/audio/file.mp3', 'title', 'artists');
            fileAccessMock.setup((x) => x.getPathWithoutExtension(track.path)).returns(() => '/path/to/audio/file');
            fileAccessMock.setup((x) => x.pathExists('/path/to/audio/file.lrc')).returns(() => false);

            const instance: LrcLyricsGetter = createInstance();

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
