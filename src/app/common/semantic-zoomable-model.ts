import { SemanticZoomable } from './semantic-zoomable';

export class SemanticZoomableModel extends SemanticZoomable {
    public constructor(private semanticZoomable: SemanticZoomable) {
        super();

        this.isZoomHeader = true;
    }

    public get displayName(): string {
        return this.semanticZoomable.displayName;
    }
}
