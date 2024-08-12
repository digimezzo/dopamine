import { SettingsBase } from '../../common/settings/settings.base';
import { SettingsMock } from '../../testing/settings-mock';
import { ArtistSplitter } from './artist-splitter';

describe('ArtistSplitter', () => {
    let settingsMock: SettingsBase;

    beforeEach(() => {
        settingsMock = new SettingsMock();
        settingsMock.artistSplitSeparators = 'ft.;feat.';
        settingsMock.artistSplitExceptions = 'Artist4 feat. Artist5';
    });

    describe('constructor', () => {
        it('should create', () => {
            // Act
            const splitter: ArtistSplitter = new ArtistSplitter(settingsMock);

            // Assert
            expect(splitter).toBeDefined();
        });
    });

    describe('splitArtist', () => {
        it('should split on all configured separators', () => {
            // Arrange
            const splitter: ArtistSplitter = new ArtistSplitter(settingsMock);

            // Act
            const splitArtist: string[] = splitter.splitArtist('Artist1 ft. Artist2 feat. Artist3');

            // Assert
            expect(splitArtist[0]).toEqual('Artist1');
            expect(splitArtist[1]).toEqual('Artist2');
            expect(splitArtist[2]).toEqual('Artist3');
        });

        it('should not split on a configured separators when the given text is in the exceptions list', () => {
            // Arrange
            const splitter: ArtistSplitter = new ArtistSplitter(settingsMock);

            // Act
            const splitArtist: string[] = splitter.splitArtist('Artist1 ft. Artist4 feat. Artist5');

            // Assert
            expect(splitArtist[0]).toEqual('Artist4 feat. Artist5');
            expect(splitArtist[1]).toEqual('Artist1');
        });
    });
});
