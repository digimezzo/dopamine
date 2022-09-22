import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { SemanticZoomable } from './semantic-zoomable';
import { SemanticZoomableModel } from './semantic-zoomable-model';

@Injectable()
export class SemanticZoomHeaderAdder {
    constructor() {}

    public addZoomHeaders(semanticZoomables: SemanticZoomable[]): void {
        let previousZoomHeader: string = uuidv4();

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
