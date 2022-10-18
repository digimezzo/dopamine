import { Strings } from '../../common/strings';

export class PlaylistFolderModel {
    constructor(public name: string, public path: string, public isModifiable: boolean) {}

    public isSelected: boolean = false;

    public get isDefault(): boolean {
        return Strings.isNullOrWhiteSpace(this.name);
    }
}
