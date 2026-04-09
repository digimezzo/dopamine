import { SrtLyricsGetter } from './srt-lyrics-getter';
import { MockCreator } from '../../testing/mock-creator';
import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { TrackModel } from '../track/track-model';
import { IMock, Mock } from 'typemoq';
import { FileAccessBase } from '../../common/io/file-access.base';

describe('SrtLyricsGetter', () => {
    let fileAccessMock: IMock<FileAccessBase>;

    beforeEach(() => {
        fileAccessMock = Mock.ofType<FileAccessBase>();
    });

    function createInstance(): SrtLyricsGetter {
        return new SrtLyricsGetter(fileAccessMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const instance: SrtLyricsGetter = createInstance();

            // Assert
            expect(instance).toBeDefined();
        });
    });

    describe('getLyricsAsync', () => {
        it('should return srt lyrics with correct timestamps if srt file exists', async () => {
            // Arrange
            const track: TrackModel = MockCreator.createTrackModel('/path/to/audio/file.mp3', 'title', 'artists');
            fileAccessMock.setup((x) => x.getPathWithoutExtension(track.path)).returns(() => '/path/to/audio/file');
            fileAccessMock.setup((x) => x.pathExists('/path/to/audio/file.srt')).returns(() => true);

            const srtFileLines: string[] = [
                '1',
                '00:00:01,000 --> 00:00:04,000',
                'First subtitle',
                '',
                '2',
                '00:00:05,000 --> 00:00:08,500',
                'Second subtitle',
                '',
                '3',
                '00:00:10,200 --> 00:00:14,800',
                'Third subtitle',
            ];

            fileAccessMock.setup((x) => x.readLinesAsync('/path/to/audio/file.srt')).returns(() => Promise.resolve(srtFileLines));
            const instance: SrtLyricsGetter = createInstance();

            // Act
            const lyrics: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyrics.track).toEqual(track);
            expect(lyrics.sourceName).toEqual('');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.srt);
            expect(lyrics.plainText).toEqual('First subtitle\nSecond subtitle\nThird subtitle');
            expect(lyrics.textLines).toEqual(['First subtitle', 'Second subtitle', 'Third subtitle']);
            expect(lyrics.startTimeStamps).toEqual([1, 5, 10.2]);
            expect(lyrics.endTimeStamps).toEqual([4, 8.5, 14.8]);
        });

        it('should handle multi-line subtitle text', async () => {
            // Arrange
            const track: TrackModel = MockCreator.createTrackModel('/path/to/audio/file.mp3', 'title', 'artists');
            fileAccessMock.setup((x) => x.getPathWithoutExtension(track.path)).returns(() => '/path/to/audio/file');
            fileAccessMock.setup((x) => x.pathExists('/path/to/audio/file.srt')).returns(() => true);

            const srtFileLines: string[] = [
                '1',
                '00:00:01,000 --> 00:00:04,000',
                'First line of subtitle',
                'Second line of subtitle',
                '',
                '2',
                '00:00:05,000 --> 00:00:08,000',
                'Single line',
            ];

            fileAccessMock.setup((x) => x.readLinesAsync('/path/to/audio/file.srt')).returns(() => Promise.resolve(srtFileLines));
            const instance: SrtLyricsGetter = createInstance();

            // Act
            const lyrics: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyrics.textLines).toEqual(['First line of subtitle Second line of subtitle', 'Single line']);
            expect(lyrics.plainText).toEqual('First line of subtitle Second line of subtitle\nSingle line');
            expect(lyrics.startTimeStamps).toEqual([1, 5]);
        });

        it('should handle extra blank lines between blocks', async () => {
            // Arrange
            const track: TrackModel = MockCreator.createTrackModel('/path/to/audio/file.mp3', 'title', 'artists');
            fileAccessMock.setup((x) => x.getPathWithoutExtension(track.path)).returns(() => '/path/to/audio/file');
            fileAccessMock.setup((x) => x.pathExists('/path/to/audio/file.srt')).returns(() => true);

            const srtFileLines: string[] = [
                '',
                '1',
                '00:00:01,000 --> 00:00:04,000',
                'First subtitle',
                '',
                '',
                '',
                '2',
                '00:00:05,000 --> 00:00:08,000',
                'Second subtitle',
                '',
            ];

            fileAccessMock.setup((x) => x.readLinesAsync('/path/to/audio/file.srt')).returns(() => Promise.resolve(srtFileLines));
            const instance: SrtLyricsGetter = createInstance();

            // Act
            const lyrics: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyrics.textLines).toEqual(['First subtitle', 'Second subtitle']);
            expect(lyrics.startTimeStamps).toEqual([1, 5]);
        });

        it('should handle timestamps with periods instead of commas', async () => {
            // Arrange
            const track: TrackModel = MockCreator.createTrackModel('/path/to/audio/file.mp3', 'title', 'artists');
            fileAccessMock.setup((x) => x.getPathWithoutExtension(track.path)).returns(() => '/path/to/audio/file');
            fileAccessMock.setup((x) => x.pathExists('/path/to/audio/file.srt')).returns(() => true);

            const srtFileLines: string[] = ['1', '00:01:30.500 --> 00:01:35.200', 'A subtitle line'];

            fileAccessMock.setup((x) => x.readLinesAsync('/path/to/audio/file.srt')).returns(() => Promise.resolve(srtFileLines));
            const instance: SrtLyricsGetter = createInstance();

            // Act
            const lyrics: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyrics.startTimeStamps).toEqual([90.5]);
            expect(lyrics.endTimeStamps).toEqual([95.2]);
        });

        it('should skip malformed timecode lines', async () => {
            // Arrange
            const track: TrackModel = MockCreator.createTrackModel('/path/to/audio/file.mp3', 'title', 'artists');
            fileAccessMock.setup((x) => x.getPathWithoutExtension(track.path)).returns(() => '/path/to/audio/file');
            fileAccessMock.setup((x) => x.pathExists('/path/to/audio/file.srt')).returns(() => true);

            const srtFileLines: string[] = ['1', 'not a timecode', 'Some text', '', '2', '00:00:05,000 --> 00:00:08,000', 'Valid subtitle'];

            fileAccessMock.setup((x) => x.readLinesAsync('/path/to/audio/file.srt')).returns(() => Promise.resolve(srtFileLines));
            const instance: SrtLyricsGetter = createInstance();

            // Act
            const lyrics: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyrics.plainText).toEqual('Valid subtitle');
            expect(lyrics.textLines).toEqual(['Valid subtitle']);
            expect(lyrics.startTimeStamps).toEqual([5]);
        });

        it('should return empty lyrics if srt file exists but is empty', async () => {
            // Arrange
            const track: TrackModel = MockCreator.createTrackModel('/path/to/audio/file.mp3', 'title', 'artists');
            fileAccessMock.setup((x) => x.getPathWithoutExtension(track.path)).returns(() => '/path/to/audio/file');
            fileAccessMock.setup((x) => x.pathExists('/path/to/audio/file.srt')).returns(() => true);

            const srtFileLines: string[] = [];

            fileAccessMock.setup((x) => x.readLinesAsync('/path/to/audio/file.srt')).returns(() => Promise.resolve(srtFileLines));
            const instance: SrtLyricsGetter = createInstance();

            // Act
            const lyrics: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyrics.track).toEqual(track);
            expect(lyrics.sourceName).toEqual('');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.none);
            expect(lyrics.plainText).toEqual('');
        });

        it('should return empty lyrics if srt file does not exist', async () => {
            // Arrange
            const track: TrackModel = MockCreator.createTrackModel('/path/to/audio/file.mp3', 'title', 'artists');
            fileAccessMock.setup((x) => x.getPathWithoutExtension(track.path)).returns(() => '/path/to/audio/file');
            fileAccessMock.setup((x) => x.pathExists('/path/to/audio/file.srt')).returns(() => false);

            const instance: SrtLyricsGetter = createInstance();

            // Act
            const lyrics: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyrics.track).toEqual(track);
            expect(lyrics.sourceName).toEqual('');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.none);
            expect(lyrics.plainText).toEqual('');
        });
    });
});
