import { BrowserWindow } from 'electron';
import { Observable } from 'rxjs';

export abstract class BaseRemoteProxy {
    public abstract argumentsReceived$: Observable<any>;
    public abstract getGlobal(name: string): any;
    public abstract getCurrentWindow(): BrowserWindow;
    public abstract getParameters(): string[];
}
