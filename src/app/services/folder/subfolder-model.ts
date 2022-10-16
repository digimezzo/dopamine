import { IStylable } from '../../common/i-stylable';

export class SubfolderModel implements IStylable {
    constructor(public path: string, public isGoToParent: boolean) {}

    public isSelected: boolean = false;
    public isPlaying: boolean = false;
}
