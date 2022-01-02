export class PlaylistFolderModel {
    constructor(public name: string, public path: string, public isModifiable: boolean) {}

    public isSelected: boolean = false;
}
