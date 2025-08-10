import { LyricsService } from './lyrics.service';
import { IMock, It, Mock, Times } from 'typemoq';
import { EmbeddedLyricsGetter } from './embedded-lyrics-getter';
import { LrcLyricsGetter } from './lrc-lyrics-getter';
import { OnlineLyricsGetter } from './online-lyrics-getter';
import { SettingsBase } from '../../common/settings/settings.base';
import { MockCreator } from '../../testing/mock-creator';
import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { Logger } from '../../common/logger';
import { LyricsServiceBase } from './lyrics.service.base';
import { TrackModel } from '../track/track-model';
import { SrtLyricsGetter } from './srt-lyrics-getter';

describe('LyricsService', () => {
    let embeddedLyricsGetterMock: IMock<EmbeddedLyricsGetter>;
    let lrcLyricsGetterMock: IMock<LrcLyricsGetter>;
    let srtLyricsGetterMock: IMock<SrtLyricsGetter>;
    let onlineLyricsGetterMock: IMock<OnlineLyricsGetter>;
    let settingsMock: IMock<SettingsBase>;
    let loggerMock: IMock<Logger>;

    let trackMock: TrackModel;
    let fullEmbeddedLyricsMock: LyricsModel;
    let emptyEmbeddedLyricsMock: LyricsModel;

    let fullLrcLyricsMock: LyricsModel;
    let emptyLrcLyricsMock: LyricsModel;

    let fullOnlineLyricsMock: LyricsModel;
    let emptyOnlineLyricsMock: LyricsModel;

    beforeEach(() => {
        embeddedLyricsGetterMock = Mock.ofType<EmbeddedLyricsGetter>();
        lrcLyricsGetterMock = Mock.ofType<LrcLyricsGetter>();
        onlineLyricsGetterMock = Mock.ofType<OnlineLyricsGetter>();
        settingsMock = Mock.ofType<SettingsBase>();
        loggerMock = Mock.ofType<Logger>();

        trackMock = MockCreator.createTrackModel('path', 'title', 'artists');

        fullEmbeddedLyricsMock = LyricsModel.createSimple(trackMock, 'embedded source', LyricsSourceType.embedded, 'embedded text');
        emptyEmbeddedLyricsMock = LyricsModel.createSimple(trackMock, '', LyricsSourceType.none, '');

        fullLrcLyricsMock = LyricsModel.createSimple(trackMock, 'lrc source', LyricsSourceType.lrc, 'lrc text');
        emptyLrcLyricsMock = LyricsModel.createSimple(trackMock, '', LyricsSourceType.none, '');

        fullOnlineLyricsMock = LyricsModel.createSimple(trackMock, 'online source', LyricsSourceType.online, 'online text');
        emptyOnlineLyricsMock = LyricsModel.createSimple(trackMock, '', LyricsSourceType.none, '');
    });

    function createSut(): LyricsServiceBase {
        return new LyricsService(
            embeddedLyricsGetterMock.object,
            lrcLyricsGetterMock.object,
            onlineLyricsGetterMock.object,
            srtLyricsGetterMock.object,
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
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullEmbeddedLyricsMock));
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.track).toBe(trackMock);
            expect(lyrics.sourceName).toEqual('embedded source');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.embedded);
            expect(lyrics.text).toEqual('embedded text');
        });

        it('should still get embedded lyrics even if there are cached lyrics', async () => {
            // Arrange
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullEmbeddedLyricsMock));
            const sut: LyricsServiceBase = createSut();
            await sut.getLyricsAsync(trackMock);
            embeddedLyricsGetterMock.reset();
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullEmbeddedLyricsMock));

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            embeddedLyricsGetterMock.verify((x) => x.getLyricsAsync(trackMock), Times.once());
            expect(lyrics.track).toBe(trackMock);
            expect(lyrics.sourceName).toEqual('embedded source');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.embedded);
            expect(lyrics.text).toEqual('embedded text');
        });

        it('should return lrc lyrics if there are no embedded lyrics but there are lrc lyrics', async () => {
            // Arrange
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(emptyEmbeddedLyricsMock));
            lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullLrcLyricsMock));
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.track).toBe(trackMock);
            expect(lyrics.sourceName).toEqual('lrc source');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.lrc);
            expect(lyrics.text).toEqual('lrc text');
        });

        it('should still get lrc lyrics even if there are cached lyrics', async () => {
            // Arrange
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(emptyOnlineLyricsMock));
            lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullLrcLyricsMock));
            const sut: LyricsServiceBase = createSut();
            await sut.getLyricsAsync(trackMock);
            lrcLyricsGetterMock.reset();
            lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullLrcLyricsMock));

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            lrcLyricsGetterMock.verify((x) => x.getLyricsAsync(trackMock), Times.once());
            expect(lyrics.track).toBe(trackMock);
            expect(lyrics.sourceName).toEqual('lrc source');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.lrc);
            expect(lyrics.text).toEqual('lrc text');
        });

        it('should return online lyrics if there are no embedded lyrics and no lrc lyrics but there are online lyrics and online download is enabled', async () => {
            // Arrange
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(emptyEmbeddedLyricsMock));
            lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(emptyLrcLyricsMock));
            onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullOnlineLyricsMock));
            settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => true);
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.track).toBe(trackMock);
            expect(lyrics.sourceName).toEqual('online source');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.online);
            expect(lyrics.text).toEqual('online text');
        });

        it('should return empty lyrics if there are no embedded lyrics and no lrc lyrics but there are online lyrics and online download is disabled', async () => {
            // Arrange
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(emptyEmbeddedLyricsMock));
            lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(emptyLrcLyricsMock));
            onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullOnlineLyricsMock));
            settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => false);
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.track).toEqual(trackMock);
            expect(lyrics.sourceName).toEqual('');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.none);
            expect(lyrics.text).toEqual('');
        });

        it('should return empty lyrics if there are no embedded lyrics and no lrc lyrics and no online lyrics', async () => {
            // Arrange
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(emptyEmbeddedLyricsMock));
            lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(emptyLrcLyricsMock));
            onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(emptyOnlineLyricsMock));
            settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => true);
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.track).toEqual(trackMock);
            expect(lyrics.sourceName).toEqual('');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.none);
            expect(lyrics.text).toEqual('');
        });

        it('should return cached lyrics and not download lyrics when there are no embedded lyrics and no lrc lyrics but there are cached lyrics and online download is enabled', async () => {
            // Arrange
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(emptyEmbeddedLyricsMock));
            lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(emptyLrcLyricsMock));
            onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullOnlineLyricsMock));
            settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => true);
            const sut: LyricsServiceBase = createSut();
            await sut.getLyricsAsync(trackMock);
            onlineLyricsGetterMock.reset();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            onlineLyricsGetterMock.verify((x) => x.getLyricsAsync(It.isAny()), Times.never());
            expect(lyrics.track).toBe(trackMock);
            expect(lyrics.sourceName).toEqual('online source');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.online);
            expect(lyrics.text).toEqual('online text');
        });

        it('should not return cached lyrics and should download new lyrics when the track has changed', async () => {
            // Arrange
            const trackMock2 = MockCreator.createTrackModel('path2', 'title2', 'artists2');

            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(emptyEmbeddedLyricsMock));
            lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(emptyLrcLyricsMock));
            onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullOnlineLyricsMock));

            settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => true);
            const sut: LyricsServiceBase = createSut();
            await sut.getLyricsAsync(trackMock);
            embeddedLyricsGetterMock.reset();
            lrcLyricsGetterMock.reset();
            onlineLyricsGetterMock.reset();

            const fullOnlineLyricsMock2 = LyricsModel.createSimple(trackMock2, 'online source', LyricsSourceType.online, 'online text 2');
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock2)).returns(() => Promise.resolve(emptyEmbeddedLyricsMock));
            lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock2)).returns(() => Promise.resolve(emptyLrcLyricsMock));
            onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock2)).returns(() => Promise.resolve(fullOnlineLyricsMock2));

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock2);

            // Assert
            onlineLyricsGetterMock.verify((x) => x.getLyricsAsync(trackMock2), Times.once());
            expect(lyrics.track).toBe(trackMock2);
            expect(lyrics.sourceName).toEqual('online source');
            expect(lyrics.sourceType).toEqual(LyricsSourceType.online);
            expect(lyrics.text).toEqual('online text 2');
        });
    });
});
