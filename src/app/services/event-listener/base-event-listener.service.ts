import { Observable } from 'rxjs';

export abstract class BaseEventListenerService {
    public abstract argumentsReceived$: Observable<string[]>;
    public abstract filesDropped$: Observable<string[]>;
    public abstract listenToEvents(): void;
}
