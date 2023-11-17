import { Injectable } from '@angular/core';
import { GuidFactory } from './guid.factory';
import { SemanticZoomable } from './semantic-zoomable';
import { SemanticZoomableModel } from './semantic-zoomable-model';

@Injectable()
export class SemanticZoomHeaderAdder {
    public constructor(private guidFactory: GuidFactory) {}

    public addZoomHeaders(semanticZoomables: SemanticZoomable[]): SemanticZoomable[] {
        const localSemanticZoomables: SemanticZoomable[] = [];
        let previousZoomHeader: string = this.guidFactory.create();

        for (const semanticZoomable of semanticZoomables) {
            if (!semanticZoomable.isZoomHeader) {
                if (semanticZoomable.zoomHeader !== previousZoomHeader) {
                    const newSemanticZoomable: SemanticZoomableModel = new SemanticZoomableModel(semanticZoomable);
                    localSemanticZoomables.push(newSemanticZoomable);
                }

                previousZoomHeader = semanticZoomable.zoomHeader;
                localSemanticZoomables.push(semanticZoomable);
            }
        }

        return localSemanticZoomables;
    }
}
