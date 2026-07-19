import { IMock, It, Mock, Times } from 'typemoq';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { DialogServiceBase } from '../../../../services/dialog/dialog.service.base';
import { DesktopBase } from '../../../../common/io/desktop.base';
import { ImageProcessor } from '../../../../common/image-processor';
import { EditArtistDialogComponent } from './edit-artist-dialog.component';
import { OnlineArtistArtworkGetter } from '../../../../services/indexing/online-artist-artwork-getter';
import { ArtistArtworkAdder } from '../../../../services/indexing/artist-artwork-adder';
import { ArtistModel } from '../../../../services/artist/artist-model';
import { ApplicationPaths } from '../../../../common/application/application-paths';
import { Constants } from '../../../../common/application/constants';
import { Logger } from '../../../../common/logger';

const artistName: string = 'Metallica';
const artworkId: string = 'artwork-1';
const artistArtworkData: Buffer = Buffer.from([1, 2, 3]);

describe('EditArtistDialogComponent', () => {
    let component: EditArtistDialogComponent;

    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let applicationPathsMock: IMock<ApplicationPaths>;
    let onlineArtistArtworkGetterMock: IMock<OnlineArtistArtworkGetter>;
    let dialogServiceMock: IMock<DialogServiceBase>;
    let artistArtworkAdderMock: IMock<ArtistArtworkAdder>;
    let desktopMock: IMock<DesktopBase>;
    let imageProcessorMock: IMock<ImageProcessor>;
    let loggerMock: IMock<Logger>;
    let dataMock: ArtistModel;

    beforeEach(() => {
        applicationPathsMock = Mock.ofType<ApplicationPaths>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();
        onlineArtistArtworkGetterMock = Mock.ofType<OnlineArtistArtworkGetter>();
        dialogServiceMock = Mock.ofType<DialogServiceBase>();
        artistArtworkAdderMock = Mock.ofType<ArtistArtworkAdder>();
        desktopMock = Mock.ofType<DesktopBase>();
        imageProcessorMock = Mock.ofType<ImageProcessor>();
        loggerMock = Mock.ofType<Logger>();
    });

    function createComponent(artistName: string): void {
        dataMock = new ArtistModel(artistName, artworkId, translatorServiceMock.object, applicationPathsMock.object);
        component = new EditArtistDialogComponent(
            translatorServiceMock.object,
            onlineArtistArtworkGetterMock.object,
            dialogServiceMock.object,
            artistArtworkAdderMock.object,
            desktopMock.object,
            imageProcessorMock.object,
            loggerMock.object,
            dataMock,
        );
        component.ngOnInit();
    }

    describe('isImageAvailable', () => {
        it('should return true if the path of the current image is not empty', () => {
            // Arrange
            createComponent(artistName);

            // Act
            const imageAvailable: boolean = component.isImageAvailable;

            // Assert
            expect(imageAvailable).toEqual(true);
        });

        it('should return false if the path of the current image is empty', () => {
            // Arrange
            createComponent('');

            // Act
            const imageAvailable: boolean = component.isImageAvailable;

            // Assert
            expect(imageAvailable).toEqual(false);
        });
    });

    describe('selectLocalImageAsync', () => {
        it('should set a local image as artist image', async () => {
            // Arrange
            createComponent(artistName);
            const selectedFile: string = 'file:///any/path/to/file.jpg';
            desktopMock.setup((x) => x.showSelectFileDialogAsync(It.isAnyString())).returns(() => Promise.resolve(selectedFile));

            imageProcessorMock
                .setup((x) => x.convertLocalImageToBufferAsync(It.isAnyString()))
                .returns(() => Promise.resolve(artistArtworkData));

            translatorServiceMock.setup((x) => x.get('choose-image')).returns(() => 'choose image');

            // Act
            await component.selectLocalImageAsync();
            await component.saveArtistAsync();

            // Assert
            desktopMock.verify((x) => x.showSelectFileDialogAsync(It.isAnyString()), Times.once());
            expect(component.imagePath).toEqual(selectedFile);
            imageProcessorMock.verify((x) => x.convertLocalImageToBufferAsync(component.imagePath), Times.once());
            artistArtworkAdderMock.verify((x) => x.updateArtistArtworkAsync(artistName, artistArtworkData, true), Times.once());
        });
    });

    describe('selectOnlineImage', () => {
        it('should set an online image as artist image', async () => {
            // Arrange
            createComponent(artistName);
            expect(component.imagePath).not.toEqual('');
            const imageUrl: string = 'https://example.org/image.jpg';
            imageProcessorMock.setup((x) => x.convertOnlineImageToBufferAsync(imageUrl)).returns(() => Promise.resolve(artistArtworkData));

            // Act
            component.selectOnlineImage(imageUrl);
            await component.saveArtistAsync();

            // Assert
            expect(component.imagePath).toEqual(imageUrl);
            imageProcessorMock.verify((x) => x.convertOnlineImageToBufferAsync(imageUrl), Times.once());
            artistArtworkAdderMock.verify((x) => x.updateArtistArtworkAsync(artistName, artistArtworkData, true), Times.once());
        });
    });

    describe('removeImage', () => {
        it('should remove the artist image', async () => {
            // Arrange
            createComponent(artistName);
            expect(component.imagePath).not.toEqual('');

            // Act
            component.removeImage();
            await component.saveArtistAsync();

            // Assert
            expect(component.imagePath).toEqual('');
            artistArtworkAdderMock.verify((x) => x.updateArtistArtworkAsync(artistName, Constants.emptyImageBuffer, false), Times.once());
        });
    });

    describe('searchForImagesOnline', () => {
        it('should load multiple artist images online', async () => {
            // Arrange
            createComponent(artistName);
            expect(component.alternativeImageUrls).toEqual([]);
            const imageUrls: string[] = [
                'https://example.org/image1.jpg',
                'https://example.org/image2.jpg',
                'https://example.org/image3.jpg',
            ];

            onlineArtistArtworkGetterMock
                .setup((x) => x.getAllOnlineArtworkUrlsAsync(artistName))
                .returns(() => Promise.resolve(imageUrls));

            // Act
            await component.searchForImagesOnline();

            // Assert
            expect(component.alternativeImageUrls).toEqual(imageUrls);
        });
    });
});
