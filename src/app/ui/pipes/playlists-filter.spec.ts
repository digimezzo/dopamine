import { IMock, It, Mock } from 'typemoq';
import { FileAccess } from '../common/io/file-access';
import { PlaylistModel } from '../services/playlist/playlist-model';
import { BaseSearchService } from '../services/search/base-search.service';
import { BaseTranslatorService } from '../services/translator/base-translator.service';
import { PlaylistsFilterPipe } from './playlists-filter';

describe('PlaylistsFilterPipe', () => {
    let searchServiceMock: IMock<BaseSearchService>;
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let fileAccessMock: IMock<FileAccess>;

    function createPipe(): PlaylistsFilterPipe {
        return new PlaylistsFilterPipe(searchServiceMock.object);
    }

    function createPlaylistModels(): PlaylistModel[] {
        const playlist1: PlaylistModel = new PlaylistModel(
            'Playlist 1',
            'Playlist 1 folder name',
            'Playlist 1 path',
            'Playlist 1 image path'
        );
        const playlist2: PlaylistModel = new PlaylistModel(
            'Playlist 2',
            'Playlist 2 folder name',
            'Playlist 2 path',
            'Playlist 2 image path'
        );
        const playlists: PlaylistModel[] = [playlist1, playlist2];

        return playlists;
    }

    beforeEach(() => {
        searchServiceMock = Mock.ofType<BaseSearchService>();
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        fileAccessMock = Mock.ofType<FileAccess>();
    });

    describe('transform', () => {
        it('should return the given playlists if textToContain is undefined', () => {
            // Arrange
            const playlists: PlaylistModel[] = createPlaylistModels();
            const pipe: PlaylistsFilterPipe = createPipe();

            // Act
            const filteredPlaylists: PlaylistModel[] = pipe.transform(playlists, undefined);

            // Assert
            expect(filteredPlaylists).toEqual(playlists);
        });

        it('should return the given playlists if textToContain is empty', () => {
            // Arrange
            const playlists: PlaylistModel[] = createPlaylistModels();
            const pipe: PlaylistsFilterPipe = createPipe();

            // Act
            const filteredPlaylists: PlaylistModel[] = pipe.transform(playlists, '');

            // Assert
            expect(filteredPlaylists).toEqual(playlists);
        });

        it('should return the given playlists if textToContain is space', () => {
            // Arrange
            const playlists: PlaylistModel[] = createPlaylistModels();
            const pipe: PlaylistsFilterPipe = createPipe();

            // Act
            const filteredPlaylists: PlaylistModel[] = pipe.transform(playlists, ' ');

            // Assert
            expect(filteredPlaylists).toEqual(playlists);
        });

        it('should return only playlists with a name containing the search text', () => {
            // Arrange
            searchServiceMock.setup((x) => x.matchesSearchText('Playlist 2', It.isAny())).returns(() => true);
            searchServiceMock.setup((x) => x.matchesSearchText('Playlist 1', It.isAny())).returns(() => false);

            const playlists: PlaylistModel[] = createPlaylistModels();
            const pipe: PlaylistsFilterPipe = createPipe();

            // Act
            const filteredPlaylists: PlaylistModel[] = pipe.transform(playlists, 'dummy');

            // Assert
            expect(filteredPlaylists.length).toEqual(1);
            expect(filteredPlaylists[0]).toEqual(playlists[1]);
        });
    });
});
