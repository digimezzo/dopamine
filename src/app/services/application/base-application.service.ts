import { Observable } from 'rxjs';

export abstract class BaseApplicationService {
    public abstract windowSizeChanged$: Observable<void>;
    public abstract mouseButtonReleased$: Observable<void>;
}
