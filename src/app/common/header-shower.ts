import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { CanShowHeader } from './can-show-header';

@Injectable()
export class HeaderShower {
    public showHeaders(canShowHeaders: CanShowHeader[]): void {
        let previousHeader: string = uuidv4();

        for (const artist of canShowHeaders) {
            artist.showHeader = false;

            if (artist.header !== previousHeader) {
                artist.showHeader = true;
            }

            previousHeader = artist.header;
        }
    }
}
