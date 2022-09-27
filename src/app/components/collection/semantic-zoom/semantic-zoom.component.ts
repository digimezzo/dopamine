import { Component, Input } from '@angular/core';
import { SemanticZoomable } from '../../../common/semantic-zoomable';

@Component({
    selector: 'app-semantic-zoom',
    templateUrl: './semantic-zoom.component.html',
    styleUrls: ['./semantic-zoom.component.scss'],
})
export class SemanticZoomComponent {
    constructor() {}

    @Input()
    public SemanticZoomables: SemanticZoomable[] = [];

    public buttonTexts: any = [
        ['#', 'a', 'b', 'c'],
        ['d', 'e', 'f', 'g'],
        ['f', 'i', 'j', 'k'],
        ['l', 'm', 'n', 'o'],
        ['p', 'q', 'r', 's'],
        ['t', 'u', 'v', 'w'],
        ['x', 'y', 'z'],
    ];

    public isZoomable(text: string): boolean {
        const headers: string[] = this.SemanticZoomables.map((x) => x.zoomHeader);

        return headers.includes(text);
    }
}
