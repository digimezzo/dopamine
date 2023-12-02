export class RgbColor {
    public constructor(
        public red: number,
        public green: number,
        public blue: number,
    ) {}

    public toString(): string {
        return `${this.red},${this.green},${this.blue}`;
    }
}
