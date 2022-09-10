import { BrowserWindow } from 'electron';
import { Observable } from 'rxjs';
import { WindowSize } from './window-size';
export abstract class BaseApplication {
    public abstract argumentsReceived$: Observable<any>;
    public abstract getGlobal(name: string): any;
    public abstract getCurrentWindow(): BrowserWindow;
    public abstract getWindowSize(): WindowSize;
    public abstract getParameters(): string[];
}
