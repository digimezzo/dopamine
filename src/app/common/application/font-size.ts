export class FontSize {
    constructor(public normalSize: number) {}

    public mediumSize: number = this.normalSize * 1.143;
    public largeSize: number = this.normalSize * 1.571;
    public extraLargeSize: number = this.normalSize * 1.857;
    public megaSize: number = this.normalSize * 2.571;
}
