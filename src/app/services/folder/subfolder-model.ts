import { ISelectable } from '../../ui/interfaces/i-selectable';

export class SubfolderModel implements ISelectable {
    public constructor(
        public path: string,
        public isGoToParent: boolean,
    ) {}

    public isSelected: boolean = false;
    public isPlaying: boolean = false;
}
