import { BrowserWindow } from 'electron';

export abstract class BaseRemoteProxy {
    public abstract getGlobal(name: string): any;
    public abstract getCurrentWindow(): BrowserWindow;
    public abstract getParameters(): string[];
}
