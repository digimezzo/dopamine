import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Constants } from '../../../core/base/constants';
import { ExternalComponent } from '../../../core/base/external-component';

@Component({
    selector: 'app-components',
    host: { style: 'display: block' },
    templateUrl: './components.component.html',
    styleUrls: ['./components.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ComponentsComponent implements OnInit {
    constructor() {}

    public externalComponents: ExternalComponent[] = Constants.externalComponents;

    public ngOnInit(): void {}
}
