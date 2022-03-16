import { ImageToFilePathPipe } from './image-to-file-path.pipe';

describe('ImageToFilePathPipe', () => {
    describe('transform', () => {
        it('should return a file path for a given Unix path if the path is not an empty image', () => {
            // Arrange
            const pipe: ImageToFilePathPipe = new ImageToFilePathPipe();

            // Act
            const filePath: string = pipe.transform('/home/user/Music/Dopamine/Playlists/Playlist folder 1/Playlist 1.png');

            // Assert
            expect(filePath).toEqual('file:////home/user/Music/Dopamine/Playlists/Playlist folder 1/Playlist 1.png');
        });

        it('should return a file path for a given Windows path if the path is not an empty image', () => {
            // Arrange
            const pipe: ImageToFilePathPipe = new ImageToFilePathPipe();

            // Act
            const filePath: string = pipe.transform('c:\\Users\\User\\Music\\Dopamine\\Playlists\\Playlist folder 1\\Playlist 1.png');

            // Assert
            expect(filePath).toEqual('file:///c:\\Users\\User\\Music\\Dopamine\\Playlists\\Playlist folder 1\\Playlist 1.png');
        });

        it('should return the empty image if the path is an empty image', () => {
            // Arrange
            const pipe: ImageToFilePathPipe = new ImageToFilePathPipe();

            // Act
            const filePath: string = pipe.transform('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');

            // Assert
            expect(filePath).toEqual('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
        });
    });
});
