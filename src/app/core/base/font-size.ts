export class FontSize {
    constructor(public normalSize: number) {
    }

    public largeSize: number = this.normalSize * 1.429;
    public largerSize: number = this.normalSize * 1.857;
    public largestSize: number = this.normalSize * 2.857;
}
