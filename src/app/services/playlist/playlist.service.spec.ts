// import { Observable, Subject, Subscription } from 'rxjs';
// import { IMock, Mock, Times } from 'typemoq';
// import { FileSystem } from '../../common/io/file-system';
// import { Logger } from '../../common/logger';
// import { TextSanitizer } from '../../common/text-sanitizer';
// import { BasePlaylistService } from './base-playlist.service';
// import { PlaylistFolderModel } from './playlist-folder-model';
// import { PlaylistFolderModelFactory } from './playlist-folder-model-factory';
// import { PlaylistModel } from './playlist-model';
// import { PlaylistModelFactory } from './playlist-model-factory';
// import { PlaylistService } from './playlist.service';

describe('PlaylistService', () => {
    test.todo('should write tests');
});

// describe('PlaylistService', () => {
//     let playlistFolderModelFactoryMock: IMock<PlaylistFolderModelFactory>;
//     let playlistModelFactoryMock: IMock<PlaylistModelFactory>;
//     let fileSystemMock: IMock<FileSystem>;
//     let textSanitizerMock: IMock<TextSanitizer>;
//     let loggerMock: IMock<Logger>;

//     const playlistFoldersChanged: Subject<void> = new Subject();
//     let playlistFoldersChanged$: Observable<void>;

//     function createService(): BasePlaylistService {
//         return new PlaylistService(
//             playlistFolderModelFactoryMock.object,
//             playlistModelFactoryMock.object,
//             fileSystemMock.object,
//             textSanitizerMock.object,
//             loggerMock.object
//         );
//     }

//     function createPlaylistFolders(): PlaylistFolderModel[] {
//         const playlistFolder1: PlaylistFolderModel = new PlaylistFolderModel('Folder 1', '/home/User/Music/Dopamine/Playlists/Folder 1');
//         const playlistFolder2: PlaylistFolderModel = new PlaylistFolderModel('Folder 2', '/home/User/Music/Dopamine/Playlists/Folder 2');

//         return [playlistFolder1, playlistFolder2];
//     }

//     beforeEach(() => {
//         playlistFolderModelFactoryMock = Mock.ofType<PlaylistFolderModelFactory>();
//         playlistModelFactoryMock = Mock.ofType<PlaylistModelFactory>();
//         fileSystemMock = Mock.ofType<FileSystem>();
//         textSanitizerMock = Mock.ofType<TextSanitizer>();
//         loggerMock = Mock.ofType<Logger>();

//         playlistFoldersChanged$ = playlistFoldersChanged.asObservable();

//         playlistFolderModelFactoryMock
//             .setup((x) => x.create('/home/User/Music/Dopamine/Playlists'))
//             .returns(() => new PlaylistFolderModel('Playlists', '/home/User/Music/Dopamine/Playlists', true));

//         playlistFolderModelFactoryMock
//             .setup((x) => x.create('/home/User/Music/Dopamine/Playlists/Folder 1'))
//             .returns(() => new PlaylistFolderModel('Folder 1', '/home/User/Music/Dopamine/Playlists/Folder 1', true));

//         playlistFolderModelFactoryMock
//             .setup((x) => x.create('/home/User/Music/Dopamine/Playlists/Folder 2'))
//             .returns(() => new PlaylistFolderModel('Folder 2', '/home/User/Music/Dopamine/Playlists/Folder 2', true));

//         playlistModelFactoryMock
//             .setup((x) => x.create('/home/User/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u'))
//             .returns(
//                 () =>
//                     new PlaylistModel(
//                         'Playlist 1',
//                         '/home/User/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u',
//                         '/home/User/Music/Dopamine/Playlists/Folder 1/Playlist 1.png'
//                     )
//             );
//         playlistModelFactoryMock
//             .setup((x) => x.create('/home/User/Music/Dopamine/Playlists/Folder 2/Playlist 2.m3u'))
//             .returns(
//                 () =>
//                     new PlaylistModel(
//                         'Playlist 2',
//                         '/home/User/Music/Dopamine/Playlists/Folder 2/Playlist 2.m3u',
//                         '/home/User/Music/Dopamine/Playlists/Folder 2/Playlist 2.png'
//                     )
//             );

//         fileSystemMock.setup((x) => x.musicDirectory()).returns(() => '/home/User/Music');
//         fileSystemMock
//             .setup((x) => x.combinePath(['/home/User/Music', 'Dopamine', 'Playlists']))
//             .returns(() => '/home/User/Music/Dopamine/Playlists');

//         fileSystemMock
//             .setup((x) => x.combinePath(['/home/User/Music/Dopamine/Playlists', 'My playlist folder']))
//             .returns(() => '/home/User/Music/Dopamine/Playlists/My playlist folder');

//         fileSystemMock
//             .setup((x) => x.getDirectoriesInDirectoryAsync('/home/User/Music/Dopamine/Playlists'))
//             .returns(async () => ['/home/User/Music/Dopamine/Playlists/Folder 1', '/home/User/Music/Dopamine/Playlists/Folder 2']);

