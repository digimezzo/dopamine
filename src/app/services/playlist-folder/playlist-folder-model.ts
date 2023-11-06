import { StringUtils } from '../../common/utils/string-utils';
import { ISelectable } from '../../ui/interfaces/i-selectable';

export class PlaylistFolderModel implements ISelectable {
    public constructor(
        public name: string,
        public path: string,
        public isModifiable: boolean,
    ) {}

    public isSelected: boolean = false;

    public get isDefault(): boolean {
        return StringUtils.isNullOrWhiteSpace(this.name);
    }
}
