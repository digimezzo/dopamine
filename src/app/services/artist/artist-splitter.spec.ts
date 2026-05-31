import { SettingsMock } from '../../testing/settings-mock';
import { ArtistSplitter } from './artist-splitter';
import { SettingsBase } from '../../common/settings/settings.base';

describe('ArtistSplitter', () => {
    let settingsMock: SettingsBase;
    let splitter: ArtistSplitter;

    const artists: string[] = [
        'Artist1',
        'artist1',
        'Artist2',
        'Artist1 ft. Artist2 feat. Artist3',
        'artist1 FT. artist2 & Artist3',
        'Artist2 ft. Artist3 & Artist4',
        'artist4',
        'Artist3 & Artist5',
        'Artist5 | Artist6',
        'Artist6 | Artist7',
        '',
        'Artist2ft.Artist3& Artist4',
    ];

    beforeEach(() => {
        settingsMock = new SettingsMock();
        splitter = new ArtistSplitter(settingsMock);
    });

    describe('splitArtist', () => {
        it('should split without duplicates on all configured separators including pipe for substrings that are not in the exception list', () => {
            // Arrange
            settingsMock.artistSplitSeparators = '[ft.][feat.][&][|]';
            settingsMock.artistSplitExceptions = '[Artist2 & Artist3][Artist6 | Artist7]';

            // Act
            const splitArtists: string[] = splitter.splitArtists(artists);

            // Assert
            expect(splitArtists.length).toEqual(10);
            expect(splitArtists).toContain('Artist1');
            expect(splitArtists).toContain('Artist2');
            expect(splitArtists).toContain('Artist3');
            expect(splitArtists).toContain('Artist2 & Artist3');
            expect(splitArtists).toContain('Artist4');
            expect(splitArtists).toContain('Artist5');
            expect(splitArtists).toContain('Artist6');
            expect(splitArtists).toContain('Artist6 | Artist7');
            expect(splitArtists).toContain('');
            expect(splitArtists).toContain('Artist2ft.Artist3& Artist4');
        });

        it('should split without duplicates on all configured separators excluding pipe for substrings that are not in the exception list', () => {
            // Arrange
            settingsMock.artistSplitSeparators = '[ft.][feat.][&]';
            settingsMock.artistSplitExceptions = '[Artist6 | Artist7]';

            // Act
            const splitArtists: string[] = splitter.splitArtists(artists);

            // Assert
            expect(splitArtists.length).toEqual(9);
            expect(splitArtists).toContain('Artist1');
            expect(splitArtists).toContain('Artist2');
            expect(splitArtists).toContain('Artist3');
            expect(splitArtists).toContain('Artist4');
            expect(splitArtists).toContain('Artist5');
            expect(splitArtists).toContain('Artist5 | Artist6');
            expect(splitArtists).toContain('Artist6 | Artist7');
            expect(splitArtists).toContain('');
            expect(splitArtists).toContain('Artist2ft.Artist3& Artist4');
        });

        it('should not split on anything without duplicates when there are no separators', () => {
            // Arrange
            settingsMock.artistSplitSeparators = '';
            settingsMock.artistSplitExceptions = '';

            // Act
            const splitArtists: string[] = splitter.splitArtists(artists);

            // Assert
            expect(splitArtists.length).toEqual(11);
            expect(splitArtists).toContain('Artist1');
            expect(splitArtists).toContain('Artist2');
            expect(splitArtists).toContain('Artist1 ft. Artist2 feat. Artist3');
            expect(splitArtists).toContain('artist1 FT. artist2 & Artist3');
            expect(splitArtists).toContain('Artist2 ft. Artist3 & Artist4');
            expect(splitArtists).toContain('artist4');
            expect(splitArtists).toContain('Artist3 & Artist5');
            expect(splitArtists).toContain('Artist5 | Artist6');
            expect(splitArtists).toContain('Artist6 | Artist7');
            expect(splitArtists).toContain('');
            expect(splitArtists).toContain('Artist2ft.Artist3& Artist4');
        });
    });
});
