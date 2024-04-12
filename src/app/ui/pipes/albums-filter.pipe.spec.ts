import { IMock, It, Mock, Times } from 'typemoq';
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
        albumData1.genres = ';genre1_1;genre1_2';
        const album1: AlbumModel = new AlbumModel(albumData1, translatorServiceMock.object, applicationPathsMock.object);
        const albumData2: AlbumData = new AlbumData();
        albumData2.albumTitle = 'album_title2';
        albumData2.albumArtists = ';album_artist2_1;;album_artist2_2;';
        albumData2.year = 2002;
        albumData2.genres = ';genre2_1;genre2_2';
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

        it('performs search once for each album, searching "title", "artist", "year" and "genres', () => {
            // Arrange
            const albums: AlbumModel[] = createAlbumModels();
            const pipe: AlbumsFilterPipe = createPipe();

            // Act
            pipe.transform(albums, 'dummy');

            // Assert
            const expectedTextToSearchAlbum1 = 'album_title1 album_artist1_1 2001 genre1_1 genre1_2';
            const expectedTextToSearchAlbum2 = 'album_title2 album_artist2_1 2002 genre2_1 genre2_2';

            searchServiceMock.verify((x) => x.matchesSearchText(expectedTextToSearchAlbum1, 'dummy'), Times.once());
            searchServiceMock.verify((x) => x.matchesSearchText(expectedTextToSearchAlbum2, 'dummy'), Times.once());
        });

        it('should return only albums for which search returns true', () => {
            // Arrange
            searchServiceMock.setup((x) => x.matchesSearchText(It.isAny(), It.isAny())).returns(() => false);
            searchServiceMock.setup((x) => x.matchesSearchText(It.isAny(), It.isAny())).returns(() => true);

            const albums: AlbumModel[] = createAlbumModels();
            const pipe: AlbumsFilterPipe = createPipe();

            // Act
            const filteredAlbums: AlbumModel[] = pipe.transform(albums, 'dummy');

            // Assert
            expect(filteredAlbums.length).toEqual(1);
            expect(filteredAlbums[0]).toEqual(albums[1]);
        });
    });
});
