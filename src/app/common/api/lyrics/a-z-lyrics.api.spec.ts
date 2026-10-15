import { AZLyricsApi } from './a-z-lyrics.api';
import { HttpClient } from '@angular/common/http';

describe('AZLyricsApi', () => {
    it('should remove accents from artist and title while preserving the existing slug format', () => {
        // Arrange
        const api = new AZLyricsApi({} as unknown as HttpClient);
        const buildUrl = (api as unknown as { buildUrl: (artist: string, title: string) => string }).buildUrl;

        // Act
        const url = buildUrl.call(api, 'Beyoncé', 'Corazón & Más!');

        // Assert
        expect(url).toEqual('https://azlyrics.com/lyrics/beyonce/corazonmas.html');
    });
});
