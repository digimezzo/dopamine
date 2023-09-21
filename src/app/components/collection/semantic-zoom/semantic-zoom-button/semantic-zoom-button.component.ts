import { Component, Input } from '@angular/core';
import { BaseSemanticZoomService } from '../../../../services/semantic-zoom/base-semantic-zoom.service';

@Component({
    selector: 'app-semantic-zoom-button',
    templateUrl: './semantic-zoom-button.component.html',
    styleUrls: ['./semantic-zoom-button.component.scss'],
    host: { style: 'display: block' },
})
export class SemanticZoomButtonComponent {
    public constructor(public semanticZoomService: BaseSemanticZoomService) {}

    @Input() public text: string = '';
    @Input() public isZoomable: boolean = false;

    public requestZoomIn(): void {
        this.semanticZoomService.requestZoomIn(this.text);
    }
}
