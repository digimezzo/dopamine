import { Observable } from 'rxjs';

export abstract class EventListenerServiceBase {
    public abstract argumentsReceived$: Observable<string[]>;
    public abstract filesDropped$: Observable<string[]>;
    public abstract listenToEvents(): void;
}
