import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';

@Component({
    selector: 'app-information',
    host: { style: 'display: block' },
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class InformationComponent implements OnInit {
    constructor(public appearanceService: BaseAppearanceService) {}

    public ngOnInit(): void {}
}
