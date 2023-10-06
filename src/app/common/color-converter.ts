export class ColorConverter {
    public static stringToRgb(colorString: string): number[] {
        if (colorString.toLowerCase() === 'white') {
            return [255, 255, 255];
        }

        if (colorString.toLowerCase() === 'black') {
            return [0, 0, 0];
        }

        if (colorString.startsWith('#')) {
            return this.hexToRgb(this.ensureFullHex(colorString));
        }

        return [255, 255, 255];
    }

    /**
     * Based on: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     */
    private static hexToRgb(hex: string): number[] {
        const r: number = parseInt(hex.slice(1, 3), 16);
        const g: number = parseInt(hex.slice(3, 5), 16);
        const b: number = parseInt(hex.slice(5, 7), 16);

        return [r, g, b];
    }

    private static ensureFullHex(hex: string): string {
        let fullHex: string = hex;

        if (hex.length === 4) {
            fullHex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
        }

        return fullHex;
    }
}
