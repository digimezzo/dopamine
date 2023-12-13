import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Constants } from '../../../../common/application/constants';
import { SemanticZoomable } from '../../../../common/semantic-zoomable';
import { SchedulerBase } from '../../../../common/scheduling/scheduler.base';

@Component({
    selector: 'app-semantic-zoom',
    templateUrl: './semantic-zoom.component.html',
    styleUrls: ['./semantic-zoom.component.scss'],
    animations: [
        trigger('fadeIn', [
            state(
                'visible',
                style({
                    opacity: 1,
                }),
            ),
            state(
                'hidden',
                style({
                    opacity: 0,
                }),
            ),
            transition('hidden => visible', animate(`${Constants.semanticZoomOutAnimationMilliseconds}ms`)),
        ]),
    ],
})
export class SemanticZoomComponent implements OnInit {
    public constructor(private scheduler: SchedulerBase) {}

    public fadeIn: string = 'hidden';

    @Input()
    public SemanticZoomables: SemanticZoomable[] = [];

    public buttonTexts: string[][] = [
        ['#', 'a', 'b', 'c'],
        ['d', 'e', 'f', 'g'],
        ['h', 'i', 'j', 'k'],
        ['l', 'm', 'n', 'o'],
        ['p', 'q', 'r', 's'],
        ['t', 'u', 'v', 'w'],
        ['x', 'y', 'z'],
    ];

    public async ngOnInit(): Promise<void> {
        await this.scheduler.sleepAsync(Constants.semanticZoomOutDelayMilliseconds);
        this.fadeIn = 'visible';
    }

    public isZoomable(text: string): boolean {
        const headers: string[] = this.SemanticZoomables.map((x) => x.zoomHeader);

        return headers.includes(text);
    }
}
