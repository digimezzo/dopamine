export class PlaylistModel {
    constructor(public name: string, public path: string, public imagePath: string) {}

    public isSelected: boolean = false;
}
