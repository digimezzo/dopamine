import { Injectable } from '@angular/core';
import { ArtistInformation } from './artist-information';
import { DesktopBase } from '../../common/io/desktop.base';

@Injectable()
export class ArtistInformationFactory {
    public constructor(private desktop: DesktopBase) {}

    public create(name: string, url: string, imageUrl: string, biography: string): ArtistInformation {
        return new ArtistInformation(this.desktop, name, url, imageUrl, biography);
    }

    public createEmpty(): ArtistInformation {
        return ArtistInformation.empty();
    }
}
