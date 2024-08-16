import { SettingsBase } from '../../common/settings/settings.base';
import { SettingsMock } from '../../testing/settings-mock';
import { ArtistSplitter } from './artist-splitter';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { IMock, Mock } from 'typemoq';
import { ArtistModel } from './artist-model';

describe('ArtistSplitter', () => {
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let settingsMock: SettingsBase;

    let artists: string[] = [
        'Artist1',
        'Artist2',
        'Artist1 ft. Artist2 feat. Artist3',
        'Artist1 ft. Artist2 & Artist3',
        'Artist2 ft. Artist3 & Artist4',
        'Artist4',
        'Artist3 & Artist5',
    ];

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        settingsMock = new SettingsMock();
        settingsMock.artistSplitSeparators = 'ft.;feat.;&';
        settingsMock.artistSplitExceptions = 'Artist2 & Artist3';
    });

    function createArtistSplitter(): ArtistSplitter {
        return new ArtistSplitter(translatorServiceMock.object, settingsMock);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Act
            const splitter: ArtistSplitter = createArtistSplitter();

            // Assert
            expect(splitter).toBeDefined();
        });
    });

    describe('splitArtist', () => {
        it('should split on all configured separators for substrings that are not in the exception list', () => {
            // Arrange
            const splitter: ArtistSplitter = createArtistSplitter();

            // Act
            const splitArtists: ArtistModel[] = splitter.splitArtists(artists);

            // Assert
            expect(splitArtists.length).toEqual(6);

            expect(splitArtists[0].name).toEqual('Artist1');
            expect(splitArtists[0].sourceNames.length).toEqual(3);
            expect(splitArtists[0].sourceNames[0]).toEqual('Artist1');
            expect(splitArtists[0].sourceNames[1]).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(splitArtists[0].sourceNames[2]).toEqual('Artist1 ft. Artist2 & Artist3');

            expect(splitArtists[1].name).toEqual('Artist2');
            expect(splitArtists[1].sourceNames.length).toEqual(3);
            expect(splitArtists[1].sourceNames[0]).toEqual('Artist2');
            expect(splitArtists[1].sourceNames[1]).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(splitArtists[1].sourceNames[2]).toEqual('Artist2 ft. Artist3 & Artist4');

            expect(splitArtists[2].name).toEqual('Artist3');
            expect(splitArtists[2].sourceNames.length).toEqual(3);
            expect(splitArtists[2].sourceNames[0]).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(splitArtists[2].sourceNames[1]).toEqual('Artist2 ft. Artist3 & Artist4');
            expect(splitArtists[2].sourceNames[2]).toEqual('Artist3 & Artist5');

            expect(splitArtists[3].name).toEqual('Artist2 & Artist3');
            expect(splitArtists[3].sourceNames.length).toEqual(1);
            expect(splitArtists[3].sourceNames[0]).toEqual('Artist1 ft. Artist2 & Artist3');

            expect(splitArtists[4].name).toEqual('Artist4');
            expect(splitArtists[4].sourceNames.length).toEqual(2);
            expect(splitArtists[4].sourceNames[0]).toEqual('Artist2 ft. Artist3 & Artist4');
            expect(splitArtists[4].sourceNames[1]).toEqual('Artist4');

            expect(splitArtists[5].name).toEqual('Artist5');
            expect(splitArtists[5].sourceNames.length).toEqual(1);
            expect(splitArtists[5].sourceNames[0]).toEqual('Artist3 & Artist5');
        });
    });
});
