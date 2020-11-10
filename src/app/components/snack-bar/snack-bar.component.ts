import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
    selector: 'app-snack-bar',
    host: { 'style': 'display: block' },
    templateUrl: './snack-bar.component.html',
    styleUrls: ['./snack-bar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SnackBarComponent implements OnInit {

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    }

    public ngOnInit(): void {
    }
}
