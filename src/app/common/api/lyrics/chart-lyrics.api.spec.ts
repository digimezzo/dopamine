import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ChartLyricsApi } from './chart-lyrics.api';

describe('ChartLyricsApi', () => {
    it('should encode accented artist and title values as query parameters', async () => {
        // Arrange
        const response = '<GetLyricResult><Lyric>Lyrics</Lyric></GetLyricResult>';
        const get = jest.fn().mockReturnValue(of(response));
        const api = new ChartLyricsApi({ get } as unknown as HttpClient);

        // Act
        await api.getLyricsAsync('Beyoncé', 'Corazón & Más');

        // Assert
        expect(get).toHaveBeenCalledWith(
            'http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist=Beyonc%C3%A9&song=Coraz%C3%B3n%20%26%20M%C3%A1s',
            { responseType: 'text' },
        );
    });
});
