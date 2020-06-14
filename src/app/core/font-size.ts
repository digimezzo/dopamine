export class FontSize {
    constructor(public normalSize: number) {
    }

    public largerSize: number = this.normalSize * 1.42;
    public largestSize: number = this.normalSize * 2.85;
}
