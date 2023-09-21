import { Strings } from '../../common/strings';
import { ISelectable } from '../../interfaces/i-selectable';

export class PlaylistFolderModel implements ISelectable {
    public constructor(public name: string, public path: string, public isModifiable: boolean) {}

    public isSelected: boolean = false;

    public get isDefault(): boolean {
        return Strings.isNullOrWhiteSpace(this.name);
    }
}
