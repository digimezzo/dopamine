import { Strings } from '../../strings';

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
        if (!Strings.isNullOrWhiteSpace(this.imageMega)) {
            return this.imageMega;
        }

        if (!Strings.isNullOrWhiteSpace(this.imageExtraLarge)) {
            return this.imageExtraLarge;
        }

        if (!Strings.isNullOrWhiteSpace(this.imageLarge)) {
            return this.imageLarge;
        }

        if (!Strings.isNullOrWhiteSpace(this.imageMedium)) {
            return this.imageMedium;
        }

        if (!Strings.isNullOrWhiteSpace(this.imageSmall)) {
            return this.imageSmall;
        }

        return '';
    }
}
