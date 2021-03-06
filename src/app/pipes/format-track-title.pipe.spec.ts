import { IMock, Mock } from 'typemoq';
import { BaseTranslatorService } from '../services/translator/base-translator.service';
import { FormatTrackTitlePipe } from './format-track-title.pipe';

describe('FormatTrackTitlePipe', () => {
    let translatorServiceMock: IMock<BaseTranslatorService>;
    let formatTrackTitlePipe: FormatTrackTitlePipe;
    const trackFileName: string = 'Track1.mp3';

    beforeEach(() => {
        translatorServiceMock = Mock.ofType<BaseTranslatorService>();
        translatorServiceMock.setup((x) => x.get('Track.UnknownTitle')).returns(() => 'Unknown title');
        formatTrackTitlePipe = new FormatTrackTitlePipe(translatorServiceMock.object);
    });

    describe('transform', () => {
        it('should return trackTitle if it is not empty and not undefined', () => {
            // Arrange

            // Act
            const formattedTrackTitle: string = formatTrackTitlePipe.transform('Track title', trackFileName);

            // Assert
            expect(formattedTrackTitle).toEqual('Track title');
        });

        it('should return trackFileName if it is not empty or undefined but trackTitle is undefined', () => {
            // Arrange

            // Act
            const formattedTrackTitle: string = formatTrackTitlePipe.transform(undefined, trackFileName);

            // Assert
            expect(formattedTrackTitle).toEqual(trackFileName);
        });

        it('should return trackFileName if it is not empty or undefined but trackTitle is empty', () => {
            // Arrange

            // Act
            const formattedTrackTitle: string = formatTrackTitlePipe.transform('', trackFileName);

            // Assert
            expect(formattedTrackTitle).toEqual(trackFileName);
        });

        it('should return "Unknown title" if trackTitle is undefined and trackFileName is undefined', () => {
            // Arrange

            // Act
            const formattedTrackTitle: string = formatTrackTitlePipe.transform(undefined, undefined);

            // Assert
            expect(formattedTrackTitle).toEqual('Unknown title');
        });

        it('should return "Unknown title" if trackTitle is empty and trackFileName is undefined', () => {
            // Arrange

            // Act
            const formattedTrackTitle: string = formatTrackTitlePipe.transform('', undefined);

            // Assert
            expect(formattedTrackTitle).toEqual('Unknown title');
        });

        it('should return "Unknown title" if trackTitle is undefined and trackFileName is empty', () => {
            // Arrange

            // Act
            const formattedTrackTitle: string = formatTrackTitlePipe.transform(undefined, '');

            // Assert
            expect(formattedTrackTitle).toEqual('Unknown title');
        });

        it('should return "Unknown title" if trackTitle is empty and trackFileName is empty', () => {
            // Arrange

            // Act
            const formattedTrackTitle: string = formatTrackTitlePipe.transform('', '');

            // Assert
            expect(formattedTrackTitle).toEqual('Unknown title');
        });
    });
});
