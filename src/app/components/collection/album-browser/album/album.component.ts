import { Component, Input } from '@angular/core';
import { AlbumModel } from '../../../../services/album/album-model';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';

@Component({
    selector: 'app-album',
    host: { style: 'display: block' },
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.scss'],
})
export class AlbumComponent {
    public constructor(public appearanceService: AppearanceServiceBase) {}

    @Input() public album: AlbumModel;
    @Input() public isSelected: boolean = false;
}
