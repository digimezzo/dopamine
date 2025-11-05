import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ArtistInformation } from '../../../../../services/artist-information/artist-information';
import { SettingsBase } from '../../../../../common/settings/settings.base';

@Component({
    selector: 'similar-artist',
    host: { style: 'display: block' },
    templateUrl: './similar-artist.component.html',
    styleUrls: ['./similar-artist.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SimilarArtistComponent {
    public constructor(public settings: SettingsBase) {}

    @Input()
    public similarArtist: ArtistInformation = ArtistInformation.empty();
}
