export class ColorConverter {
    public static stringToRgb(colorString: string): number[] {
        if (colorString.toLowerCase() === 'white') {
            return [255, 255, 255];
        }

        if (colorString.toLowerCase() === 'black') {
            return [0, 0, 0];
        }

        if (colorString.startsWith('#')) {
            return this.hexToRgb(colorString);
        }

        return [255, 255, 255];
    }

    /**
     * Based on: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     * @param hex
     * @returns
     */
    private static hexToRgb(hex: string): number[] {
        return hex
            .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1)
            .match(/.{2}/g)
            .map((x) => parseInt(x, 16));
    }
}
