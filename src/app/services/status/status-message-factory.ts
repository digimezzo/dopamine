import { StatusMessage } from './status-message';

export class StatusMessageFactory {
    public createDismissible(message: string): StatusMessage {
        return new StatusMessage(message, true);
    }

    public createNonDismissible(message: string): StatusMessage {
        return new StatusMessage(message, false);
    }
}
