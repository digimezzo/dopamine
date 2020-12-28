import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-collection-folders',
    host: { 'style': 'display: block' },
    templateUrl: './collection-folders.component.html',
    styleUrls: ['./collection-folders.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CollectionFoldersComponent implements OnInit {
    // @ViewChild('split', {static: false}) public split: SplitComponent;
    // @ViewChild('area1', {static: false}) public area1: SplitAreaDirective;
    // @ViewChild('area2', {static: false}) public area2: SplitAreaDirective;

    // constructor() { }

    // public sizes: any = {
    //     percent: {
    //         area1: 30,
    //         area2: 70,
    //     }
    // };

    public ngOnInit(): void {
    }

    // public dragEnd(unit: string, { sizes }): void {
    //     if (unit === 'percent') {
    //         this.sizes.percent.area1 = sizes[0];
    //         this.sizes.percent.area2 = sizes[1];
    //     }
    // }
}
