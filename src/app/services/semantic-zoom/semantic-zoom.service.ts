import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SemanticZoomServiceBase } from './semantic-zoom.service.base';

@Injectable()
export class SemanticZoomService implements SemanticZoomServiceBase {
    private zoomOutRequested: Subject<void> = new Subject();
    private zoomInRequested: Subject<string> = new Subject();

    public zoomOutRequested$: Observable<void> = this.zoomOutRequested.asObservable();
    public zoomInRequested$: Observable<string> = this.zoomInRequested.asObservable();

    public requestZoomOut(): void {
        this.zoomOutRequested.next();
    }

    public requestZoomIn(text: string): void {
        this.zoomInRequested.next(text);
    }
}
