import { SettingsBase } from '../../common/settings/settings.base';
import { SettingsMock } from '../../testing/settings-mock';
import { ArtistSplitter } from './artist-splitter';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { IMock, Mock } from 'typemoq';
import { ArtistModel } from './artist-model';

describe('ArtistSplitter', () => {
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let settingsMock: SettingsBase;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        settingsMock = new SettingsMock();
    });

    function createArtistSplitter(): ArtistSplitter {
        return new ArtistSplitter(translatorServiceMock.object, settingsMock);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Act
            settingsMock.artistSplitSeparators = '';
            settingsMock.artistSplitExceptions = '';
            const splitter: ArtistSplitter = createArtistSplitter();

            // Assert
            expect(splitter).toBeDefined();
        });
    });

    describe('splitArtist', () => {
        it('should not split when there are no configured separators and there are no configured exceptions', () => {
            // Arrange
            settingsMock.artistSplitSeparators = '';
            settingsMock.artistSplitExceptions = '';
            const splitter: ArtistSplitter = createArtistSplitter();

            // Act
            const artists: ArtistModel[] = splitter.splitArtist('Artist1 ft. Artist2 feat. Artist3');

            // Assert
            expect(artists.length).toEqual(1);
            expect(artists[0].originalName).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(artists[0].name).toEqual('Artist1 ft. Artist2 feat. Artist3');
        });

        it('should not split when there are no configured separators and there are configured exceptions', () => {
            // Arrange
            settingsMock.artistSplitSeparators = '';
            settingsMock.artistSplitExceptions = 'Artist2 & Artist3';
            const splitter: ArtistSplitter = createArtistSplitter();

            // Act
            const artists: ArtistModel[] = splitter.splitArtist('Artist1 ft. Artist2 feat. Artist3');

            // Assert
            expect(artists.length).toEqual(1);
            expect(artists[0].originalName).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(artists[0].name).toEqual('Artist1 ft. Artist2 feat. Artist3');
        });

        it('should split on all configured separators', () => {
            // Arrange
            settingsMock.artistSplitSeparators = 'ft.;feat.;&';
            settingsMock.artistSplitExceptions = 'Artist2 & Artist3';
            const splitter: ArtistSplitter = createArtistSplitter();

            // Act
            const artists: ArtistModel[] = splitter.splitArtist('Artist1 ft. Artist2 feat. Artist3');

            // Assert
            expect(artists.length).toEqual(3);
            expect(artists[0].originalName).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(artists[0].name).toEqual('Artist1');
            expect(artists[1].originalName).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(artists[1].name).toEqual('Artist2');
            expect(artists[2].originalName).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(artists[2].name).toEqual('Artist3');
        });

        it('should not split on a configured separators when the given text is in the exceptions list', () => {
            // Arrange
            settingsMock.artistSplitSeparators = 'ft.;feat.;&';
            settingsMock.artistSplitExceptions = 'Artist2 & Artist3';
            const splitter: ArtistSplitter = createArtistSplitter();

            // Act
            const artists: ArtistModel[] = splitter.splitArtist('Artist1 ft. Artist2 & Artist3');

            // Assert
            expect(artists.length).toEqual(2);
            expect(artists[0].originalName).toEqual('Artist1 ft. Artist2 & Artist3');
            expect(artists[0].name).toEqual('Artist2 & Artist3');
            expect(artists[1].originalName).toEqual('Artist1 ft. Artist2 & Artist3');
            expect(artists[1].name).toEqual('Artist1');
        });
    });
});
