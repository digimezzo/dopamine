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

    let fullSrtLyricsMock: LyricsModel;
    let emptySrtLyricsMock: LyricsModel;

    let fullOnlineLyricsMock: LyricsModel;
    let emptyOnlineLyricsMock: LyricsModel;

    beforeEach(() => {
        embeddedLyricsGetterMock = Mock.ofType<EmbeddedLyricsGetter>();
        lrcLyricsGetterMock = Mock.ofType<LrcLyricsGetter>();
        srtLyricsGetterMock = Mock.ofType<SrtLyricsGetter>();
        onlineLyricsGetterMock = Mock.ofType<OnlineLyricsGetter>();
        settingsMock = Mock.ofType<SettingsBase>();
        loggerMock = Mock.ofType<Logger>();

        trackMock = MockCreator.createTrackModel('path', 'title', 'artists');

        fullEmbeddedLyricsMock = LyricsModel.plain(trackMock, 'embedded source', LyricsSourceType.embedded, 'embedded text');
        emptyEmbeddedLyricsMock = LyricsModel.plain(trackMock, '', LyricsSourceType.none, '');

        fullLrcLyricsMock = LyricsModel.plain(trackMock, 'lrc source', LyricsSourceType.lrc, 'lrc text');
        emptyLrcLyricsMock = LyricsModel.plain(trackMock, '', LyricsSourceType.none, '');

        fullSrtLyricsMock = LyricsModel.plain(trackMock, 'srt source', LyricsSourceType.srt, 'srt text');
        emptySrtLyricsMock = LyricsModel.plain(trackMock, '', LyricsSourceType.none, '');

        fullOnlineLyricsMock = LyricsModel.plain(trackMock, 'online source', LyricsSourceType.online, 'online text');
        emptyOnlineLyricsMock = LyricsModel.plain(trackMock, '', LyricsSourceType.none, '');

        // Default: all getters return empty, rich lyrics enabled, online download disabled
        srtLyricsGetterMock.setup((x) => x.getLyricsAsync(It.isAny())).returns(() => Promise.resolve(emptySrtLyricsMock));
        lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(It.isAny())).returns(() => Promise.resolve(emptyLrcLyricsMock));
        embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(It.isAny())).returns(() => Promise.resolve(emptyEmbeddedLyricsMock));
        onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(It.isAny())).returns(() => Promise.resolve(emptyOnlineLyricsMock));
        settingsMock.setup((x) => x.showRichLyrics).returns(() => true);
        settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => false);
    });

    function createSut(): LyricsServiceBase {
        return new LyricsService(
            embeddedLyricsGetterMock.object,
            lrcLyricsGetterMock.object,
            srtLyricsGetterMock.object,
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
        // --- Priority chain tests ---

        it('should return SRT lyrics when showRichLyrics is enabled and SRT has content', async () => {
            // Arrange
            srtLyricsGetterMock.reset();
            srtLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullSrtLyricsMock));
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.sourceType).toEqual(LyricsSourceType.srt);
            expect(lyrics.plainText).toEqual('srt text');
        });

        it('should prefer SRT over LRC when both have content', async () => {
            // Arrange
            srtLyricsGetterMock.reset();
            srtLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullSrtLyricsMock));
            lrcLyricsGetterMock.reset();
            lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullLrcLyricsMock));
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.sourceType).toEqual(LyricsSourceType.srt);
            lrcLyricsGetterMock.verify((x) => x.getLyricsAsync(It.isAny()), Times.never());
        });

        it('should fall back to LRC when SRT is empty', async () => {
            // Arrange
            lrcLyricsGetterMock.reset();
            lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullLrcLyricsMock));
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.sourceType).toEqual(LyricsSourceType.lrc);
            expect(lyrics.plainText).toEqual('lrc text');
        });

        it('should return embedded lyrics when SRT and LRC are empty', async () => {
            // Arrange
            embeddedLyricsGetterMock.reset();
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullEmbeddedLyricsMock));
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.sourceType).toEqual(LyricsSourceType.embedded);
            expect(lyrics.plainText).toEqual('embedded text');
        });

        it('should prefer embedded over online when embedded has content', async () => {
            // Arrange
            embeddedLyricsGetterMock.reset();
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullEmbeddedLyricsMock));
            settingsMock.reset();
            settingsMock.setup((x) => x.showRichLyrics).returns(() => true);
            settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => true);
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.sourceType).toEqual(LyricsSourceType.embedded);
            onlineLyricsGetterMock.verify((x) => x.getLyricsAsync(It.isAny()), Times.never());
        });

        it('should return online lyrics when all local sources are empty and online download is enabled', async () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.showRichLyrics).returns(() => true);
            settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => true);
            onlineLyricsGetterMock.reset();
            onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullOnlineLyricsMock));
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.sourceType).toEqual(LyricsSourceType.online);
            expect(lyrics.plainText).toEqual('online text');
        });

        it('should return empty lyrics when all sources are empty', async () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.showRichLyrics).returns(() => true);
            settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => true);
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.sourceType).toEqual(LyricsSourceType.none);
            expect(lyrics.plainText).toEqual('');
        });

        it('should return empty lyrics when online download is disabled and all local sources are empty', async () => {
            // Arrange
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.sourceType).toEqual(LyricsSourceType.none);
            expect(lyrics.plainText).toEqual('');
            onlineLyricsGetterMock.verify((x) => x.getLyricsAsync(It.isAny()), Times.never());
        });

        // --- showRichLyrics toggle ---

        it('should skip SRT and LRC when showRichLyrics is disabled', async () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.showRichLyrics).returns(() => false);
            settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => false);
            embeddedLyricsGetterMock.reset();
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullEmbeddedLyricsMock));
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            srtLyricsGetterMock.verify((x) => x.getLyricsAsync(It.isAny()), Times.never());
            lrcLyricsGetterMock.verify((x) => x.getLyricsAsync(It.isAny()), Times.never());
            expect(lyrics.sourceType).toEqual(LyricsSourceType.embedded);
        });

        // --- Cache behavior ---

        it('should return cached online lyrics and not re-download for the same track', async () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.showRichLyrics).returns(() => true);
            settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => true);
            onlineLyricsGetterMock.reset();
            onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullOnlineLyricsMock));
            const sut: LyricsServiceBase = createSut();
            await sut.getLyricsAsync(trackMock);
            onlineLyricsGetterMock.reset();
            onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(It.isAny())).returns(() => Promise.resolve(emptyOnlineLyricsMock));

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            onlineLyricsGetterMock.verify((x) => x.getLyricsAsync(It.isAny()), Times.never());
            expect(lyrics.sourceType).toEqual(LyricsSourceType.online);
            expect(lyrics.plainText).toEqual('online text');
        });

        it('should not return cached lyrics when the track has changed', async () => {
            // Arrange
            const trackMock2 = MockCreator.createTrackModel('path2', 'title2', 'artists2');
            const fullOnlineLyricsMock2 = LyricsModel.plain(trackMock2, 'online source 2', LyricsSourceType.online, 'online text 2');

            settingsMock.reset();
            settingsMock.setup((x) => x.showRichLyrics).returns(() => true);
            settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => true);
            onlineLyricsGetterMock.reset();
            onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullOnlineLyricsMock));
            onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock2)).returns(() => Promise.resolve(fullOnlineLyricsMock2));
            const sut: LyricsServiceBase = createSut();
            await sut.getLyricsAsync(trackMock);

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock2);

            // Assert
            onlineLyricsGetterMock.verify((x) => x.getLyricsAsync(trackMock2), Times.once());
            expect(lyrics.plainText).toEqual('online text 2');
        });

        it('should always re-check local sources even when cache exists', async () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.showRichLyrics).returns(() => true);
            settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => true);
            onlineLyricsGetterMock.reset();
            onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullOnlineLyricsMock));
            const sut: LyricsServiceBase = createSut();
            await sut.getLyricsAsync(trackMock);

            // Now embedded returns content (user added embedded lyrics)
            embeddedLyricsGetterMock.reset();
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullEmbeddedLyricsMock));

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            expect(lyrics.sourceType).toEqual(LyricsSourceType.embedded);
        });

        // --- Error handling ---

        it('should log error and continue to next source when SRT getter throws', async () => {
            // Arrange
            srtLyricsGetterMock.reset();
            srtLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.reject(new Error('SRT read failed')));
            lrcLyricsGetterMock.reset();
            lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullLrcLyricsMock));
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            loggerMock.verify((x) => x.error(It.isAny(), It.isAny(), 'LyricsService', 'getLyricsAsync'), Times.once());
            expect(lyrics.sourceType).toEqual(LyricsSourceType.lrc);
        });

        it('should log error and continue to next source when LRC getter throws', async () => {
            // Arrange
            lrcLyricsGetterMock.reset();
            lrcLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.reject(new Error('LRC read failed')));
            embeddedLyricsGetterMock.reset();
            embeddedLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullEmbeddedLyricsMock));
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            loggerMock.verify((x) => x.error(It.isAny(), It.isAny(), 'LyricsService', 'getLyricsAsync'), Times.once());
            expect(lyrics.sourceType).toEqual(LyricsSourceType.embedded);
        });

        it('should log error and continue when embedded getter throws', async () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.showRichLyrics).returns(() => false);
            settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => true);
            embeddedLyricsGetterMock.reset();
            embeddedLyricsGetterMock
                .setup((x) => x.getLyricsAsync(trackMock))
                .returns(() => Promise.reject(new Error('embedded read failed')));
            onlineLyricsGetterMock.reset();
            onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.resolve(fullOnlineLyricsMock));
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            loggerMock.verify((x) => x.error(It.isAny(), It.isAny(), 'LyricsService', 'getLyricsAsync'), Times.once());
            expect(lyrics.sourceType).toEqual(LyricsSourceType.online);
        });

        it('should log error and return empty when online getter throws', async () => {
            // Arrange
            settingsMock.reset();
            settingsMock.setup((x) => x.showRichLyrics).returns(() => true);
            settingsMock.setup((x) => x.downloadLyricsOnline).returns(() => true);
            onlineLyricsGetterMock.reset();
            onlineLyricsGetterMock.setup((x) => x.getLyricsAsync(trackMock)).returns(() => Promise.reject(new Error('network error')));
            const sut: LyricsServiceBase = createSut();

            // Act
            const lyrics: LyricsModel = await sut.getLyricsAsync(trackMock);

            // Assert
            loggerMock.verify((x) => x.error(It.isAny(), It.isAny(), 'LyricsService', 'getLyricsAsync'), Times.once());
            expect(lyrics.sourceType).toEqual(LyricsSourceType.none);
            expect(lyrics.plainText).toEqual('');
        });
    });
});
