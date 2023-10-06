import { Injectable } from '@angular/core';
import { GuidFactory } from './guid.factory';
import { SemanticZoomable } from './semantic-zoomable';
import { SemanticZoomableModel } from './semantic-zoomable-model';

@Injectable()
export class SemanticZoomHeaderAdder {
    public constructor(private guidFactory: GuidFactory) {}

    public addZoomHeaders(semanticZoomables: SemanticZoomable[]): void {
        let previousZoomHeader: string = this.guidFactory.create();

        for (const semanticZoomable of semanticZoomables) {
            semanticZoomable.isZoomHeader = false;

            if (semanticZoomable.zoomHeader !== previousZoomHeader) {
                const index = semanticZoomables.indexOf(semanticZoomable);

                if (index > -1) {
                    const newSemanticZoomable: SemanticZoomableModel = new SemanticZoomableModel(semanticZoomable);
                    semanticZoomables.splice(index, 0, newSemanticZoomable);
                }
            }

            previousZoomHeader = semanticZoomable.zoomHeader;
        }
    }
}
