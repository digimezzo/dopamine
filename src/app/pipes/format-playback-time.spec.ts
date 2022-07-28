import { FormatPlaybackTimePipe } from './format-playback-time';

describe('FormatPlaybackTimePipe', () => {
    let formatPlaybackTimePipe: FormatPlaybackTimePipe;

    beforeEach(() => {
        formatPlaybackTimePipe = new FormatPlaybackTimePipe();
    });

    describe('transform', () => {
        it('should return 00:00 when progress seconds is undefined', () => {
            // Arrange

            // Act
            const formattedPlaybackTime: string = formatPlaybackTimePipe.transform(undefined);

            // Assert
            expect(formattedPlaybackTime).toEqual('00:00');
        });

        it('should return 00:00 when progress seconds is 0 seconds', () => {
            // Arrange

            // Act
            const formattedPlaybackTime: string = formatPlaybackTimePipe.transform(0);

            // Assert
            expect(formattedPlaybackTime).toEqual('00:00');
        });

        it('should return 00:00 when progress seconds is -6 seconds', () => {
            // Arrange

            // Act
            const formattedPlaybackTime: string = formatPlaybackTimePipe.transform(-6);

            // Assert
            expect(formattedPlaybackTime).toEqual('00:00');
        });

        it('should return 00:08 when progress seconds is 8.1 seconds', () => {
            // Arrange

            // Act
            const formattedPlaybackTime: string = formatPlaybackTimePipe.transform(8.1);

            // Assert
            expect(formattedPlaybackTime).toEqual('00:08');
        });

        it('should return 00:09 when progress seconds is 9.4 seconds', () => {
            // Arrange

            // Act
            const formattedPlaybackTime: string = formatPlaybackTimePipe.transform(9.4);

            // Assert
            expect(formattedPlaybackTime).toEqual('00:09');
        });

        it('should return 00:14 when progress seconds is 14.6 seconds', () => {
            // Arrange

            // Act
            const formattedPlaybackTime: string = formatPlaybackTimePipe.transform(14.6);

            // Assert
            expect(formattedPlaybackTime).toEqual('00:14');
        });

        it('should return 00:58 when progress seconds is 58.9 seconds', () => {
            // Arrange

            // Act
            const formattedPlaybackTime: string = formatPlaybackTimePipe.transform(58.9);

            // Assert
            expect(formattedPlaybackTime).toEqual('00:58');
        });

        it('should return "00:59" if progress seconds is 59000 seconds', () => {
            // Arrange

            // Act
            const formattedPlaybackTime: string = formatPlaybackTimePipe.transform(59);

            // Assert
            expect(formattedPlaybackTime).toEqual('00:59');
        });

        it('should return "01:00" if progress seconds is 60 seconds', () => {
            // Arrange

            // Act
            const formattedPlaybackTime: string = formatPlaybackTimePipe.transform(60);

            // Assert
            expect(formattedPlaybackTime).toEqual('01:00');
        });

        it('should return "59:59" if progress seconds is 3599 seconds', () => {
            // Arrange

            // Act
            const formattedPlaybackTime: string = formatPlaybackTimePipe.transform(3599);

            // Assert
            expect(formattedPlaybackTime).toEqual('59:59');
        });

        it('should return "01:00:00" if progress seconds is 3600 seconds', () => {
            // Arrange

            // Act
            const formattedPlaybackTime: string = formatPlaybackTimePipe.transform(3600);

            // Assert
            expect(formattedPlaybackTime).toEqual('01:00:00');
        });

        it('should return "15:27:42" if progress seconds is 55662 seconds', () => {
            // Arrange

            // Act
            const formattedPlaybackTime: string = formatPlaybackTimePipe.transform(55662);

            // Assert
            expect(formattedPlaybackTime).toEqual('15:27:42');
        });

        it('should return "35:00:00" if progress seconds is 126000 seconds', () => {
            // Arrange

            // Act
            const formattedPlaybackTime: string = formatPlaybackTimePipe.transform(126000);

            // Assert
            expect(formattedPlaybackTime).toEqual('35:00:00');
        });
    });
});
