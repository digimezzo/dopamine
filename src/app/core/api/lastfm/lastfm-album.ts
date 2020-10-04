export class LastfmAlbum {
    public name: string;
    public artist: string;
    public url: string;
    public imageSmall: string;
    public imageMedium: string;
    public imageLarge: string;
    public imageExtraLarge: string;
    public imageMega: string;

    public largestImage(): string {
        if (this.imageMega) {
            return this.imageMega;
        }

        if (this.imageExtraLarge) {
            return this.imageExtraLarge;
        }

        if (this.imageLarge) {
            return this.imageLarge;
        }

        if (this.imageMedium) {
            return this.imageMedium;
        }

        if (this.imageSmall) {
            return this.imageSmall;
        }

        return '';
    }
}
