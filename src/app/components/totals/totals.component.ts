import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-totals',
    templateUrl: './totals.component.html',
    styleUrls: ['./totals.component.scss'],
})
export class TotalsComponent implements OnInit {
    constructor() {}

    @Input() public totalFileSizeInBytes: number = 0;
    @Input() public totalDurationInMilliseconds: number = 0;

    public ngOnInit(): void {}
}
