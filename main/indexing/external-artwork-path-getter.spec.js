const { FileAccessMock } = require('../mocks/file-access-mock');
const { ExternalArtworkPathGetter } = require('./external-artwork-path-getter');

describe('ExternalArtworkPathGetter', () => {
    let fileAccessMock;

    beforeEach(() => {
        fileAccessMock = new FileAccessMock();
    });

    function createSut() {
        return new ExternalArtworkPathGetter(fileAccessMock);
    }

    describe('getExternalArtworkPath', () => {
        it('should return empty if audio file path is undefined', async () => {
            // Arrange
            fileAccessMock.getDirectoryPathReturnValues = { '/home/MyUser/Music/MyMusicFile.mp3': '/home/MyUser/Music' };
            fileAccessMock.getFileNameReturnValues = { '/home/MyUser/Music/MyMusicFile.mp3': 'MyMusicFile.mp3' };

            const sut = createSut();

            // Act
            const externalArtworkPath = await sut.getExternalArtworkPathAsync(undefined);

            // Assert
            expect(externalArtworkPath).toEqual('');
        });

        it('should return empty if there is no file that matches an external artwork pattern in the same directory', async () => {
            // Arrange
            fileAccessMock.getDirectoryPathReturnValues = { '/home/MyUser/Music/MyMusicFile.mp3': '/home/MyUser/Music' };
            fileAccessMock.getFileNameReturnValues = { '/home/MyUser/Music/MyMusicFile.mp3': 'MyMusicFile.mp3' };
            fileAccessMock.getFilesInDirectoryAsyncReturnValues = { '/home/MyUser/Music': ['/home/MyUser/Music/MyMusicFile.mp3'] };

            const sut = createSut();

            // Act
            const externalArtworkPath = await sut.getExternalArtworkPathAsync('/home/MyUser/Music/MyMusicFile.mp3');

            // Assert
            expect(externalArtworkPath).toEqual('');
        });

        async function getExternalArtworkPathAsync(artworkFileName) {
            fileAccessMock.reset();

            fileAccessMock.getFileNameReturnValues = {
                '/home/MyUser/Music/front.png': 'front.png',
                '/home/MyUser/Music/Front.png': 'Front.png',
                '/home/MyUser/Music/Front.PNG': 'Front.PNG',
                '/home/MyUser/Music/front.jpg': 'front.jpg',
                '/home/MyUser/Music/Front.jpg': 'Front.jpg',
                '/home/MyUser/Music/Front.JPG': 'Front.JPG',
                '/home/MyUser/Music/front.jpeg': 'front.jpeg',
                '/home/MyUser/Music/Front.jpeg': 'Front.jpeg',
                '/home/MyUser/Music/Front.JPEG': 'Front.JPEG',
                '/home/MyUser/Music/cover.png': 'cover.png',
                '/home/MyUser/Music/Cover.png': 'Cover.png',
                '/home/MyUser/Music/Cover.PNG': 'Cover.PNG',
                '/home/MyUser/Music/cover.jpg': 'cover.jpg',
                '/home/MyUser/Music/Cover.jpg': 'Cover.jpg',
                '/home/MyUser/Music/Cover.JPG': 'Cover.JPG',
                '/home/MyUser/Music/cover.jpeg': 'cover.jpeg',
                '/home/MyUser/Music/Cover.jpeg': 'Cover.jpeg',
                '/home/MyUser/Music/Cover.JPEG': 'Cover.JPEG',
                '/home/MyUser/Music/folder.png': 'folder.png',
                '/home/MyUser/Music/Folder.png': 'Folder.png',
                '/home/MyUser/Music/Folder.PNG': 'Folder.PNG',
                '/home/MyUser/Music/folder.jpg': 'folder.jpg',
                '/home/MyUser/Music/Folder.jpg': 'Folder.jpg',
                '/home/MyUser/Music/Folder.JPG': 'Folder.JPG',
                '/home/MyUser/Music/folder.jpeg': 'folder.jpeg',
                '/home/MyUser/Music/Folder.jpeg': 'Folder.jpeg',
                '/home/MyUser/Music/Folder.JPEG': 'Folder.JPEG',
                '/home/MyUser/Music/MyMusicFile.mp3': 'MyMusicFile.mp3',
                '/home/MyUser/Music/mymusicfile.png': 'mymusicfile.png',
                '/home/MyUser/Music/MyMusicFile.png': 'MyMusicFile.png',
                '/home/MyUser/Music/MyMusicFile.PNG': 'MyMusicFile.PNG',
                '/home/MyUser/Music/mymusicfile.jpg': 'mymusicfile.jpg',
                '/home/MyUser/Music/MyMusicFile.jpg': 'MyMusicFile.jpg',
                '/home/MyUser/Music/MyMusicFile.JPG': 'MyMusicFile.JPG',
                '/home/MyUser/Music/mymusicfile.jpeg': 'mymusicfile.jpeg',
                '/home/MyUser/Music/MyMusicFile.jpeg': 'MyMusicFile.jpeg',
                '/home/MyUser/Music/MyMusicFile.JPEG': 'MyMusicFile.JPEG',
            };

            fileAccessMock.getDirectoryPathReturnValues = { '/home/MyUser/Music/MyMusicFile.mp3': '/home/MyUser/Music' };

            fileAccessMock.getFileNameWithoutExtensionReturnValues = {
                '/home/MyUser/Music/MyMusicFile.mp3': 'MyMusicFile',
                '/home/MyUser/Music/mymusicfile.png': 'mymusicfile',
                '/home/MyUser/Music/MyMusicFile.png': 'MyMusicFile',
                '/home/MyUser/Music/MyMusicFile.PNG': 'MyMusicFile',
                '/home/MyUser/Music/mymusicfile.jpg': 'mymusicfile',
                '/home/MyUser/Music/MyMusicFile.jpg': 'MyMusicFile',
                '/home/MyUser/Music/MyMusicFile.JPG': 'MyMusicFile',
                '/home/MyUser/Music/mymusicfile.jpeg': 'mymusicfile',
                '/home/MyUser/Music/MyMusicFile.jpeg': 'MyMusicFile',
                '/home/MyUser/Music/MyMusicFile.JPEG': 'MyMusicFile',
            };

            fileAccessMock.getFilesInDirectoryAsyncReturnValues = {
                '/home/MyUser/Music': ['/home/MyUser/Music/MyMusicFile.mp3', '/home/MyUser/Music/' + artworkFileName],
            };

            const sut = createSut();
            return await sut.getExternalArtworkPathAsync('/home/MyUser/Music/MyMusicFile.mp3');
        }

        it('should return a external artwork path if there is an artwork file in the same directory', async () => {
            // Arrange

            // Act
            const frontPng1ArtworkPath = await getExternalArtworkPathAsync('front.png');
            const frontPng2ArtworkPath = await getExternalArtworkPathAsync('Front.png');
            const frontPng3ArtworkPath = await getExternalArtworkPathAsync('Front.PNG');
            const frontJpg1ArtworkPath = await getExternalArtworkPathAsync('front.jpg');
            const frontJpg2ArtworkPath = await getExternalArtworkPathAsync('Front.jpg');
            const frontJpg3ArtworkPath = await getExternalArtworkPathAsync('Front.JPG');
            const frontJpeg1ArtworkPath = await getExternalArtworkPathAsync('front.jpeg');
            const frontJpeg2ArtworkPath = await getExternalArtworkPathAsync('Front.jpeg');
            const frontJpeg3ArtworkPath = await getExternalArtworkPathAsync('Front.JPEG');

            const coverPng1ArtworkPath = await getExternalArtworkPathAsync('cover.png');
            const coverPng2ArtworkPath = await getExternalArtworkPathAsync('Cover.png');
            const coverPng3ArtworkPath = await getExternalArtworkPathAsync('Cover.PNG');
            const coverJpg1ArtworkPath = await getExternalArtworkPathAsync('cover.jpg');
            const coverJpg2ArtworkPath = await getExternalArtworkPathAsync('Cover.jpg');
            const coverJpg3ArtworkPath = await getExternalArtworkPathAsync('Cover.JPG');
            const coverJpeg1ArtworkPath = await getExternalArtworkPathAsync('cover.jpeg');
            const coverJpeg2ArtworkPath = await getExternalArtworkPathAsync('Cover.jpeg');
            const coverJpeg3ArtworkPath = await getExternalArtworkPathAsync('Cover.JPEG');

            const folderPng1ArtworkPath = await getExternalArtworkPathAsync('folder.png');
            const folderPng2ArtworkPath = await getExternalArtworkPathAsync('Folder.png');
            const folderPng3ArtworkPath = await getExternalArtworkPathAsync('Folder.PNG');
            const folderJpg1ArtworkPath = await getExternalArtworkPathAsync('folder.jpg');
            const folderJpg2ArtworkPath = await getExternalArtworkPathAsync('Folder.jpg');
            const folderJpg3ArtworkPath = await getExternalArtworkPathAsync('Folder.JPG');
            const folderJpeg1ArtworkPath = await getExternalArtworkPathAsync('folder.jpeg');
            const folderJpeg2ArtworkPath = await getExternalArtworkPathAsync('Folder.jpeg');
            const folderJpeg3ArtworkPath = await getExternalArtworkPathAsync('Folder.JPEG');

            const fileNamePng1ArtworkPath = await getExternalArtworkPathAsync('mymusicfile.png');
            const fileNamePng2ArtworkPath = await getExternalArtworkPathAsync('MyMusicFile.png');
            const fileNamePng3ArtworkPath = await getExternalArtworkPathAsync('MyMusicFile.PNG');
            const fileNameJpg1ArtworkPath = await getExternalArtworkPathAsync('mymusicfile.jpg');
            const fileNameJpg2ArtworkPath = await getExternalArtworkPathAsync('MyMusicFile.jpg');
            const fileNameJpg3ArtworkPath = await getExternalArtworkPathAsync('MyMusicFile.JPG');
            const fileNameJpeg1ArtworkPath = await getExternalArtworkPathAsync('mymusicfile.jpeg');
            const fileNameJpeg2ArtworkPath = await getExternalArtworkPathAsync('MyMusicFile.jpeg');
            const fileNameJpeg3ArtworkPath = await getExternalArtworkPathAsync('MyMusicFile.JPEG');

            // Assert
            expect(frontPng1ArtworkPath).toEqual('/home/MyUser/Music/front.png');
            expect(frontPng2ArtworkPath).toEqual('/home/MyUser/Music/Front.png');
            expect(frontPng3ArtworkPath).toEqual('/home/MyUser/Music/Front.PNG');
            expect(frontJpg1ArtworkPath).toEqual('/home/MyUser/Music/front.jpg');
            expect(frontJpg2ArtworkPath).toEqual('/home/MyUser/Music/Front.jpg');
            expect(frontJpg3ArtworkPath).toEqual('/home/MyUser/Music/Front.JPG');
            expect(frontJpeg1ArtworkPath).toEqual('/home/MyUser/Music/front.jpeg');
            expect(frontJpeg2ArtworkPath).toEqual('/home/MyUser/Music/Front.jpeg');
            expect(frontJpeg3ArtworkPath).toEqual('/home/MyUser/Music/Front.JPEG');

            expect(coverPng1ArtworkPath).toEqual('/home/MyUser/Music/cover.png');
            expect(coverPng2ArtworkPath).toEqual('/home/MyUser/Music/Cover.png');
            expect(coverPng3ArtworkPath).toEqual('/home/MyUser/Music/Cover.PNG');
            expect(coverJpg1ArtworkPath).toEqual('/home/MyUser/Music/cover.jpg');
            expect(coverJpg2ArtworkPath).toEqual('/home/MyUser/Music/Cover.jpg');
            expect(coverJpg3ArtworkPath).toEqual('/home/MyUser/Music/Cover.JPG');
            expect(coverJpeg1ArtworkPath).toEqual('/home/MyUser/Music/cover.jpeg');
            expect(coverJpeg2ArtworkPath).toEqual('/home/MyUser/Music/Cover.jpeg');
            expect(coverJpeg3ArtworkPath).toEqual('/home/MyUser/Music/Cover.JPEG');

            expect(folderPng1ArtworkPath).toEqual('/home/MyUser/Music/folder.png');
            expect(folderPng2ArtworkPath).toEqual('/home/MyUser/Music/Folder.png');
            expect(folderPng3ArtworkPath).toEqual('/home/MyUser/Music/Folder.PNG');
            expect(folderJpg1ArtworkPath).toEqual('/home/MyUser/Music/folder.jpg');
            expect(folderJpg2ArtworkPath).toEqual('/home/MyUser/Music/Folder.jpg');
            expect(folderJpg3ArtworkPath).toEqual('/home/MyUser/Music/Folder.JPG');
            expect(folderJpeg1ArtworkPath).toEqual('/home/MyUser/Music/folder.jpeg');
            expect(folderJpeg2ArtworkPath).toEqual('/home/MyUser/Music/Folder.jpeg');
            expect(folderJpeg3ArtworkPath).toEqual('/home/MyUser/Music/Folder.JPEG');

            expect(fileNamePng1ArtworkPath).toEqual('/home/MyUser/Music/mymusicfile.png');
            expect(fileNamePng2ArtworkPath).toEqual('/home/MyUser/Music/MyMusicFile.png');
            expect(fileNamePng3ArtworkPath).toEqual('/home/MyUser/Music/MyMusicFile.PNG');
            expect(fileNameJpg1ArtworkPath).toEqual('/home/MyUser/Music/mymusicfile.jpg');
            expect(fileNameJpg2ArtworkPath).toEqual('/home/MyUser/Music/MyMusicFile.jpg');
            expect(fileNameJpg3ArtworkPath).toEqual('/home/MyUser/Music/MyMusicFile.JPG');
            expect(fileNameJpeg1ArtworkPath).toEqual('/home/MyUser/Music/mymusicfile.jpeg');
            expect(fileNameJpeg2ArtworkPath).toEqual('/home/MyUser/Music/MyMusicFile.jpeg');
            expect(fileNameJpeg3ArtworkPath).toEqual('/home/MyUser/Music/MyMusicFile.JPEG');
        });
    });
});
