import { BrowserWindow } from 'electron';
import { WindowSize } from './window-size';

export abstract class ApplicationBase {
    public abstract getGlobal(name: string): unknown;
    public abstract getCurrentWindow(): BrowserWindow;
    public abstract getWindowSize(): WindowSize;
    public abstract getParameters(): string[];
}
