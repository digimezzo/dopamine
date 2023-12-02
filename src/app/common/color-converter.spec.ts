import { ColorConverter } from './color-converter';
import { RgbColor } from './rgb-color';

describe('ColorConverter', () => {
    describe('stringToRgbColor', () => {
        it('should convert an unsupported string to (255, 255, 255)', () => {
            // Arrange

            // Act
            const rgbColor: RgbColor = ColorConverter.stringToRgbColor('unsupported');

            // Assert
            expect(rgbColor.red).toEqual(255);
            expect(rgbColor.green).toEqual(255);
            expect(rgbColor.blue).toEqual(255);
        });

        it('should convert "#ffffff" to (255, 255, 255)', () => {
            // Arrange

            // Act
            const rgbColor: RgbColor = ColorConverter.stringToRgbColor('#ffffff');

            // Assert
            expect(rgbColor.red).toEqual(255);
            expect(rgbColor.green).toEqual(255);
            expect(rgbColor.blue).toEqual(255);
        });

        it('should convert "#fff" to (255, 255, 255)', () => {
            // Arrange

            // Act
            const rgbColor: RgbColor = ColorConverter.stringToRgbColor('#fff');

            // Assert
            expect(rgbColor.red).toEqual(255);
            expect(rgbColor.green).toEqual(255);
            expect(rgbColor.blue).toEqual(255);
        });

        it('should convert "white" to (255, 255, 255)', () => {
            // Arrange

            // Act
            const rgbColor: RgbColor = ColorConverter.stringToRgbColor('white');

            // Assert
            expect(rgbColor.red).toEqual(255);
            expect(rgbColor.green).toEqual(255);
            expect(rgbColor.blue).toEqual(255);
        });

        it('should convert "WHITE" to (255, 255, 255)', () => {
            // Arrange

            // Act
            const rgbColor: RgbColor = ColorConverter.stringToRgbColor('white');

            // Assert
            expect(rgbColor.red).toEqual(255);
            expect(rgbColor.green).toEqual(255);
            expect(rgbColor.blue).toEqual(255);
        });

        it('should convert "#000000" to (0, 0, 0)', () => {
            // Arrange

            // Act
            const rgbColor: RgbColor = ColorConverter.stringToRgbColor('#000000');

            // Assert
            expect(rgbColor.red).toEqual(0);
            expect(rgbColor.green).toEqual(0);
            expect(rgbColor.blue).toEqual(0);
        });

        it('should convert "#000" to (0, 0, 0)', () => {
            // Arrange

            // Act
            const rgbColor: RgbColor = ColorConverter.stringToRgbColor('#000');

            // Assert
            expect(rgbColor.red).toEqual(0);
            expect(rgbColor.green).toEqual(0);
            expect(rgbColor.blue).toEqual(0);
        });

        it('should convert "black" to (0, 0, 0)', () => {
            // Arrange

            // Act
            const rgbColor: RgbColor = ColorConverter.stringToRgbColor('black');

            // Assert
            expect(rgbColor.red).toEqual(0);
            expect(rgbColor.green).toEqual(0);
            expect(rgbColor.blue).toEqual(0);
        });

        it('should convert "BLACK" to (0, 0, 0)', () => {
            // Arrange

            // Act
            const rgbColor: RgbColor = ColorConverter.stringToRgbColor('black');

            // Assert
            expect(rgbColor.red).toEqual(0);
            expect(rgbColor.green).toEqual(0);
            expect(rgbColor.blue).toEqual(0);
        });
    });
});
