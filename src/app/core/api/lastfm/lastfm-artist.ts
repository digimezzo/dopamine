import { LastfmBiography } from './lastfm-biography';

export class LastfmArtist {
    public name: string;
    public url: string;
    public musicBrainzId: string;
    public imageSmall: string;
    public imageMedium: string;
    public imageLarge: string;
    public imageExtraLarge: string;
    public imageMega: string;
    public similarArtists: LastfmArtist[] = [];
    public biography: LastfmBiography;

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
