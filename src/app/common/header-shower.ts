import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { CanShowHeader } from './can-show-header';
import { HeaderModel } from './header-model';

@Injectable()
export class HeaderShower {
    constructor() {}

    public showHeaders(canShowHeaders: CanShowHeader[]): void {
        let previousHeader: string = uuidv4();

        for (const canShowHeader of canShowHeaders) {
            canShowHeader.showHeader = false;

            if (canShowHeader.header !== previousHeader) {
                const indexOfCanShowHeader = canShowHeaders.indexOf(canShowHeader);

                if (indexOfCanShowHeader > -1) {
                    const header: HeaderModel = new HeaderModel(canShowHeader);
                    canShowHeaders.splice(indexOfCanShowHeader, 0, header);
                }
            }

            previousHeader = canShowHeader.header;
        }
    }
}
