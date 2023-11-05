import { Component, Input } from '@angular/core';
import { SemanticZoomServiceBase } from '../../../../services/semantic-zoom/semantic-zoom.service.base';

@Component({
    selector: 'app-semantic-zoom-button',
    templateUrl: './semantic-zoom-button.component.html',
    styleUrls: ['./semantic-zoom-button.component.scss'],
    host: { style: 'display: block' },
})
export class SemanticZoomButtonComponent {
    public constructor(public semanticZoomService: SemanticZoomServiceBase) {}

    @Input() public text: string = '';
    @Input() public isZoomable: boolean = false;

    public requestZoomIn(): void {
        this.semanticZoomService.requestZoomIn(this.text);
    }
}
