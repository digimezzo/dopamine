import { CanShowHeader } from './can-show-header';

export class HeaderModel extends CanShowHeader {
    constructor(private canShowHeader: CanShowHeader) {
        super();

        this.showHeader = true;
    }

    public get name(): string {
        return this.canShowHeader.name;
    }

    public get displayName(): string {
        return '';
    }
}