//         fileSystemMock
//             .setup((x) => x.getFilesInDirectoryAsync('/home/User/Music/Dopamine/Playlists/Folder 1'))
//             .returns(async () => ['/home/User/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u']);

//         fileSystemMock
//             .setup((x) => x.getFilesInDirectoryAsync('/home/User/Music/Dopamine/Playlists/Folder 2'))
//             .returns(async () => ['/home/User/Music/Dopamine/Playlists/Folder 2/Playlist 2.m3u']);

//         fileSystemMock.setup((x) => x.getFileExtension('/home/User/Music/Dopamine/Playlists/File1.txt')).returns(() => '.txt');
//         fileSystemMock.setup((x) => x.getFileExtension('/home/User/Music/Dopamine/Playlists/File1.m3u')).returns(() => '.m3u');
//         fileSystemMock.setup((x) => x.getFileExtension('/home/User/Music/Dopamine/Playlists/File2.m3u8')).returns(() => '.m3u8');

//         textSanitizerMock.setup((x) => x.sanitize('My dirty playlist folder')).returns(() => 'My playlist folder');
//         textSanitizerMock.setup((x) => x.sanitize('My new dirty playlist folder')).returns(() => 'My new playlist folder');
//     });

//     describe('constructor', () => {
//         it('should create', () => {
//             // Arrange

//             // Act
//             const service: BasePlaylistService = createService();

//             // Assert
//             expect(service).toBeDefined();
//         });

//         it('should ensure that the playlists folder exists', () => {
//             // Arrange

//             // Act
//             const service: BasePlaylistService = createService();

//             // Assert
//             fileSystemMock.verify((x) => x.createFullDirectoryPathIfDoesNotExist('/home/User/Music/Dopamine/Playlists'), Times.once());
//         });

//         it('should define playlistFoldersChanged$', () => {
//             // Arrange

//             // Act
//             const service: BasePlaylistService = createService();

//             // Assert
//             expect(service.playlistFoldersChanged$).toBeDefined();
//         });
//     });

//     describe('createPlaylistFolder', () => {
//         it('should throw an error if playlistFolderName is undefined', () => {
//             // Arrange
//             const service: BasePlaylistService = createService();

//             // Act

//             // Assert
//             expect(() => service.createPlaylistFolder(undefined)).toThrow(Error);
//         });

//         it('should throw an error if playlistFolderName is empty', () => {
//             // Arrange
//             const service: BasePlaylistService = createService();

//             // Act

//             // Assert
//             expect(() => service.createPlaylistFolder('')).toThrow(Error);
//         });

//         it('should throw an error if playlistFolderName is space', () => {
//             // Arrange
//             const service: BasePlaylistService = createService();

//             // Act

//             // Assert
//             expect(() => service.createPlaylistFolder(' ')).toThrow(Error);
//         });

//         it('should sanitize playlistFolderName', () => {
//             // Arrange
//             const service: BasePlaylistService = createService();

//             // Act
//             service.createPlaylistFolder('My dirty playlist folder');

//             // Assert
//             textSanitizerMock.verify((x) => x.sanitize('My dirty playlist folder'), Times.once());
//         });

//         it('should create the playlist folder directory if it does not exist', () => {
//             // Arrange
//             const service: BasePlaylistService = createService();

//             // Act
//             service.createPlaylistFolder('My dirty playlist folder');

//             // Assert
//             fileSystemMock.verify(
//                 (x) => x.createFullDirectoryPathIfDoesNotExist('/home/User/Music/Dopamine/Playlists/My playlist folder'),
//                 Times.once()
//             );
//         });

//         it('should notify that the playlist folders have changed', () => {
//             // Arrange
//             const service: BasePlaylistService = createService();

//             const subscription: Subscription = new Subscription();
//             let wasNotified: boolean = false;

//             subscription.add(
//                 service.playlistFoldersChanged$.subscribe(() => {
//                     wasNotified = true;
//                 })
//             );

//             // Act
//             service.createPlaylistFolder('My dirty playlist folder');

//             // Assert
//             expect(wasNotified).toBeTruthy();
//         });
//     });

//     describe('getPlaylistFoldersAsync', () => {
//         it('should get the playlist folders without parent folder if there are no files in the parent folder', async () => {
//             // Arrange
//             fileSystemMock.setup((x) => x.getFilesInDirectoryAsync('/home/User/Music/Dopamine/Playlists')).returns(async () => []);

//             const service: BasePlaylistService = createService();

//             // Act
//             const playlistFolders: PlaylistFolderModel[] = await service.getPlaylistFoldersAsync();

//             // Assert
//             expect(playlistFolders.length).toEqual(2);
//             expect(playlistFolders[0].path).toEqual('/home/User/Music/Dopamine/Playlists/Folder 1');
//             expect(playlistFolders[1].path).toEqual('/home/User/Music/Dopamine/Playlists/Folder 2');
//         });

//         it('should get the playlist folders without parent folder if there are files which are not playlists in the parent folder', async () => {
//             // Arrange
//             fileSystemMock
//                 .setup((x) => x.getFilesInDirectoryAsync('/home/User/Music/Dopamine/Playlists'))
//                 .returns(async () => ['/home/User/Music/Dopamine/Playlists/File1.txt']);

