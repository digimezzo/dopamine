import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { TrackModel } from '../track/track-model';
import { MockCreator } from '../../testing/mock-creator';

describe('LyricsModel', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const trackMock: TrackModel = MockCreator.createTrackModel('path', 'trackTitle', 'artists');
            const instance = new LyricsModel(trackMock, 'sourceName', LyricsSourceType.embedded, 'text', undefined, undefined);

            // Assert
            expect(instance).toBeDefined();
        });

        it('should set sourceName', () => {
            // Arrange, Act
            const trackMock: TrackModel = MockCreator.createTrackModel('path', 'trackTitle', 'artists');
            const instance = new LyricsModel(trackMock, 'sourceName', LyricsSourceType.embedded, 'text', undefined, undefined);

            // Assert
            expect(instance.sourceName).toEqual('sourceName');
        });

        it('should set sourceType', () => {
            // Arrange, Act
            const trackMock: TrackModel = MockCreator.createTrackModel('path', 'trackTitle', 'artists');
            const instance = new LyricsModel(trackMock, 'sourceName', LyricsSourceType.embedded, 'text', undefined, undefined);

            // Assert
            expect(instance.sourceType).toEqual(LyricsSourceType.embedded);
        });

        it('should set text', () => {
            // Arrange, Act
            const trackMock: TrackModel = MockCreator.createTrackModel('path', 'trackTitle', 'artists');
            const instance = new LyricsModel(trackMock, 'sourceName', LyricsSourceType.embedded, 'text', undefined, undefined);

            // Assert
            expect(instance.text).toEqual('text');
        });
    });
});
