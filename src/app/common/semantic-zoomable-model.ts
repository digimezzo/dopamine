import { SemanticZoomable } from './semantic-zoomable';

export class SemanticZoomableModel extends SemanticZoomable {
    constructor(private semanticZoomable: SemanticZoomable) {
        super();

        this.isZoomHeader = true;
    }

    public get name(): string {
        return this.semanticZoomable.name;
    }

    public get displayName(): string {
        return '';
    }
}
