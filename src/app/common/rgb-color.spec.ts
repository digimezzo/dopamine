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
});
