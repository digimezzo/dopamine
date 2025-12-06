import { ApplicationPaths } from './application-paths';
import { DesktopBase } from '../io/desktop.base';
import { IMock, Mock } from 'typemoq';
import { FileAccessBase } from '../io/file-access.base';

describe('ApplicationPaths', () => {
    let fileAccessMock: IMock<FileAccessBase>;
    let desktopMock: IMock<DesktopBase>;

    beforeEach(() => {
        fileAccessMock = Mock.ofType<FileAccessBase>();
        desktopMock = Mock.ofType<DesktopBase>();

        fileAccessMock
            .setup((x) => x.combinePath(['C:\\Users\\User\\AppData\\Roaming\\Dopamine', 'Cache', 'CoverArt']))
            .returns(() => 'C:\\Users\\User\\AppData\\Roaming\\Dopamine\\Cache\\CoverArt');
        fileAccessMock
            .setup((x) => x.combinePath(['C:\\Users\\User\\AppData\\Roaming\\Dopamine\\Cache\\CoverArt', 'theId.jpg']))
            .returns(() => 'C:\\Users\\User\\AppData\\Roaming\\Dopamine\\Cache\\CoverArt\\theId.jpg');
        fileAccessMock
            .setup((x) => x.combinePath(['C:\\Users\\User\\Music', 'Dopamine', 'Playlists']))
            .returns(() => 'C:\\Users\\User\\Music\\Dopamine\\Playlists');
        fileAccessMock
            .setup((x) => x.combinePath(['C:\\Users\\User\\AppData\\Roaming\\Dopamine', 'Themes']))
            .returns(() => 'C:\\Users\\User\\AppData\\Roaming\\Dopamine\\Themes');
        desktopMock.setup((x) => x.getApplicationDataDirectory()).returns(() => 'C:\\Users\\User\\AppData\\Roaming\\Dopamine');
        desktopMock.setup((x) => x.getMusicDirectory()).returns(() => 'C:\\Users\\User\\Music');
    });

    function createSut(): ApplicationPaths {
        return new ApplicationPaths(fileAccessMock.object, desktopMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const sut: ApplicationPaths = createSut();

            // Assert
            expect(sut).toBeDefined();
        });
    });

    describe('coverArtCacheFullPath', () => {
        it('should return cover art cache full path', () => {
            // Arrange
            const sut: ApplicationPaths = createSut();

            // Act

            // Act, Assert
            expect(sut.coverArtCacheFullPath()).toEqual('C:\\Users\\User\\AppData\\Roaming\\Dopamine\\Cache\\CoverArt');
        });
    });

    describe('coverArtFullPath', () => {
        it('should return cover art full path', () => {
            // Arrange
            const sut: ApplicationPaths = createSut();

            // Act

            // Act, Assert
            expect(sut.coverArtFullPath('theId')).toEqual('C:\\Users\\User\\AppData\\Roaming\\Dopamine\\Cache\\CoverArt\\theId.jpg');
        });
    });

    describe('themesDirectoryFullPath', () => {
        it('should return themes directory full path', () => {
            // Arrange
            const sut: ApplicationPaths = createSut();

            // Act

            // Act, Assert
            expect(sut.themesDirectoryFullPath()).toEqual('C:\\Users\\User\\AppData\\Roaming\\Dopamine\\Themes');
        });
    });
});
