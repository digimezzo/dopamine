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

    private semanticZoomables: SemanticZoomable[] = [];

    @Input()
    public set SemanticZoomables(value: SemanticZoomable[]) {
        this.semanticZoomables = value;
        const presentHeaders = new Set(value.map((item) => item.zoomHeader));
        const headers = Constants.extendedAlphabeticalHeaders.filter(
            (header) => Constants.alphabeticalHeaders.includes(header) || presentHeaders.has(header),
        );
        this.buttonTexts = [];
        for (let index = 0; index < headers.length; index += 4) {
            this.buttonTexts.push(headers.slice(index, index + 4));
        }
    }

    public get SemanticZoomables(): SemanticZoomable[] {
        return this.semanticZoomables;
    }

    public buttonTexts: string[][] = Array.from({ length: 7 }, (_, index) =>
        Constants.alphabeticalHeaders.slice(index * 4, index * 4 + 4),
    );

    public async ngOnInit(): Promise<void> {
        await this.scheduler.sleepAsync(Constants.semanticZoomOutDelayMilliseconds);
        this.fadeIn = 'visible';
    }

    public isZoomable(text: string): boolean {
        const headers: string[] = this.SemanticZoomables.map((x) => x.zoomHeader);

        return headers.includes(text);
    }
}
