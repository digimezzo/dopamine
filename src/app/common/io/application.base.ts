import { BrowserWindow } from 'electron';
import { WindowSize } from './window-size';
import { Observable } from 'rxjs';

export abstract class ApplicationBase {
    public abstract fullScreenChanged$: Observable<boolean>;

    public abstract getGlobal(name: string): unknown;
    public abstract getCurrentWindow(): BrowserWindow;
    public abstract getWindowSize(): WindowSize;
    public abstract getParameters(): string[];
    public abstract isFullScreen(): boolean;
}
