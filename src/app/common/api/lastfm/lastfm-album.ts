import { StringUtils } from '../../utils/string-utils';

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
