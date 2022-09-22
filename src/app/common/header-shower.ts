import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ArtistModel } from '../services/artist/artist-model';
import { BaseTranslatorService } from '../services/translator/base-translator.service';
import { CanShowHeader } from './can-show-header';

@Injectable()
export class HeaderShower {
    constructor(private translatorService: BaseTranslatorService) {}

    public showHeaders(canShowHeaders: CanShowHeader[]): void {
        let previousHeader: string = uuidv4();

        for (const artist of canShowHeaders) {
            artist.showHeader = false;

            if (artist.header !== previousHeader) {
                const indexOfCanShowHeader = canShowHeaders.indexOf(artist);

                if (indexOfCanShowHeader > -1) {
                    const headerArtist: ArtistModel = new ArtistModel(artist.header, this.translatorService);
                    headerArtist.showHeader = true;
                    canShowHeaders.splice(indexOfCanShowHeader, 0, headerArtist);
                }
            }

            previousHeader = artist.header;
        }
    }
}
