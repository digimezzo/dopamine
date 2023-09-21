import { Strings } from '../../common/strings';
import { ISelectable } from '../../interfaces/i-selectable';

export class PlaylistModel implements ISelectable {
    constructor(public name: string, public folderName: string, public path: string, public imagePath: string) {}

    public isSelected: boolean = false;

    public get isDefault(): boolean {
        return Strings.isNullOrWhiteSpace(this.name);
    }
}
