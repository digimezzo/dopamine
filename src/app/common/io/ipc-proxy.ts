/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {Injectable} from '@angular/core';
import {ipcRenderer} from 'electron';
import {IpcProxyBase} from './ipc-proxy.base';
import {Observable, Subject} from "rxjs";
import {IIndexingMessage} from "../../services/indexing/messages/i-indexing-message";

@Injectable()
export class IpcProxy implements IpcProxyBase {
    private onIndexingWorkerMessage: Subject<IIndexingMessage> = new Subject();
    private onIndexingWorkerExit: Subject<void> = new Subject();

    public constructor() {
        ipcRenderer.on('indexing-worker-message', (_: Electron.IpcRendererEvent, message: IIndexingMessage): void => {
            this.onIndexingWorkerMessage.next(message);
        });

        ipcRenderer.on('indexing-worker-exit', async () => {
            this.onIndexingWorkerExit.next();
        });
    }

    public onIndexingWorkerMessage$: Observable<IIndexingMessage> = this.onIndexingWorkerMessage.asObservable();
    public onIndexingWorkerExit$: Observable<void> = this.onIndexingWorkerExit.asObservable();

    public sendToMainProcess(channel: string, arg: unknown): void {
        ipcRenderer.send(channel, arg);
    }
}
