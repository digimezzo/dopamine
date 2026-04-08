import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { TrackModel } from '../track/track-model';
import { MockCreator } from '../../testing/mock-creator';

describe('LyricsModel', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const trackMock: TrackModel = MockCreator.createTrackModel('path', 'trackTitle', 'artists');
            const instance = LyricsModel.plain(trackMock, 'sourceName', LyricsSourceType.embedded, 'text');

            // Assert
            expect(instance).toBeDefined();
        });

        it('should set sourceName', () => {
            // Arrange, Act
            const trackMock: TrackModel = MockCreator.createTrackModel('path', 'trackTitle', 'artists');
            const instance = LyricsModel.plain(trackMock, 'sourceName', LyricsSourceType.embedded, 'text');

            // Assert
            expect(instance.sourceName).toEqual('sourceName');
        });

        it('should set sourceType', () => {
            // Arrange, Act
            const trackMock: TrackModel = MockCreator.createTrackModel('path', 'trackTitle', 'artists');
            const instance = LyricsModel.plain(trackMock, 'sourceName', LyricsSourceType.embedded, 'text');

            // Assert
            expect(instance.sourceType).toEqual(LyricsSourceType.embedded);
        });

        it('should set text', () => {
            // Arrange, Act
            const trackMock: TrackModel = MockCreator.createTrackModel('path', 'trackTitle', 'artists');
            const instance = LyricsModel.plain(trackMock, 'sourceName', LyricsSourceType.embedded, 'text');

            // Assert
            expect(instance.plainText).toEqual('text');
        });
    });

    describe('simple', () => {
        it('should set empty lyricList, startTimeStamps, and endTimeStamps', () => {
            // Arrange, Act
            const trackMock: TrackModel = MockCreator.createTrackModel('path', 'trackTitle', 'artists');
            const instance = LyricsModel.plain(trackMock, 'sourceName', LyricsSourceType.embedded, 'text');

            // Assert
            expect(instance.textLines).toEqual([]);
            expect(instance.startTimeStamps).toEqual([]);
            expect(instance.endTimeStamps).toEqual([]);
        });
    });

    describe('timed', () => {
        it('should set all properties with empty endTimeStamps', () => {
            // Arrange
            const trackMock: TrackModel = MockCreator.createTrackModel('path', 'trackTitle', 'artists');
            const lyricList: string[] = ['Line 1', 'Line 2'];
            const startTimeStamps: number[] = [5, 10];

            // Act
            const instance = LyricsModel.timed(trackMock, 'source', LyricsSourceType.lrc, 'Line 1\nLine 2', lyricList, startTimeStamps);

            // Assert
            expect(instance.track).toEqual(trackMock);
            expect(instance.sourceName).toEqual('source');
            expect(instance.sourceType).toEqual(LyricsSourceType.lrc);
            expect(instance.plainText).toEqual('Line 1\nLine 2');
            expect(instance.textLines).toEqual(['Line 1', 'Line 2']);
            expect(instance.startTimeStamps).toEqual([5, 10]);
            expect(instance.endTimeStamps).toEqual([]);
        });
    });

    describe('doubleTimed', () => {
        it('should set all properties including endTimeStamps', () => {
            // Arrange
            const trackMock: TrackModel = MockCreator.createTrackModel('path', 'trackTitle', 'artists');
            const lyricList: string[] = ['Line 1', 'Line 2'];
            const startTimeStamps: number[] = [5, 10];
            const endTimeStamps: number[] = [9, 15];

            // Act
            const instance = LyricsModel.doubleTimed(
                trackMock,
                'source',
                LyricsSourceType.srt,
                'Line 1\nLine 2',
                lyricList,
                startTimeStamps,
                endTimeStamps,
            );

            // Assert
            expect(instance.track).toEqual(trackMock);
            expect(instance.sourceName).toEqual('source');
            expect(instance.sourceType).toEqual(LyricsSourceType.srt);
            expect(instance.plainText).toEqual('Line 1\nLine 2');
            expect(instance.textLines).toEqual(['Line 1', 'Line 2']);
            expect(instance.startTimeStamps).toEqual([5, 10]);
            expect(instance.endTimeStamps).toEqual([9, 15]);
        });
    });

    describe('empty', () => {
        it('should set all properties to empty/default values', () => {
            // Arrange
            const trackMock: TrackModel = MockCreator.createTrackModel('path', 'trackTitle', 'artists');

            // Act
            const instance = LyricsModel.empty(trackMock);

            // Assert
            expect(instance.track).toEqual(trackMock);
            expect(instance.sourceName).toEqual('');
            expect(instance.sourceType).toEqual(LyricsSourceType.none);
            expect(instance.plainText).toEqual('');
            expect(instance.textLines).toEqual([]);
            expect(instance.startTimeStamps).toEqual([]);
            expect(instance.endTimeStamps).toEqual([]);
        });

        it('should handle undefined track', () => {
            // Arrange, Act
            const instance = LyricsModel.empty(undefined);

            // Assert
            expect(instance.track).toBeUndefined();
            expect(instance.sourceType).toEqual(LyricsSourceType.none);
        });
    });
});
