import { IMock, It, Mock } from 'typemoq';
import { AlbumsFilterPipe } from './albums-filter.pipe';
import { SearchServiceBase } from '../../services/search/search.service.base';
import { TranslatorServiceBase } from '../../services/translator/translator.service.base';
import { FileAccess } from '../../common/io/file-access';
import { AlbumModel } from '../../services/album/album-model';
import { AlbumData } from '../../data/entities/album-data';
import { ApplicationPaths } from '../../common/application/application-paths';

describe('AlbumsFilterPipe', () => {
    let searchServiceMock: IMock<SearchServiceBase>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let fileAccessMock: IMock<FileAccess>;
    let applicationPathsMock = Mock.ofType<ApplicationPaths>();

    function createPipe(): AlbumsFilterPipe {
        return new AlbumsFilterPipe(searchServiceMock.object);
    }

    function createAlbumModels(): AlbumModel[] {
        const albumData1: AlbumData = new AlbumData();
        albumData1.albumTitle = 'album_title1';
        albumData1.albumArtists = ';album_artist1_1;;album_artist1_2;';
        albumData1.year = 2001;
        const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
        const albumData2: AlbumData = new AlbumData();
        albumData2.albumTitle = 'album_title2';
        albumData2.albumArtists = ';album_artist2_1;;album_artist2_2;';
        albumData2.year = 2002;
        const album2: AlbumModel = new AlbumModel(albumData2, translatorServiceMock.object, applicationPathsMock.object);
        return [album1, album2];
    }

    beforeEach(() => {
        searchServiceMock = Mock.ofType<SearchServiceBase>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        fileAccessMock = Mock.ofType<FileAccess>();
        applicationPathsMock = Mock.ofType<ApplicationPaths>();
    });

    describe('transform', () => {
        it('should return the given albums if textToContain is undefined', () => {
            // Arrange
            const albums: AlbumModel[] = createAlbumModels();
            const pipe: AlbumsFilterPipe = createPipe();

            // Act
            const filteredAlbums: AlbumModel[] = pipe.transform(albums, undefined);

            // Assert
            expect(filteredAlbums).toEqual(albums);
        });

        it('should return the given albums if textToContain is empty', () => {
            // Arrange
            const albums: AlbumModel[] = createAlbumModels();
            const pipe: AlbumsFilterPipe = createPipe();

            // Act
            const filteredAlbums: AlbumModel[] = pipe.transform(albums, '');

            // Assert
            expect(filteredAlbums).toEqual(albums);
        });

        it('should return the given albums if textToContain is space', () => {
            // Arrange
            const albums: AlbumModel[] = createAlbumModels();
            const pipe: AlbumsFilterPipe = createPipe();

            // Act
            const filteredAlbums: AlbumModel[] = pipe.transform(albums, ' ');

            // Assert
            expect(filteredAlbums).toEqual(albums);
        });

        it('should return only albums with a title containing the search text', () => {
            // Arrange
            searchServiceMock.setup((x) => x.matchesSearchText('album_title1', It.isAny())).returns(() => true);
            searchServiceMock.setup((x) => x.matchesSearchText('album_title2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('album_artist1_1', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('album_artist2_1', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('2001', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('2002', It.isAny())).returns(() => false);

            const albums: AlbumModel[] = createAlbumModels();
            const pipe: AlbumsFilterPipe = createPipe();

            // Act
            const filteredAlbums: AlbumModel[] = pipe.transform(albums, 'dummy');

            // Assert
            expect(filteredAlbums.length).toEqual(1);
            expect(filteredAlbums[0]).toEqual(albums[0]);
        });

        it('should return only albums with album artists containing the search text', () => {
            // Arrange
            searchServiceMock.setup((x) => x.matchesSearchText('album_title1', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('album_title2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('album_artist1_1', It.isAny())).returns(() => true);
            searchServiceMock.setup((x) => x.matchesSearchText('album_artist2_1', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('2001', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('2002', It.isAny())).returns(() => false);

            const albums: AlbumModel[] = createAlbumModels();
            const pipe: AlbumsFilterPipe = createPipe();

            // Act
            const filteredAlbums: AlbumModel[] = pipe.transform(albums, 'dummy');

            // Assert
            expect(filteredAlbums.length).toEqual(1);
            expect(filteredAlbums[0]).toEqual(filteredAlbums[0]);
        });

        it('should return only albums with a year containing the search text', () => {
            // Arrange
            searchServiceMock.setup((x) => x.matchesSearchText('album_title1', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('album_title2', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('album_artist1_1', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('album_artist2_1', It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText('2001', It.isAny())).returns(() => true);
            searchServiceMock.setup((x) => x.matchesSearchText('2002', It.isAny())).returns(() => false);

            const albums: AlbumModel[] = createAlbumModels();
            const pipe: AlbumsFilterPipe = createPipe();

            // Act
            const filteredAlbums: AlbumModel[] = pipe.transform(albums, 'dummy');

            // Assert
            expect(filteredAlbums.length).toEqual(1);
            expect(filteredAlbums[0]).toEqual(filteredAlbums[0]);
        });
    });
});
