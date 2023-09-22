import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Strings } from '../../../../../common/strings';

@Component({
    selector: 'app-collection-tracks-table-header',
    host: { style: 'display: block' },
    templateUrl: './collection-tracks-table-header.component.html',
    styleUrls: ['./collection-tracks-table-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CollectionTracksTableHeaderComponent {
    @Input() public text: string;
    @Input() public icon: string;
    @Input() public isOrderedBy: boolean;
    @Input() public isOrderedAscending: boolean;

    public get hasIcon(): boolean {
        return Strings.isNullOrWhiteSpace(this.icon);
    }
}
