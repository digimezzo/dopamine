import { Component, Input, ViewEncapsulation } from '@angular/core';
import { LyricsModel } from '../../../../../services/lyrics/lyrics-model';

@Component({
    selector: 'app-plain-lyrics',
    host: { style: 'display: block; width: 100%; height: 100%;' },
    templateUrl: './plain-lyrics.component.html',
    styleUrls: ['./plain-lyrics.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlainLyricsComponent {
    @Input() public lyrics: LyricsModel | undefined;
}
