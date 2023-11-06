import { StringUtils } from '../../common/utils/string-utils';
import { DesktopBase } from '../../common/io/desktop.base';

export class ArtistInformation {
    private _similarArtists: ArtistInformation[] = [];

    public constructor(
        private desktop: DesktopBase | undefined,
        private _name: string,
        private _url: string,
        private _imageUrl: string,
        private _biography: string,
    ) {}

    public get name(): string {
        return this._name;
    }

    public get url(): string {
        return this._url;
    }

    public get imageUrl(): string {
        return this._imageUrl;
    }

    public get biography(): string {
        return this._biography;
    }

    public get similarArtists(): ArtistInformation[] {
        return this._similarArtists;
    }

    public get isEmpty(): boolean {
        return StringUtils.isNullOrWhiteSpace(this.name);
    }

    public get hasSimilarArtists(): boolean {
        return this._similarArtists.length > 0;
    }

    public addSimilarArtist(name: string, url: string, imageUrl: string): void {
        this._similarArtists.push(new ArtistInformation(this.desktop, name, url, imageUrl, ''));
    }

    public async browseToUrlAsync(): Promise<void> {
        if (this.isEmpty) {
            return;
        }

        if (this.desktop != undefined) {
            await this.desktop.openLinkAsync(this.url);
        }
    }

    public static empty(): ArtistInformation {
        return new ArtistInformation(undefined, '', '', '', '');
    }
}
