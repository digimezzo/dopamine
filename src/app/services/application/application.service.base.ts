import { Observable } from 'rxjs';

export abstract class ApplicationServiceBase {
    public abstract windowSizeChanged$: Observable<void>;
    public abstract mouseButtonReleased$: Observable<void>;
}
