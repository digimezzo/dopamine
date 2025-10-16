import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-cover-player',
    host: { style: 'display: block' },
    templateUrl: './dopamp-player.component.html',
    styleUrls: ['./dopamp-player.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DopampPlayerComponent implements OnInit, AfterViewInit {
    public constructor() {}

    public ngAfterViewInit(): void {}

    public ngOnInit(): void {}
}
