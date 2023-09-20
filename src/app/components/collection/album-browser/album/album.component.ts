import { Component, Input } from '@angular/core';
import { AlbumModel } from '../../../../services/album/album-model';
import { BaseAppearanceService } from '../../../../services/appearance/base-appearance.service';

@Component({
    selector: 'app-album',
    host: { style: 'display: block' },
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.scss'],
})
export class AlbumComponent {
    constructor(public appearanceService: BaseAppearanceService) {}

    @Input() public album: AlbumModel;
    @Input() public isSelected: boolean = false;
}
