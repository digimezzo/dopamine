// import { Subscription } from 'rxjs';
// import { IMock, Mock } from 'typemoq';
// import { Logger } from '../../../common/logger';
// import { PlaylistFolderModel } from '../../../services/playlist/playlist-folder-model';
// import { PlaylistFoldersPersister } from './playlist-folders-persister';

describe('PlaylistFoldersPersister', () => {
    test.todo('should write tests');
});

// describe('PlaylistFoldersPersister', () => {
//     let settingsStub: any;
//     let loggerMock: IMock<Logger>;

//     let persister: PlaylistFoldersPersister;

//     let subscription: Subscription;

//     let playlistFolder1: PlaylistFolderModel;
//     let playlistFolder2: PlaylistFolderModel;
//     let playlistFolder3: PlaylistFolderModel;

//     beforeEach(() => {
//         settingsStub = { playlistsTabSelectedPlaylistFolder: '' };
//         loggerMock = Mock.ofType<Logger>();
//         persister = new PlaylistFoldersPersister(settingsStub, loggerMock.object);

//         subscription = new Subscription();

//         playlistFolder1 = new PlaylistFolderModel('Playlist folder 1', 'Playlist folder path 1');
//         playlistFolder2 = new PlaylistFolderModel('Playlist folder 2', 'Playlist folder path 2');
//         playlistFolder3 = new PlaylistFolderModel('Playlist folder 3', 'Playlist folder path 3');
//     });

//     describe('constructor', () => {
//         it('should create', () => {
//             // Arrange

//             // Act

//             // Assert
//             expect(persister).toBeDefined();
//         });

//         it('should initialize from the settings', () => {
//             // Arrange
//             settingsStub.playlistsTabSelectedPlaylistFolder = 'Playlist folder 1';
//             persister = new PlaylistFoldersPersister(settingsStub, loggerMock.object);

//             // Act

//             // Assert
//             expect(persister.getSelectedPlaylistFolders([playlistFolder1, playlistFolder2])).toEqual([playlistFolder1]);
//         });
//     });

//     describe('getSelectedPlaylistFolders', () => {
//         it('should return an empty collection if availablePlaylistFolders is undefined', () => {
//             // Arrange
//             persister = new PlaylistFoldersPersister(settingsStub, loggerMock.object);

//             // Act
//             const selectedPlaylistFolders: PlaylistFolderModel[] = persister.getSelectedPlaylistFolders(undefined);

//             // Assert
//             expect(selectedPlaylistFolders).toEqual([]);
//         });

//         it('should return an empty collection if availablePlaylistFolders is empty', () => {
//             // Arrange
//             persister = new PlaylistFoldersPersister(settingsStub, loggerMock.object);

//             // Act
//             const selectedPlaylistFolders: PlaylistFolderModel[] = persister.getSelectedPlaylistFolders([]);

//             // Assert
//             expect(selectedPlaylistFolders).toEqual([]);
//         });

//         it('should return an empty collection if the selected playlist folders are not found in availablePlaylistFolders', () => {
//             // Arrange
//             persister = new PlaylistFoldersPersister(settingsStub, loggerMock.object);
//             persister.setSelectedPlaylistFolders([playlistFolder3]);

//             // Act
//             const selectedPlaylistFolders: PlaylistFolderModel[] = persister.getSelectedPlaylistFolders([playlistFolder1, playlistFolder2]);

//             // Assert
//             expect(selectedPlaylistFolders).toEqual([]);
//         });

//         it('should return the selected playlist folders if the selected playlist folders are found in availablePlaylistFolders', () => {
//             // Arrange
//             persister = new PlaylistFoldersPersister(settingsStub, loggerMock.object);
//             persister.setSelectedPlaylistFolders([playlistFolder1, playlistFolder2]);
//             // Act
//             const selectedPlaylistFolders: PlaylistFolderModel[] = persister.getSelectedPlaylistFolders([playlistFolder1, playlistFolder2]);
//             // Assert
//             expect(selectedPlaylistFolders).toEqual([playlistFolder1, playlistFolder2]);
//         });
//     });

//     describe('setSelectedPlaylistFolders', () => {
//         it('should clear the selected playlist folders if selectedPlaylistFolders is undefined', () => {
//             // Arrange
//             persister.setSelectedPlaylistFolders([playlistFolder1, playlistFolder2]);

//             // Act
//             persister.setSelectedPlaylistFolders(undefined);

//             // Assert
//             expect(persister.getSelectedPlaylistFolders([playlistFolder1, playlistFolder2])).toEqual([]);
//         });

//         it('should clear the selected playlist folders if selectedPlaylistFolders is empty', () => {
//             // Arrange
//             persister.setSelectedPlaylistFolders([playlistFolder1, playlistFolder2]);

//             // Act
//             persister.setSelectedPlaylistFolders([]);

//             // Assert
//             expect(persister.getSelectedPlaylistFolders([playlistFolder1, playlistFolder2])).toEqual([]);
//         });

//         it('should set the selected playlist folders if selectedPlaylistFolders has elements', () => {
//             // Arrange
//             persister.setSelectedPlaylistFolders([playlistFolder1, playlistFolder2]);
//             // Act
//             persister.setSelectedPlaylistFolders([playlistFolder1, playlistFolder3]);
//             // Assert
//             expect(persister.getSelectedPlaylistFolders([playlistFolder3])).toEqual([playlistFolder3]);
//         });

//         it('should notify that the selected playlist folders have changed', () => {
//             // Arrange
//             let receivedPlaylistFolderNames: string[] = [];
//             subscription.add(
//                 persister.selectedPlaylistFoldersChanged$.subscribe((playlistFolderNames: string[]) => {
//                     receivedPlaylistFolderNames = playlistFolderNames;
//                 })
//             );

//             // Act
//             persister.setSelectedPlaylistFolders([playlistFolder1, playlistFolder3]);

//             // Assert
//             expect(receivedPlaylistFolderNames.length).toEqual(2);
//             expect(receivedPlaylistFolderNames[0]).toEqual('Playlist folder 1');
//             expect(receivedPlaylistFolderNames[1]).toEqual('Playlist folder 3');
//             subscription.unsubscribe();
//         });
//     });
// });
