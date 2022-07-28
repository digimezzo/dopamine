import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Constants } from '../../../common/application/constants';
import { ExternalComponent } from '../../../common/application/external-component';

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
