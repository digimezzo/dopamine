import { Observable } from 'rxjs';

export abstract class BaseSemanticZoomService {
    public abstract zoomOutRequested$: Observable<void>;
    public abstract zoomInRequested$: Observable<string>;

    public abstract requestZoomOut(): void;
    public abstract requestZoomIn(text: string): void;
}
