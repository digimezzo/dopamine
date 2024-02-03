import { IIndexingMessage } from './i-indexing-message';

export class AddingTracksMessage implements IIndexingMessage {
    public type: string = 'addingTracks';
    public numberOfAddedTracks: number;
    public percentageOfAddedTracks: number;
}
