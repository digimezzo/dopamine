import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { BaseApplicationService } from './base-application.service';

@Injectable()
export class ApplicationService implements BaseApplicationService {
    private windowSizeChanged: Subject<void> = new Subject();
    private mouseButtonReleased: Subject<void> = new Subject();

    constructor() {
        fromEvent(window, 'resize').subscribe((event: any) => {
            this.windowSizeChanged.next();
        });

        fromEvent(document, 'mouseup').subscribe((event: any) => {
            this.mouseButtonReleased.next();
        });
    }

    public windowSizeChanged$: Observable<void> = this.windowSizeChanged.asObservable();
    public mouseButtonReleased$: Observable<void> = this.mouseButtonReleased.asObservable();
}