//             const service: BasePlaylistService = createService();

//             // Act
//             const playlistFolders: PlaylistFolderModel[] = await service.getPlaylistFoldersAsync();

//             // Assert
//             expect(playlistFolders.length).toEqual(2);
//             expect(playlistFolders[0].path).toEqual('/home/User/Music/Dopamine/Playlists/Folder 1');
//             expect(playlistFolders[1].path).toEqual('/home/User/Music/Dopamine/Playlists/Folder 2');
//         });

//         it('should get the playlist folders with parent folder if there are playlist files in the parent folder', async () => {
//             // Arrange
//             fileSystemMock
//                 .setup((x) => x.getFilesInDirectoryAsync('/home/User/Music/Dopamine/Playlists'))
//                 .returns(async () => ['/home/User/Music/Dopamine/Playlists/File1.m3u']);

//             const service: BasePlaylistService = createService();

//             // Act
//             const playlistFolders: PlaylistFolderModel[] = await service.getPlaylistFoldersAsync();

//             // Assert
//             expect(playlistFolders.length).toEqual(3);
//             expect(playlistFolders[0].path).toEqual('/home/User/Music/Dopamine/Playlists');
//             expect(playlistFolders[1].path).toEqual('/home/User/Music/Dopamine/Playlists/Folder 1');
//             expect(playlistFolders[2].path).toEqual('/home/User/Music/Dopamine/Playlists/Folder 2');
//         });
//     });

//     describe('deletePlaylistFolder', () => {
//         it('should delete the playlist folder', async () => {
//             // Arrange
//             const service: BasePlaylistService = createService();
//             const playlistFolders: PlaylistFolderModel[] = createPlaylistFolders();

//             // Act
//             service.deletePlaylistFolder(playlistFolders[0]);

//             // Assert
//             fileSystemMock.verify((x) => x.deleteDirectoryRecursively(playlistFolders[0].path), Times.once());
//         });

//         it('should notify that the playlist folders have changed', async () => {
//             // Arrange
//             const service: BasePlaylistService = createService();
//             const playlistFolders: PlaylistFolderModel[] = createPlaylistFolders();

//             const subscription: Subscription = new Subscription();
//             let wasNotified: boolean = false;

//             subscription.add(
//                 service.playlistFoldersChanged$.subscribe(() => {
//                     wasNotified = true;
//                 })
//             );

//             // Act
//             service.deletePlaylistFolder(playlistFolders[0]);

//             // Assert
//             expect(wasNotified).toBeTruthy();
//         });
//     });

//     describe('renamePlaylistFolder', () => {
//         it('should sanitize the playlist folder name', async () => {
//             // Arrange
//             const service: BasePlaylistService = createService();
//             const playlistFolders: PlaylistFolderModel[] = createPlaylistFolders();

//             // Act
//             service.renamePlaylistFolder(playlistFolders[0], 'My new dirty playlist folder');

//             // Assert
//             textSanitizerMock.verify((x) => x.sanitize('My new dirty playlist folder'), Times.once());
//         });

//         it('should rename the playlist folder using the sanitized playlist folder name', async () => {
//             // Arrange
//             const service: BasePlaylistService = createService();
//             const playlistFolders: PlaylistFolderModel[] = createPlaylistFolders();

//             // Act
//             service.renamePlaylistFolder(playlistFolders[0], 'My new dirty playlist folder');

//             // Assert
//             fileSystemMock.verify((x) => x.renameFileOrDirectory(playlistFolders[0].path, 'My new playlist folder'), Times.once());
//         });

//         it('should notify that the playlist folders have changed', async () => {
//             // Arrange
//             const service: BasePlaylistService = createService();
//             const playlistFolders: PlaylistFolderModel[] = createPlaylistFolders();

//             const subscription: Subscription = new Subscription();
//             let wasNotified: boolean = false;

//             subscription.add(
//                 service.playlistFoldersChanged$.subscribe(() => {
//                     wasNotified = true;
//                 })
//             );

//             // Act
//             service.renamePlaylistFolder(playlistFolders[0], 'My new dirty playlist folder');

//             // Assert
//             expect(wasNotified).toBeTruthy();
//         });
//     });

//     describe('getPlaylistsAsync', () => {
//         it('should get the playlists', async () => {
//             // Arrange
//             const service: BasePlaylistService = createService();
//             const playlistFolders: PlaylistFolderModel[] = createPlaylistFolders();

//             // Act
//             const playlists: PlaylistModel[] = await service.getPlaylistsAsync(playlistFolders);

//             // Assert
//             expect(playlists.length).toEqual(2);
//             expect(playlists[0].path).toEqual('/home/User/Music/Dopamine/Playlists/Folder 1/Playlist 1.m3u');
//             expect(playlists[1].path).toEqual('/home/User/Music/Dopamine/Playlists/Folder 2/Playlist 2.m3u');
//         });
//     });
// });
