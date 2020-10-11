import { ConfirmThat } from '../../confirm-that';

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
        if (ConfirmThat.isNotNullOrWhiteSpace(this.imageMega)) {
            return this.imageMega;
        }

        if (ConfirmThat.isNotNullOrWhiteSpace(this.imageExtraLarge)) {
            return this.imageExtraLarge;
        }

        if (ConfirmThat.isNotNullOrWhiteSpace(this.imageLarge)) {
            return this.imageLarge;
        }

        if (ConfirmThat.isNotNullOrWhiteSpace(this.imageMedium)) {
            return this.imageMedium;
        }

        if (ConfirmThat.isNotNullOrWhiteSpace(this.imageSmall)) {
            return this.imageSmall;
        }

        return '';
    }
}
