import { Strings } from '../../common/strings';

export class PlaylistModel {
    constructor(public name: string, public folderName: string, public path: string, public imagePath: string) {}

    public isSelected: boolean = false;

    public get isDefault(): boolean {
        return Strings.isNullOrWhiteSpace(this.name);
    }
}
