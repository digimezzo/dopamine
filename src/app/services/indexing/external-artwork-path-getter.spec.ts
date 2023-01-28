import { IMock, Mock } from 'typemoq';
import { BaseFileAccess } from '../../common/io/base-file-access';
import { ExternalArtworkPathGetter } from './external-artwork-path-getter';

describe('ExternalArtworkPathGetter', () => {
    let fileAccessMock: IMock<BaseFileAccess>;
    let externalArtworkPathGetter: ExternalArtworkPathGetter;

    const audioFilePath: string = '/home/MyUser/Music/MyMusicFile.mp3';

    beforeEach(() => {
        fileAccessMock = Mock.ofType<BaseFileAccess>();

        externalArtworkPathGetter = new ExternalArtworkPathGetter(fileAccessMock.object);
    });

    describe('getExternalArtworkPath', () => {
        it('should return undefined if audio file path is undefined', async () => {
            // Arrange
            fileAccessMock.setup((x) => x.getDirectoryPath(audioFilePath)).returns(() => '/home/MyUser/Music');
            fileAccessMock.setup((x) => x.getFileName('/home/MyUser/Music/MyMusicFile.mp3')).returns(() => 'MyMusicFile.mp3');

            // Act
            const externalArtworkPath: string = await externalArtworkPathGetter.getExternalArtworkPathAsync(undefined);

            // Assert
            expect(externalArtworkPath).toBeUndefined();
        });

        it('should return undefined if there is no file that matches an external artwork pattern in the same directory', async () => {
            // Arrange
            fileAccessMock.setup((x) => x.getDirectoryPath(audioFilePath)).returns(() => '/home/MyUser/Music');
            fileAccessMock.setup((x) => x.getFileName('/home/MyUser/Music/MyMusicFile.mp3')).returns(() => 'MyMusicFile.mp3');

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/MyUser/Music'))
                .returns(async () => ['/home/MyUser/Music/MyMusicFile.mp3']);

            // Act
            const externalArtworkPath: string = await externalArtworkPathGetter.getExternalArtworkPathAsync(audioFilePath);

            // Assert
            expect(externalArtworkPath).toBeUndefined();
        });

        async function getExternalArtworkPathAsync(artworkFileName: string): Promise<string> {
            fileAccessMock.reset();
            fileAccessMock.setup((x) => x.getDirectoryPath(audioFilePath)).returns(() => '/home/MyUser/Music');
            fileAccessMock.setup((x) => x.getFileName('/home/MyUser/Music/MyMusicFile.mp3')).returns(() => 'MyMusicFile.mp3');

            fileAccessMock.setup((x) => x.getFileNameWithoutExtension('/home/MyUser/Music/MyMusicFile.mp3')).returns(() => 'MyMusicFile');

            fileAccessMock.setup((x) => x.getFileNameWithoutExtension('/home/MyUser/Music/mymusicfile.png')).returns(() => 'mymusicfile');
            fileAccessMock.setup((x) => x.getFileNameWithoutExtension('/home/MyUser/Music/MyMusicFile.png')).returns(() => 'MyMusicFile');
            fileAccessMock.setup((x) => x.getFileNameWithoutExtension('/home/MyUser/Music/MyMusicFile.PNG')).returns(() => 'MyMusicFile');

            fileAccessMock.setup((x) => x.getFileNameWithoutExtension('/home/MyUser/Music/mymusicfile.jpg')).returns(() => 'mymusicfile');
            fileAccessMock.setup((x) => x.getFileNameWithoutExtension('/home/MyUser/Music/MyMusicFile.jpg')).returns(() => 'MyMusicFile');
            fileAccessMock.setup((x) => x.getFileNameWithoutExtension('/home/MyUser/Music/MyMusicFile.JPG')).returns(() => 'MyMusicFile');

            fileAccessMock.setup((x) => x.getFileNameWithoutExtension('/home/MyUser/Music/mymusicfile.jpeg')).returns(() => 'mymusicfile');
            fileAccessMock.setup((x) => x.getFileNameWithoutExtension('/home/MyUser/Music/MyMusicFile.jpeg')).returns(() => 'MyMusicFile');
            fileAccessMock.setup((x) => x.getFileNameWithoutExtension('/home/MyUser/Music/MyMusicFile.JPEG')).returns(() => 'MyMusicFile');

            fileAccessMock
                .setup((x) => x.getFilesInDirectoryAsync('/home/MyUser/Music'))
                .returns(async () => ['/home/MyUser/Music/MyMusicFile.mp3', '/home/MyUser/Music/' + artworkFileName]);

            fileAccessMock.setup((x) => x.getFileName('/home/MyUser/Music/' + artworkFileName)).returns(() => artworkFileName);

            return await externalArtworkPathGetter.getExternalArtworkPathAsync(audioFilePath);
        }

        it('should return a external artwork path if there is an artwork file in the same directory', async () => {
            // Arrange

            // Act
            const frontPng1ArtworkPath: string = await getExternalArtworkPathAsync('front.png');
            const frontPng2ArtworkPath: string = await getExternalArtworkPathAsync('Front.png');
            const frontPng3ArtworkPath: string = await getExternalArtworkPathAsync('Front.PNG');
            const frontJpg1ArtworkPath: string = await getExternalArtworkPathAsync('front.jpg');
            const frontJpg2ArtworkPath: string = await getExternalArtworkPathAsync('Front.jpg');
            const frontJpg3ArtworkPath: string = await getExternalArtworkPathAsync('Front.JPG');
            const frontJpeg1ArtworkPath: string = await getExternalArtworkPathAsync('front.jpeg');
            const frontJpeg2ArtworkPath: string = await getExternalArtworkPathAsync('Front.jpeg');
            const frontJpeg3ArtworkPath: string = await getExternalArtworkPathAsync('Front.JPEG');

            const coverPng1ArtworkPath: string = await getExternalArtworkPathAsync('cover.png');
            const coverPng2ArtworkPath: string = await getExternalArtworkPathAsync('Cover.png');
            const coverPng3ArtworkPath: string = await getExternalArtworkPathAsync('Cover.PNG');
            const coverJpg1ArtworkPath: string = await getExternalArtworkPathAsync('cover.jpg');
            const coverJpg2ArtworkPath: string = await getExternalArtworkPathAsync('Cover.jpg');
            const coverJpg3ArtworkPath: string = await getExternalArtworkPathAsync('Cover.JPG');
            const coverJpeg1ArtworkPath: string = await getExternalArtworkPathAsync('cover.jpeg');
            const coverJpeg2ArtworkPath: string = await getExternalArtworkPathAsync('Cover.jpeg');
            const coverJpeg3ArtworkPath: string = await getExternalArtworkPathAsync('Cover.JPEG');

            const folderPng1ArtworkPath: string = await getExternalArtworkPathAsync('folder.png');
            const folderPng2ArtworkPath: string = await getExternalArtworkPathAsync('Folder.png');
            const folderPng3ArtworkPath: string = await getExternalArtworkPathAsync('Folder.PNG');
            const folderJpg1ArtworkPath: string = await getExternalArtworkPathAsync('folder.jpg');
            const folderJpg2ArtworkPath: string = await getExternalArtworkPathAsync('Folder.jpg');
            const folderJpg3ArtworkPath: string = await getExternalArtworkPathAsync('Folder.JPG');
            const folderJpeg1ArtworkPath: string = await getExternalArtworkPathAsync('folder.jpeg');
            const folderJpeg2ArtworkPath: string = await getExternalArtworkPathAsync('Folder.jpeg');
            const folderJpeg3ArtworkPath: string = await getExternalArtworkPathAsync('Folder.JPEG');

            const fileNamePng1ArtworkPath: string = await getExternalArtworkPathAsync('mymusicfile.png');
            const fileNamePng2ArtworkPath: string = await getExternalArtworkPathAsync('MyMusicFile.png');
            const fileNamePng3ArtworkPath: string = await getExternalArtworkPathAsync('MyMusicFile.PNG');
            const fileNameJpg1ArtworkPath: string = await getExternalArtworkPathAsync('mymusicfile.jpg');
            const fileNameJpg2ArtworkPath: string = await getExternalArtworkPathAsync('MyMusicFile.jpg');
            const fileNameJpg3ArtworkPath: string = await getExternalArtworkPathAsync('MyMusicFile.JPG');
            const fileNameJpeg1ArtworkPath: string = await getExternalArtworkPathAsync('mymusicfile.jpeg');
            const fileNameJpeg2ArtworkPath: string = await getExternalArtworkPathAsync('MyMusicFile.jpeg');
            const fileNameJpeg3ArtworkPath: string = await getExternalArtworkPathAsync('MyMusicFile.JPEG');

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
