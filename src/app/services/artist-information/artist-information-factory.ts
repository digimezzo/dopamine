import { Injectable } from '@angular/core';
import { BaseDesktop } from '../../common/io/base-desktop';
import { ArtistInformation } from './artist-information';

@Injectable()
export class ArtistInformationFactory {
    public constructor(private desktop: BaseDesktop) {}

    public create(name: string, url: string, imageUrl: string, biography: string): ArtistInformation {
        return new ArtistInformation(this.desktop, name, url, imageUrl, biography);
    }

    public createEmpty(): ArtistInformation {
        return ArtistInformation.empty();
    }
}
