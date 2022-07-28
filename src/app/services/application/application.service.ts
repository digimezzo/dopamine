import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Constants } from '../../common/application/constants';
import { BaseApplicationService } from './base-application.service';

@Injectable()
export class ApplicationService implements BaseApplicationService {
    private windowSizeChanged: Subject<void> = new Subject();
    private mouseButtonReleased: Subject<void> = new Subject();

    constructor() {
        fromEvent(window, 'resize')
            .pipe(debounceTime(Constants.albumsRedrawDelayMilliseconds))
            .subscribe((event: any) => {
                this.windowSizeChanged.next();
            });

        fromEvent(document, 'mouseup')
            .pipe(debounceTime(Constants.albumsRedrawDelayMilliseconds))
            .subscribe((event: any) => {
                this.mouseButtonReleased.next();
            });
    }

    public windowSizeChanged$: Observable<void> = this.windowSizeChanged.asObservable();
    public mouseButtonReleased$: Observable<void> = this.mouseButtonReleased.asObservable();
}
