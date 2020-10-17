import { StringCompare } from '../../string-compare';
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
