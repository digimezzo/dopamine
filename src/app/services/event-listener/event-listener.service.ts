import { ipcRenderer } from 'electron';
import { Observable, Subject } from 'rxjs';
import { EventListenerServiceBase } from './event-listener.service.base';

export class EventListenerService implements EventListenerServiceBase {
    private argumentsReceived: Subject<string[]> = new Subject();
    private filesDropped: Subject<string[]> = new Subject();

    public argumentsReceived$: Observable<string[]> = this.argumentsReceived.asObservable();
    public filesDropped$: Observable<string[]> = this.filesDropped.asObservable();

    public listenToEvents(): void {
        ipcRenderer.on('arguments-received', (event, argv: string[] | undefined) => {
            this.argumentsReceived.next(argv);
        });

        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('drop', (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (event.dataTransfer == undefined) {
                return;
            }

            const filePaths: string[] = [];

            const files = Array.from(event.dataTransfer.files) as (File & { path: string })[];

            for (const f of files) {
                filePaths.push(f.path);
            }

            this.filesDropped.next(filePaths);
        });
    }
}
