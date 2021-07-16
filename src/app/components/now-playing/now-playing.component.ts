import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseAppearanceService } from '../../services/appearance/base-appearance.service';
import { BaseNavigationService } from '../../services/navigation/base-navigation.service';

@Component({
    selector: 'app-now-playing',
    host: { style: 'display: block' },
    templateUrl: './now-playing.component.html',
    styleUrls: ['./now-playing.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('controlsVisibility', [
            state(
                'visible',
                style({
                    opacity: 1,
                })
            ),
            state(
                'hidden',
                style({
                    opacity: 0,
                })
            ),
            transition('hidden => visible', animate('.25s')),
            transition('visible => hidden', animate('1s')),
        ]),
    ],
})
export class NowPlayingComponent implements OnInit {
    private shouldHideControls: boolean = false;

    constructor(public appearanceService: BaseAppearanceService, private navigationService: BaseNavigationService) {}

    private timerId: number = 0;
    public controlsVisibility: string = 'visible';

    public ngOnInit(): void {
        this.resetTimer();

        document.addEventListener('mousemove', () => {
            this.resetTimer();
        });
    }

    public goBackToCollection(): void {
        this.navigationService.navigateToCollection();
    }

    private resetTimer(): void {
        clearTimeout(this.timerId);

        this.controlsVisibility = 'visible';

        this.timerId = window.setTimeout(() => {
            this.controlsVisibility = 'hidden';
        }, 5000);
    }
}
