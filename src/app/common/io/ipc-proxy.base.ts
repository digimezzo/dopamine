/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';
import { IIndexingMessage } from '../../services/indexing/messages/i-indexing-message';

export abstract class IpcProxyBase {
    public abstract onIndexingWorkerMessage$: Observable<IIndexingMessage>;
    public abstract onIndexingWorkerExit$: Observable<void>;
    public abstract onApplicationClose$: Observable<void>;
    public abstract onDockPlayPause$: Observable<void>;
    public abstract onDockNext$: Observable<void>;
    public abstract onDockPrevious$: Observable<void>;

    public abstract sendToMainProcess(channel: string, arg: unknown): void;
}
