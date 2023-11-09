import { LyricsService } from './lyrics.service';
import { IMock, Mock } from 'typemoq';
import { EmbeddedLyricsGetter } from './embedded-lyrics-getter';
import { LrcLyricsGetter } from './lrc-lyrics-getter';
import { OnlineLyricsGetter } from './online-lyrics-getter';
import { SettingsBase } from '../../common/settings/settings.base';
import { MockCreator } from '../../testing/mock-creator';
import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { Logger } from '../../common/logger';
import { LyricsServiceBase } from './lyrics.service.base';

describe('LyricsService', () => {
    let embeddedLyricsGetterMock: IMock<EmbeddedLyricsGetter>;
    let lrcLyricsGetterMock: IMock<LrcLyricsGetter>;
    let onlineLyricsGetterMock: IMock<OnlineLyricsGetter>;
    let settingsMock: IMock<SettingsBase>;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        embeddedLyricsGetterMock = Mock.ofType<EmbeddedLyricsGetter>();
        lrcLyricsGetterMock = Mock.ofType<LrcLyricsGetter>();
        onlineLyricsGetterMock = Mock.ofType<OnlineLyricsGetter>();
        settingsMock = Mock.ofType<SettingsBase>();
        loggerMock = Mock.ofType<Logger>();
    });

    function createSut(): LyricsServiceBase {
        return new LyricsService(
            embeddedLyricsGetterMock.object,
            lrcLyricsGetterMock.object,
            onlineLyricsGetterMock.object,
            settingsMock.object,
            loggerMock.object,
        );
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const sut: LyricsServiceBase = createSut();

            // Assert
            expect(sut).toBeDefined();
        });
    });

    describe('getLyricsAsync', () => {
        it('should return embedded lyrics if there are embedded lyrics', async () => {
            // Arrange
            const trackMock = MockCreator.createTrackModel('path', 'title', 'artists');
            const lyricsMock: LyricsModel = new LyricsModel('embedded source', LyricsSourceType.embedded, 'embedded text');
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(lyricsMock));
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.sourceName).toEqual('embedded source');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.embedded);
            expect(lyrics.text).toEqual('embedded text');
        });

        it('should return lrc lyrics if there are no embedded lyrics but there are lrc lyrics', async () => {
            // Arrange
            const trackMock = MockCreator.createTrackModel('path', 'title', 'artists');
            const embeddedLyricsMock: LyricsModel = new LyricsModel('embedded source', LyricsSourceType.embedded, '');
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(embeddedLyricsMock));
            const lrcLyricsMock: LyricsModel = new LyricsModel('lrc source', LyricsSourceType.lrc, 'lrc text');
            lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(lrcLyricsMock));
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.sourceName).toEqual('lrc source');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.lrc);
            expect(lyrics.text).toEqual('lrc text');
        });

        it('should return online lyrics if there are no embedded lyrics and no lrc lyrics but there are online lyrics and online download is enabled', async () => {
            // Arrange
            const trackMock = MockCreator.createTrackModel('path', 'title', 'artists');
            const embeddedLyricsMock: LyricsModel = new LyricsModel('embedded source', LyricsSourceType.embedded, '');
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(embeddedLyricsMock));
            const lrcLyricsMock: LyricsModel = new LyricsModel('lrc source', LyricsSourceType.lrc, '');
            lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(lrcLyricsMock));
            const onlineLyricsMock: LyricsModel = new LyricsModel('online source', LyricsSourceType.online, 'online text');
            onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(onlineLyricsMock));
            settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => true);
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.sourceName).toEqual('online source');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.online);
            expect(lyrics.text).toEqual('online text');
        });

        it('should return empty lyrics if there are no embedded lyrics and no lrc lyrics but there are online lyrics and online download is disabled', async () => {
            // Arrange
            const trackMock = MockCreator.createTrackModel('path', 'title', 'artists');
            const embeddedLyricsMock: LyricsModel = new LyricsModel('embedded source', LyricsSourceType.embedded, '');
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(embeddedLyricsMock));
            const lrcLyricsMock: LyricsModel = new LyricsModel('lrc source', LyricsSourceType.lrc, '');
            lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(lrcLyricsMock));
            const onlineLyricsMock: LyricsModel = new LyricsModel('online source', LyricsSourceType.online, 'online text');
            onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(onlineLyricsMock));
            settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => false);
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.sourceName).toEqual('');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.none);
            expect(lyrics.text).toEqual('');
        });

        it('should return empty lyrics if there are no embedded lyrics and no lrc lyrics and no online lyrics', async () => {
            // Arrange
            const trackMock = MockCreator.createTrackModel('path', 'title', 'artists');
            const embeddedLyricsMock: LyricsModel = new LyricsModel('embedded source', LyricsSourceType.embedded, '');
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(embeddedLyricsMock));
            const lrcLyricsMock: LyricsModel = new LyricsModel('lrc source', LyricsSourceType.lrc, '');
            lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(lrcLyricsMock));
            const onlineLyricsMock: LyricsModel = new LyricsModel('online source', LyricsSourceType.online, '');
            onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(onlineLyricsMock));
            settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => true);
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.sourceName).toEqual('');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.none);
            expect(lyrics.text).toEqual('');
        });
    });
});
