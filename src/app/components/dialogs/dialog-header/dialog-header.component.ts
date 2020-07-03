import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-dialog-header',
    templateUrl: './dialog-header.component.html',
    styleUrls: ['./dialog-header.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DialogHeaderComponent implements OnInit {
    constructor() {
    }

    @Input() public titleText: string;

    public ngOnInit(): void {
    }
}
