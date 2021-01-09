import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-dialog-header',
    templateUrl: './dialog-header.component.html',
    styleUrls: ['./dialog-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DialogHeaderComponent implements OnInit {
    constructor() {}

    @Input() public icon: string;
    @Input() public title: string;

    public ngOnInit(): void {}
}
