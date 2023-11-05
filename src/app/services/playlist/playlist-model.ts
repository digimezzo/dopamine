import { Strings } from '../../common/strings';
import { ISelectable } from '../../ui/interfaces/i-selectable';

export class PlaylistModel implements ISelectable {
    public constructor(
        public name: string,
        public folderName: string,
        public path: string,
        public imagePath: string,
    ) {}

    public isSelected: boolean = false;

    public get isDefault(): boolean {
        return Strings.isNullOrWhiteSpace(this.name);
    }
}
