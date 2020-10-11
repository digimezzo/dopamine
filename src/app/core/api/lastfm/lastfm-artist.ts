import { StringComparison } from '../../string-comparison';
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
        if (!StringComparison.isNullOrWhiteSpace(this.imageMega)) {
            return this.imageMega;
        }

        if (!StringComparison.isNullOrWhiteSpace(this.imageExtraLarge)) {
            return this.imageExtraLarge;
        }

        if (!StringComparison.isNullOrWhiteSpace(this.imageLarge)) {
            return this.imageLarge;
        }

        if (!StringComparison.isNullOrWhiteSpace(this.imageMedium)) {
            return this.imageMedium;
        }

        if (!StringComparison.isNullOrWhiteSpace(this.imageSmall)) {
            return this.imageSmall;
        }

        return '';
    }
}
