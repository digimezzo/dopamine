import { StringCompare } from '../../string-compare';

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
        if (!StringCompare.isNullOrWhiteSpace(this.imageMega)) {
            return this.imageMega;
        }

        if (!StringCompare.isNullOrWhiteSpace(this.imageExtraLarge)) {
            return this.imageExtraLarge;
        }

        if (!StringCompare.isNullOrWhiteSpace(this.imageLarge)) {
            return this.imageLarge;
        }

        if (!StringCompare.isNullOrWhiteSpace(this.imageMedium)) {
            return this.imageMedium;
        }

        if (!StringCompare.isNullOrWhiteSpace(this.imageSmall)) {
            return this.imageSmall;
        }

        return '';
    }
}
