import { BaseLyricsService } from './base-lyrics.service';
import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';

describe('LyricsModel', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const instance = new LyricsModel('sourceName', LyricsSourceType.embedded, 'text');

            // Assert
            expect(instance).toBeDefined();
        });

        it('should set sourceName', () => {
            // Arrange, Act
            const instance = new LyricsModel('sourceName', LyricsSourceType.embedded, 'text');

            // Assert
            expect(instance.sourceName).toEqual('sourceName');
        });

        it('should set sourceType', () => {
            // Arrange, Act
            const instance = new LyricsModel('sourceName', LyricsSourceType.embedded, 'text');

            // Assert
            expect(instance.sourceType).toEqual(LyricsSourceType.embedded);
        });

        it('should set text', () => {
            // Arrange, Act
            const instance = new LyricsModel('sourceName', LyricsSourceType.embedded, 'text');

            // Assert
            expect(instance.text).toEqual('text');
        });
    });
});
