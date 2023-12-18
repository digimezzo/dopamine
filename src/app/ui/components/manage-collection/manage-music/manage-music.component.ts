import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-manage-music',
    host: { style: 'display: block; width: 100%;' },
    templateUrl: './manage-music.component.html',
    styleUrls: ['./manage-music.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ManageMusicComponent {}
