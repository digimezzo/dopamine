import { ColorConverter } from './color-converter';

describe('ColorConverter', () => {
    describe('stringToRgb', () => {
        it('should convert an unsupported string to [255, 255, 255]', () => {
            // Arrange

            // Act
            const rgbArray: number[] = ColorConverter.stringToRgb('unsupported');

            // Assert
            expect(rgbArray.length).toEqual(3);
            expect(rgbArray[0]).toEqual(255);
            expect(rgbArray[1]).toEqual(255);
            expect(rgbArray[2]).toEqual(255);
        });

        it('should convert "#ffffff" to [255, 255, 255]', () => {
            // Arrange

            // Act
            const rgbArray: number[] = ColorConverter.stringToRgb('#ffffff');

            // Assert
            expect(rgbArray.length).toEqual(3);
            expect(rgbArray[0]).toEqual(255);
            expect(rgbArray[1]).toEqual(255);
            expect(rgbArray[2]).toEqual(255);
        });

        it('should convert "#fff" to [255, 255, 255]', () => {
            // Arrange

            // Act
            const rgbArray: number[] = ColorConverter.stringToRgb('#fff');

            // Assert
            expect(rgbArray.length).toEqual(3);
            expect(rgbArray[0]).toEqual(255);
            expect(rgbArray[1]).toEqual(255);
            expect(rgbArray[2]).toEqual(255);
        });

        it('should convert "white" to [255, 255, 255]', () => {
            // Arrange

            // Act
            const rgbArray: number[] = ColorConverter.stringToRgb('white');

            // Assert
            expect(rgbArray.length).toEqual(3);
            expect(rgbArray[0]).toEqual(255);
            expect(rgbArray[1]).toEqual(255);
            expect(rgbArray[2]).toEqual(255);
        });

        it('should convert "WHITE" to [255, 255, 255]', () => {
            // Arrange

            // Act
            const rgbArray: number[] = ColorConverter.stringToRgb('white');

            // Assert
            expect(rgbArray.length).toEqual(3);
            expect(rgbArray[0]).toEqual(255);
            expect(rgbArray[1]).toEqual(255);
            expect(rgbArray[2]).toEqual(255);
        });

        it('should convert "#000000" to [0, 0, 0]', () => {
            // Arrange

            // Act
            const rgbArray: number[] = ColorConverter.stringToRgb('#000000');

            // Assert
            expect(rgbArray.length).toEqual(3);
            expect(rgbArray[0]).toEqual(0);
            expect(rgbArray[1]).toEqual(0);
            expect(rgbArray[2]).toEqual(0);
        });

        it('should convert "#000" to [0, 0, 0]', () => {
            // Arrange

            // Act
            const rgbArray: number[] = ColorConverter.stringToRgb('#000');

            // Assert
            expect(rgbArray.length).toEqual(3);
            expect(rgbArray[0]).toEqual(0);
            expect(rgbArray[1]).toEqual(0);
            expect(rgbArray[2]).toEqual(0);
        });

        it('should convert "black" to [0, 0, 0]', () => {
            // Arrange

            // Act
            const rgbArray: number[] = ColorConverter.stringToRgb('black');

            // Assert
            expect(rgbArray.length).toEqual(3);
            expect(rgbArray[0]).toEqual(0);
            expect(rgbArray[1]).toEqual(0);
            expect(rgbArray[2]).toEqual(0);
        });

        it('should convert "BLACK" to [0, 0, 0]', () => {
            // Arrange

            // Act
            const rgbArray: number[] = ColorConverter.stringToRgb('black');

            // Assert
            expect(rgbArray.length).toEqual(3);
            expect(rgbArray[0]).toEqual(0);
            expect(rgbArray[1]).toEqual(0);
            expect(rgbArray[2]).toEqual(0);
        });
    });
});
