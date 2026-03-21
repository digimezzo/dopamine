/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import { IpcProxyBase } from './ipc-proxy.base';
import { Observable, Subject } from 'rxjs';
import { IIndexingMessage } from '../../services/indexing/messages/i-indexing-message';

@Injectable()
export class IpcProxy implements IpcProxyBase {
    private onIndexingWorkerMessage: Subject<IIndexingMessage> = new Subject();
    private onIndexingWorkerExit: Subject<void> = new Subject();
    private onApplicationClose: Subject<void> = new Subject();
    private onDockPlayPause: Subject<void> = new Subject();
    private onDockNext: Subject<void> = new Subject();
    private onDockPrevious: Subject<void> = new Subject();

    public constructor() {
        ipcRenderer.on('indexing-worker-message', (_: Electron.IpcRendererEvent, message: IIndexingMessage): void => {
            this.onIndexingWorkerMessage.next(message);
        });

        ipcRenderer.on('indexing-worker-exit', () => {
            this.onIndexingWorkerExit.next();
        });

        ipcRenderer.on('application-close', (_) => {
            this.onApplicationClose.next();
        });

        ipcRenderer.on('dock-play-pause', () => {
            this.onDockPlayPause.next();
        });

        ipcRenderer.on('dock-next', () => {
            this.onDockNext.next();
        });

        ipcRenderer.on('dock-previous', () => {
            this.onDockPrevious.next();
        });
    }

    public onIndexingWorkerMessage$: Observable<IIndexingMessage> = this.onIndexingWorkerMessage.asObservable();
    public onIndexingWorkerExit$: Observable<void> = this.onIndexingWorkerExit.asObservable();
    public onApplicationClose$: Observable<void> = this.onApplicationClose.asObservable();
    public onDockPlayPause$: Observable<void> = this.onDockPlayPause.asObservable();
    public onDockNext$: Observable<void> = this.onDockNext.asObservable();
    public onDockPrevious$: Observable<void> = this.onDockPrevious.asObservable();

    public sendToMainProcess(channel: string, arg: unknown): void {
        ipcRenderer.send(channel, arg);
    }
}
