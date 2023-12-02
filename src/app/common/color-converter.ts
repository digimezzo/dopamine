import { RgbColor } from './rgb-color';

export class ColorConverter {
    public static stringToRgbColor(colorString: string): RgbColor {
        if (colorString.toLowerCase() === 'white') {
            return new RgbColor(255, 255, 255);
        }

        if (colorString.toLowerCase() === 'black') {
            return new RgbColor(0, 0, 0);
        }

        if (colorString.startsWith('#')) {
            return this.hexToRgbColor(this.ensureFullHex(colorString));
        }

        return new RgbColor(255, 255, 255);
    }

    /**
     * Based on: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     */
    private static hexToRgbColor(hex: string): RgbColor {
        const r: number = parseInt(hex.slice(1, 3), 16);
        const g: number = parseInt(hex.slice(3, 5), 16);
        const b: number = parseInt(hex.slice(5, 7), 16);

        return new RgbColor(r, g, b);
    }

    private static ensureFullHex(hex: string): string {
        let fullHex: string = hex;

        if (hex.length === 4) {
            fullHex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
        }

        return fullHex;
    }
}
