import { IMock, Mock } from 'typemoq';
import { BaseTranslatorService } from '../services/translator/base-translator.service';
import { FormatAlbumTitlePipe } from './format-album-title.pipe';

describe('formatAlbumTitle', () => {
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let formatAlbumTitlePipe: FormatAlbumTitlePipe;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        translatorServiceMock.setup((x) => x.get('Album.UnknownTitle')).returns(() => 'Unknown title');
        formatAlbumTitlePipe = new FormatAlbumTitlePipe(translatorServiceMock.object);
    });

    describe('transform', () => {
        it('should return "Unknown title" if albumTitle is undefined', () => {
            // Arrange

            // Act
            const subfolderName: string = formatAlbumTitlePipe.transform(undefined);

            // Assert
            expect(subfolderName).toEqual('Unknown title');
        });

        it('should return "Unknown title" if albumTitle is empty', () => {
            // Arrange

            // Act
            const subfolderName: string = formatAlbumTitlePipe.transform('');

            // Assert
            expect(subfolderName).toEqual('Unknown title');
        });

        it('should return "Unknown title" if albumTitle is white space', () => {
            // Arrange

            // Act
            const subfolderName: string = formatAlbumTitlePipe.transform(' ');

            // Assert
            expect(subfolderName).toEqual('Unknown title');
        });

        it('should return albumTitle if albumTitle is not undefined, empty or white space.', () => {
            // Arrange

            // Act
            const subfolderName: string = formatAlbumTitlePipe.transform('My title');

            // Assert
            expect(subfolderName).toEqual('My title');
        });
    });
});
