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
    ];

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        translatorServiceMock.setup((x) => x.get('Artist.UnknownArtist')).returns(() => 'Unknown artist');

        settingsMock = new SettingsMock();
    });

    function createArtistSplitter(): ArtistSplitter {
        return new ArtistSplitter(translatorServiceMock.object, settingsMock);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange
            settingsMock.artistSplitSeparators = '';
            settingsMock.artistSplitExceptions = '';

            // Act
            const splitter: ArtistSplitter = createArtistSplitter();

            // Assert
            expect(splitter).toBeDefined();
        });
    });

    describe('splitArtist', () => {
        it('should split without duplicates on all configured separators including pipe for substrings that are not in the exception list', () => {
            // Arrange
            settingsMock.artistSplitSeparators = '[ft.][feat.][&][|]';
            settingsMock.artistSplitExceptions = '[Artist2 & Artist3][Artist6 | Artist7]';

            const splitter: ArtistSplitter = createArtistSplitter();

            // Act
            const splitArtists: ArtistModel[] = splitter.splitArtists(artists);

            // Assert
            expect(splitArtists.length).toEqual(9);

            expect(splitArtists[0].displayName).toEqual('Artist1');
            expect(splitArtists[0].sourceNames.length).toEqual(3);
            expect(splitArtists[0].sourceNames[0]).toEqual('Artist1');
            expect(splitArtists[0].sourceNames[1]).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(splitArtists[0].sourceNames[2]).toEqual('artist1 FT. artist2 & Artist3');

            expect(splitArtists[1].displayName).toEqual('Artist2');
            expect(splitArtists[1].sourceNames.length).toEqual(3);
            expect(splitArtists[1].sourceNames[0]).toEqual('Artist2');
            expect(splitArtists[1].sourceNames[1]).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(splitArtists[1].sourceNames[2]).toEqual('Artist2 ft. Artist3 & Artist4');

            expect(splitArtists[2].displayName).toEqual('Artist3');
            expect(splitArtists[2].sourceNames.length).toEqual(3);
            expect(splitArtists[2].sourceNames[0]).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(splitArtists[2].sourceNames[1]).toEqual('Artist2 ft. Artist3 & Artist4');
            expect(splitArtists[2].sourceNames[2]).toEqual('Artist3 & Artist5');

            expect(splitArtists[3].displayName).toEqual('Artist2 & Artist3');
            expect(splitArtists[3].sourceNames.length).toEqual(1);
            expect(splitArtists[3].sourceNames[0]).toEqual('artist1 FT. artist2 & Artist3');

            expect(splitArtists[4].displayName).toEqual('Artist4');
            expect(splitArtists[4].sourceNames.length).toEqual(2);
            expect(splitArtists[4].sourceNames[0]).toEqual('Artist2 ft. Artist3 & Artist4');
            expect(splitArtists[4].sourceNames[1]).toEqual('artist4');

            expect(splitArtists[5].displayName).toEqual('Artist5');
            expect(splitArtists[5].sourceNames.length).toEqual(2);
            expect(splitArtists[5].sourceNames[0]).toEqual('Artist3 & Artist5');
            expect(splitArtists[5].sourceNames[1]).toEqual('Artist5 | Artist6');

            expect(splitArtists[6].displayName).toEqual('Artist6');
            expect(splitArtists[6].sourceNames.length).toEqual(1);
            expect(splitArtists[6].sourceNames[0]).toEqual('Artist5 | Artist6');

            expect(splitArtists[7].displayName).toEqual('Artist6 | Artist7');
            expect(splitArtists[7].sourceNames.length).toEqual(1);
            expect(splitArtists[7].sourceNames[0]).toEqual('Artist6 | Artist7');

            expect(splitArtists[8].displayName).toEqual('Unknown artist');
            expect(splitArtists[8].sourceNames.length).toEqual(1);
            expect(splitArtists[8].sourceNames[0]).toEqual('');
        });

        it('should split without duplicates on all configured separators excluding pipe for substrings that are not in the exception list', () => {
            // Arrange
            settingsMock.artistSplitSeparators = '[ft.][feat.][&]';
            settingsMock.artistSplitExceptions = '[Artist6 | Artist7]';

            const splitter: ArtistSplitter = createArtistSplitter();

            // Act
            const splitArtists: ArtistModel[] = splitter.splitArtists(artists);

            // Assert
            expect(splitArtists.length).toEqual(8);

            expect(splitArtists[0].displayName).toEqual('Artist1');
            expect(splitArtists[0].sourceNames.length).toEqual(3);
            expect(splitArtists[0].sourceNames[0]).toEqual('Artist1');
            expect(splitArtists[0].sourceNames[1]).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(splitArtists[0].sourceNames[2]).toEqual('artist1 FT. artist2 & Artist3');

            expect(splitArtists[1].displayName).toEqual('Artist2');
            expect(splitArtists[1].sourceNames.length).toEqual(4);
            expect(splitArtists[1].sourceNames[0]).toEqual('Artist2');
            expect(splitArtists[1].sourceNames[1]).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(splitArtists[1].sourceNames[2]).toEqual('artist1 FT. artist2 & Artist3');
            expect(splitArtists[1].sourceNames[3]).toEqual('Artist2 ft. Artist3 & Artist4');

            expect(splitArtists[2].displayName).toEqual('Artist3');
            expect(splitArtists[2].sourceNames.length).toEqual(4);
            expect(splitArtists[2].sourceNames[0]).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(splitArtists[2].sourceNames[1]).toEqual('artist1 FT. artist2 & Artist3');
            expect(splitArtists[2].sourceNames[2]).toEqual('Artist2 ft. Artist3 & Artist4');
            expect(splitArtists[2].sourceNames[3]).toEqual('Artist3 & Artist5');

            expect(splitArtists[3].displayName).toEqual('Artist4');
            expect(splitArtists[3].sourceNames.length).toEqual(2);
            expect(splitArtists[3].sourceNames[0]).toEqual('Artist2 ft. Artist3 & Artist4');
            expect(splitArtists[3].sourceNames[1]).toEqual('artist4');

            expect(splitArtists[4].displayName).toEqual('Artist5');
            expect(splitArtists[4].sourceNames.length).toEqual(1);
            expect(splitArtists[4].sourceNames[0]).toEqual('Artist3 & Artist5');

            expect(splitArtists[5].displayName).toEqual('Artist5 | Artist6');
            expect(splitArtists[5].sourceNames.length).toEqual(1);
            expect(splitArtists[5].sourceNames[0]).toEqual('Artist5 | Artist6');

            expect(splitArtists[6].displayName).toEqual('Artist6 | Artist7');
            expect(splitArtists[6].sourceNames.length).toEqual(1);
            expect(splitArtists[6].sourceNames[0]).toEqual('Artist6 | Artist7');

            expect(splitArtists[7].displayName).toEqual('Unknown artist');
            expect(splitArtists[7].sourceNames.length).toEqual(1);
            expect(splitArtists[7].sourceNames[0]).toEqual('');
        });

        it('should not split on anything without duplicates when there are no separators', () => {
            // Arrange
            settingsMock.artistSplitSeparators = '';
            settingsMock.artistSplitExceptions = '';

            const splitter: ArtistSplitter = createArtistSplitter();

            // Act
            const splitArtists: ArtistModel[] = splitter.splitArtists(artists);

            // Assert
            expect(splitArtists.length).toEqual(10);

            expect(splitArtists[0].displayName).toEqual('Artist1');
            expect(splitArtists[0].sourceNames.length).toEqual(1);
            expect(splitArtists[0].sourceNames[0]).toEqual('Artist1');

            expect(splitArtists[1].displayName).toEqual('Artist2');
            expect(splitArtists[1].sourceNames.length).toEqual(1);
            expect(splitArtists[1].sourceNames[0]).toEqual('Artist2');

            expect(splitArtists[2].displayName).toEqual('Artist1 ft. Artist2 feat. Artist3');
            expect(splitArtists[2].sourceNames.length).toEqual(1);
            expect(splitArtists[2].sourceNames[0]).toEqual('Artist1 ft. Artist2 feat. Artist3');

            expect(splitArtists[3].displayName).toEqual('artist1 FT. artist2 & Artist3');
            expect(splitArtists[3].sourceNames.length).toEqual(1);
            expect(splitArtists[3].sourceNames[0]).toEqual('artist1 FT. artist2 & Artist3');

            expect(splitArtists[4].displayName).toEqual('Artist2 ft. Artist3 & Artist4');
            expect(splitArtists[4].sourceNames.length).toEqual(1);
            expect(splitArtists[4].sourceNames[0]).toEqual('Artist2 ft. Artist3 & Artist4');

            expect(splitArtists[5].displayName).toEqual('artist4');
            expect(splitArtists[5].sourceNames.length).toEqual(1);
            expect(splitArtists[5].sourceNames[0]).toEqual('artist4');

            expect(splitArtists[6].displayName).toEqual('Artist3 & Artist5');
            expect(splitArtists[6].sourceNames.length).toEqual(1);
            expect(splitArtists[6].sourceNames[0]).toEqual('Artist3 & Artist5');

            expect(splitArtists[7].displayName).toEqual('Artist5 | Artist6');
            expect(splitArtists[7].sourceNames.length).toEqual(1);
            expect(splitArtists[7].sourceNames[0]).toEqual('Artist5 | Artist6');

            expect(splitArtists[8].displayName).toEqual('Artist6 | Artist7');
            expect(splitArtists[8].sourceNames.length).toEqual(1);
            expect(splitArtists[8].sourceNames[0]).toEqual('Artist6 | Artist7');

            expect(splitArtists[9].displayName).toEqual('Unknown artist');
            expect(splitArtists[9].sourceNames.length).toEqual(1);
            expect(splitArtists[9].sourceNames[0]).toEqual('');
        });
    });
});
