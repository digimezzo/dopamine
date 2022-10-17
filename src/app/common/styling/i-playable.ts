import { ISelectable } from './i-selectable';

export interface IPlayable extends ISelectable {
    isPlaying: boolean;
}
