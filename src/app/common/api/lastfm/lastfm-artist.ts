import { LastfmBiography } from './lastfm-biography';
import { StringUtils } from '../../utils/string-utils';

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
    public biography: LastfmBiography | undefined;

    public largestImage(): string {
        if (!StringUtils.isNullOrWhiteSpace(this.imageMega)) {
            return this.imageMega;
        }

        if (!StringUtils.isNullOrWhiteSpace(this.imageExtraLarge)) {
            return this.imageExtraLarge;
        }

        if (!StringUtils.isNullOrWhiteSpace(this.imageLarge)) {
            return this.imageLarge;
        }

        if (!StringUtils.isNullOrWhiteSpace(this.imageMedium)) {
            return this.imageMedium;
        }

        if (!StringUtils.isNullOrWhiteSpace(this.imageSmall)) {
            return this.imageSmall;
        }

        return '';
    }
}
