import { FormatTrackTitlePipe } from './format-track-title.pipe';

describe('FormatTrackTitlePipe', () => {
    let formatTrackTitlePipe: FormatTrackTitlePipe;
    const trackFileName: string = 'Track1.mp3';

    beforeEach(() => {
        formatTrackTitlePipe = new FormatTrackTitlePipe();
    });

    describe('transform', () => {
        it('should return trackFileName track title is undefined', () => {
            // Arrange

            // Act
            const formattedTrackTitle: string = formatTrackTitlePipe.transform(undefined, trackFileName);

            // Assert
            expect(formattedTrackTitle).toEqual(trackFileName);
        });

        it('should return trackFileName track title is empty', () => {
            // Arrange

            // Act
            const formattedTrackTitle: string = formatTrackTitlePipe.transform('', trackFileName);

            // Assert
            expect(formattedTrackTitle).toEqual(trackFileName);
        });

        it('should return trackFileName track title is wite space', () => {
            // Arrange

            // Act
            const formattedTrackTitle: string = formatTrackTitlePipe.transform(' ', trackFileName);

            // Assert
            expect(formattedTrackTitle).toEqual(trackFileName);
        });

        it('should return track title if it is valid', () => {
            // Arrange

            // Act
            const formattedTrackTitle: string = formatTrackTitlePipe.transform('Track title', trackFileName);

            // Assert
            expect(formattedTrackTitle).toEqual('Track title');
        });
    });
});
