import { Strings } from '../../strings';
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
