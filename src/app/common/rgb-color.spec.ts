import { ColorConverter } from './color-converter';
import { RgbColor } from './rgb-color';

describe('RgbColor', () => {
    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const rgbColor: RgbColor = new RgbColor(64, 12, 250);

            // Assert
            expect(rgbColor).toBeDefined();
        });

        it('should set properties', () => {
            // Arrange, Act
            const rgbColor: RgbColor = new RgbColor(64, 12, 250);

            // Assert
            expect(rgbColor.red).toEqual(64);
            expect(rgbColor.green).toEqual(12);
            expect(rgbColor.blue).toEqual(250);
        });
    });

    describe('default', () => {
        it('should create default rgbColor', () => {
            // Arrange, Act
            const rgbColor: RgbColor = RgbColor.default();

            // Assert
            expect(rgbColor.red).toEqual(0);
            expect(rgbColor.green).toEqual(0);
            expect(rgbColor.blue).toEqual(0);
        });
    });

    describe('toString', () => {
        it('should convert rgbColor to a string', () => {
            // Arrange
            const rgbColor: RgbColor = new RgbColor(64, 12, 250);

            // Act, Assert
            expect(rgbColor.toString()).toEqual('64,12,250');
        });
    });

    describe('equals', () => {
        it('should return true if the 3 colors are equal', () => {
            // Arrange
            const rgbColor1: RgbColor = new RgbColor(64, 12, 250);
            const rgbColor2: RgbColor = new RgbColor(64, 12, 250);

            // Act, Assert
            expect(rgbColor1.equals(rgbColor2)).toBeTruthy();
        });

        it('should return false if the 3 colors are not equal', () => {
            // Arrange
            const rgbColor1: RgbColor = new RgbColor(64, 12, 250);
            const rgbColor2: RgbColor = new RgbColor(64, 13, 250);

            // Act, Assert
            expect(rgbColor1.equals(rgbColor2)).toBeFalsy();
        });
    });
});
