import { Component, Input } from '@angular/core';
import { AlbumModel } from '../../../../../services/album/album-model';
import { AppearanceServiceBase } from '../../../../../services/appearance/appearance.service.base';
import { SettingsBase } from '../../../../../common/settings/settings.base';
import { YearFormatter } from '../year-formatter';

@Component({
    selector: 'app-album',
    host: { style: 'display: block' },
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.scss'],
})
export class AlbumComponent {
    public constructor(
        public appearanceService: AppearanceServiceBase,
        public settings: SettingsBase,
    ) {}

    @Input() public album: AlbumModel;
    @Input() public isSelected: boolean = false;
    @Input() public showYear: boolean = false;

    public formatYear(year: number): string {
        return YearFormatter.formatYear(year);
    }
}
