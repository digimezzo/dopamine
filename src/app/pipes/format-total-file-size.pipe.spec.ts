import { IMock, Mock } from 'typemoq';
import { BaseTranslatorService } from '../services/translator/base-translator.service';
import { FormatTotalFileSizePipe } from './format-total-file-size.pipe';

describe('FormatTotalFileSizePipe', () => {
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let formatTotalFileSizePipe: FormatTotalFileSizePipe;

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        translatorServiceMock.setup((x) => x.get('giga-bytes')).returns(() => 'GB');
        translatorServiceMock.setup((x) => x.get('mega-bytes')).returns(() => 'MB');
        translatorServiceMock.setup((x) => x.get('kilo-bytes')).returns(() => 'kB');
        formatTotalFileSizePipe = new FormatTotalFileSizePipe(translatorServiceMock.object);
    });

    describe('transform', () => {
        it('should return an empty string if total file size is undefined', () => {
            // Arrange

            // Act
            const formattedTotalFileSize: string = formatTotalFileSizePipe.transform(undefined);

            // Assert
            expect(formattedTotalFileSize).toEqual('');
        });

        it('should return an empty string if total file size is 0 Bytes', () => {
            // Arrange

            // Act
            const formattedTotalFileSize: string = formatTotalFileSizePipe.transform(0);

            // Assert
            expect(formattedTotalFileSize).toEqual('');
        });

        it('should return an empty string if total file size is -8 Bytes', () => {
            // Arrange

            // Act
            const formattedTotalFileSize: string = formatTotalFileSizePipe.transform(-8);

            // Assert
            expect(formattedTotalFileSize).toEqual('');
        });

        it('should return "1 kB" if the file size is 1024 Bytes', () => {
            // Arrange

            // Act
            const formattedTotalFileSize: string = formatTotalFileSizePipe.transform(1024);

            // Assert
            expect(formattedTotalFileSize).toEqual('1 kB');
        });

        it('should return "563 kB" if the file size is 576512 Bytes', () => {
            // Arrange

            // Act
            const formattedTotalFileSize: string = formatTotalFileSizePipe.transform(576512);

            // Assert
            expect(formattedTotalFileSize).toEqual('563 kB');
        });

        it('should return "1023 kB" if the file size is 1047552 Bytes', () => {
            // Arrange

            // Act
            const formattedTotalFileSize: string = formatTotalFileSizePipe.transform(1047552);

            // Assert
            expect(formattedTotalFileSize).toEqual('1023 kB');
        });

        it('should return "1 MB" if the file size is 1048576 Bytes', () => {
            // Arrange

            // Act
            const formattedTotalFileSize: string = formatTotalFileSizePipe.transform(1048576);

            // Assert
            expect(formattedTotalFileSize).toEqual('1 MB');
        });

        it('should return "98 MB" if the file size is 102760448 Bytes', () => {
            // Arrange

            // Act
            const formattedTotalFileSize: string = formatTotalFileSizePipe.transform(102760448);

            // Assert
            expect(formattedTotalFileSize).toEqual('98 MB');
        });

        it('should return "854 MB" if the file size is 895483904 Bytes', () => {
            // Arrange

            // Act
            const formattedTotalFileSize: string = formatTotalFileSizePipe.transform(895483904);

            // Assert
            expect(formattedTotalFileSize).toEqual('854 MB');
        });

        it('should return "1023 MB" if the file size is 1072693248 Bytes', () => {
            // Arrange

            // Act
            const formattedTotalFileSize: string = formatTotalFileSizePipe.transform(1072693248);

            // Assert
            expect(formattedTotalFileSize).toEqual('1023 MB');
        });

        it('should return "1 GB" if the file size is 1073741824 Bytes', () => {
            // Arrange

            // Act
            const formattedTotalFileSize: string = formatTotalFileSizePipe.transform(1073741824);

            // Assert
            expect(formattedTotalFileSize).toEqual('1 GB');
        });

        it('should return "49 GB" if the file size is 52613349376 Bytes', () => {
            // Arrange

            // Act
            const formattedTotalFileSize: string = formatTotalFileSizePipe.transform(52613349376);

            // Assert
            expect(formattedTotalFileSize).toEqual('49 GB');
        });
    });
});
