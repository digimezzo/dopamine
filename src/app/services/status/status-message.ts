import { v4 as uuidv4 } from 'uuid';

export class StatusMessage {
    constructor(public message: string, public isDismissable: boolean) {
        this.id = uuidv4();
    }

    public readonly id: string;
}
