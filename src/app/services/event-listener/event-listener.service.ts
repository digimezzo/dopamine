import { ipcRenderer } from 'electron';
import { Observable, Subject } from 'rxjs';
import { BaseEventListenerService } from './base-event-listener.service';

export class EventListenerService implements BaseEventListenerService {
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

            for (const f of event.dataTransfer.files) {
                filePaths.push(f.path);
            }

            this.filesDropped.next(filePaths);
        });
    }
}
