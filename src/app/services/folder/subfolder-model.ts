import { IPlayable } from '../../common/styling/i-playable';

export class SubfolderModel implements IPlayable {
    constructor(public path: string, public isGoToParent: boolean) {}

    public isSelected: boolean = false;
    public isPlaying: boolean = false;
}
