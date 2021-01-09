export class FontSize {
    constructor(public mediumSize: number) {}

    public largeSize: number = this.mediumSize * 1.143;
    public extraLargeSize: number = this.mediumSize * 1.857;
    public megaSize: number = this.mediumSize * 2.571;
}
