import { Observable } from 'rxjs';
import { StatusMessage } from './status-message';

export abstract class BaseStatusService {
    public abstract statusMessage$: Observable<StatusMessage>;
    public abstract removingSongsAsync(): Promise<void>;
    public abstract updatingSongsAsync(): Promise<void>;
    public abstract addedSongsAsync(numberOfAddedTracks: number, percentageOfAddedTracks: number): Promise<void>;
    public abstract newVersionAvailableAsync(version: string): Promise<void>;
    public abstract dismissStatusMessageAsync(): Promise<void>;
    public abstract dismissGivenStatusMessage(statusMessageToDismiss: StatusMessage): void;
    public abstract getCurrentStatusMessage(): StatusMessage;
}
