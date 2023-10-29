import { EmbeddedLyricsGetter } from './embedded-lyrics-getter';
import { LrcLyricsGetter } from './lrc-lyrics-getter';
import { MockCreator } from '../../testing/mock-creator';
import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { TrackModel } from '../track/track-model';

describe('LrcLyricsGetter', () => {
    function createInstance(): LrcLyricsGetter {
        return new LrcLyricsGetter();
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
        it('should return the lrc lyrics', async () => {
            // Arrange
            const track: TrackModel = MockCreator.createTrackModel('path', 'title', 'artists');
            const instance: LrcLyricsGetter = createInstance();

            // Act
            const lyrics: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyrics.sourceName).toEqual('');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.lrc);
            expect(lyrics.text).toEqual('');
        });
    });
});
