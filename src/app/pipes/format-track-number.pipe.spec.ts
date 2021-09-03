import { FormatTrackNumberPipe } from './format-track-number.pipe';

describe('FormatTrackNumberPipe', () => {
    let formatTrackNumberPipe: FormatTrackNumberPipe;

    beforeEach(() => {
        formatTrackNumberPipe = new FormatTrackNumberPipe();
    });

    describe('transform', () => {
        it('should return "-" if track number is undefined', () => {
            // Arrange

            // Act
            const formattedTrackNumber: string = formatTrackNumberPipe.transform(undefined);

            // Assert
            expect(formattedTrackNumber).toEqual('-');
        });

        it('should return "-" if track number is 0', () => {
            // Arrange

            // Act
            const formattedTrackNumber: string = formatTrackNumberPipe.transform(0);

            // Assert
            expect(formattedTrackNumber).toEqual('-');
        });

        it('should return "-" if track number is -5', () => {
            // Arrange

            // Act
            const formattedTrackNumber: string = formatTrackNumberPipe.transform(-5);

            // Assert
            expect(formattedTrackNumber).toEqual('-');
        });

        it('should return track number if track number is between 1 and 9 inclusive', () => {
            // Arrange

            // Act
            const formattedTrackNumber1: string = formatTrackNumberPipe.transform(1);
            const formattedTrackNumber2: string = formatTrackNumberPipe.transform(2);
            const formattedTrackNumber3: string = formatTrackNumberPipe.transform(3);
            const formattedTrackNumber4: string = formatTrackNumberPipe.transform(4);
            const formattedTrackNumber5: string = formatTrackNumberPipe.transform(5);
            const formattedTrackNumber6: string = formatTrackNumberPipe.transform(6);
            const formattedTrackNumber7: string = formatTrackNumberPipe.transform(7);
            const formattedTrackNumber8: string = formatTrackNumberPipe.transform(8);
            const formattedTrackNumber9: string = formatTrackNumberPipe.transform(9);

            // Assert
            expect(formattedTrackNumber1).toEqual('1');
            expect(formattedTrackNumber2).toEqual('2');
            expect(formattedTrackNumber3).toEqual('3');
            expect(formattedTrackNumber4).toEqual('4');
            expect(formattedTrackNumber5).toEqual('5');
            expect(formattedTrackNumber6).toEqual('6');
            expect(formattedTrackNumber7).toEqual('7');
            expect(formattedTrackNumber8).toEqual('8');
            expect(formattedTrackNumber9).toEqual('9');
        });

        it('should return track number if track number is between 10 and 99 inclusive', () => {
            // Arrange

            // Act
            const formattedTrackNumber1: string = formatTrackNumberPipe.transform(10);
            const formattedTrackNumber2: string = formatTrackNumberPipe.transform(15);
            const formattedTrackNumber3: string = formatTrackNumberPipe.transform(26);
            const formattedTrackNumber4: string = formatTrackNumberPipe.transform(42);
            const formattedTrackNumber5: string = formatTrackNumberPipe.transform(53);
            const formattedTrackNumber6: string = formatTrackNumberPipe.transform(67);
            const formattedTrackNumber7: string = formatTrackNumberPipe.transform(79);
            const formattedTrackNumber8: string = formatTrackNumberPipe.transform(81);
            const formattedTrackNumber9: string = formatTrackNumberPipe.transform(99);

            // Assert
            expect(formattedTrackNumber1).toEqual('10');
            expect(formattedTrackNumber2).toEqual('15');
            expect(formattedTrackNumber3).toEqual('26');
            expect(formattedTrackNumber4).toEqual('42');
            expect(formattedTrackNumber5).toEqual('53');
            expect(formattedTrackNumber6).toEqual('67');
            expect(formattedTrackNumber7).toEqual('79');
            expect(formattedTrackNumber8).toEqual('81');
            expect(formattedTrackNumber9).toEqual('99');
        });

        it('should return track number if track number is between larger than 99', () => {
            // Arrange

            // Act
            const formattedTrackNumber1: string = formatTrackNumberPipe.transform(100);
            const formattedTrackNumber2: string = formatTrackNumberPipe.transform(153);
            const formattedTrackNumber3: string = formatTrackNumberPipe.transform(999);
            const formattedTrackNumber4: string = formatTrackNumberPipe.transform(10000);

            // Assert
            expect(formattedTrackNumber1).toEqual('100');
            expect(formattedTrackNumber2).toEqual('153');
            expect(formattedTrackNumber3).toEqual('999');
            expect(formattedTrackNumber4).toEqual('10000');
        });
    });
});
