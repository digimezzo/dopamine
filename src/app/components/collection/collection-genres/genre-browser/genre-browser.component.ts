import { Component, OnDestroy, OnInit } from '@angular/core';
import { Logger } from '../../../../common/logger';
import { MouseSelectionWatcher } from '../../../../common/mouse-selection-watcher';

@Component({
    selector: 'app-genre-browser',
    host: { style: 'display: block' },
    templateUrl: './genre-browser.component.html',
    styleUrls: ['./genre-browser.component.scss'],
    providers: [MouseSelectionWatcher],
})
export class GenreBrowserComponent implements OnInit, OnDestroy {
    constructor(private logger: Logger) {}

    public ngOnDestroy(): void {}

    public ngOnInit(): void {}
}
