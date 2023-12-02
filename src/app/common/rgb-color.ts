export class RgbColor {
    public constructor(
        public red: number,
        public green: number,
        public blue: number,
    ) {}

    public static default(): RgbColor {
        return new RgbColor(0, 0, 0);
    }

    public toString(): string {
        return `${this.red},${this.green},${this.blue}`;
    }

    public equals(rgbColor: RgbColor): boolean {
        return this.red === rgbColor.red && this.green === rgbColor.green && this.blue === rgbColor.blue;
    }
}
