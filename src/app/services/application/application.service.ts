import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import {ApplicationServiceBase} from "./application.service.base";

@Injectable()
export class ApplicationService implements ApplicationServiceBase {
    private windowSizeChanged: Subject<void> = new Subject();
    private mouseButtonReleased: Subject<void> = new Subject();

    public constructor() {
        fromEvent(window, 'resize').subscribe(() => {
            this.windowSizeChanged.next();
        });

        fromEvent(document, 'mouseup').subscribe(() => {
            this.mouseButtonReleased.next();
        });
    }

    public windowSizeChanged$: Observable<void> = this.windowSizeChanged.asObservable();
    public mouseButtonReleased$: Observable<void> = this.mouseButtonReleased.asObservable();
}
