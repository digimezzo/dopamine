import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../../services/appearance/appearance.service.base';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CoverPlayerPlaybackQueueComponent } from './cover-player-playback-queue/cover-player-playback-queue.component';
import { CoverPlayerVolumeControlComponent } from './cover-player-volume-control/cover-player-volume-control.component';
import { NavigationServiceBase } from '../../../../services/navigation/navigation.service.base';
import { enterLeftToRight, enterRightToLeft } from '../../../animations/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { NowPlayingPage } from '../../../../services/now-playing-navigation/now-playing-page';

@Component({
    selector: 'app-cover-player',
    host: { style: 'display: block' },
    templateUrl: './cover-player.component.html',
    styleUrls: ['./cover-player.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        enterLeftToRight,
        enterRightToLeft,
        trigger('controlsVisibility', [
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
            transition('hidden => visible', animate('.25s')),
            transition('visible => hidden', animate('1s')),
        ]),
    ],
})
export class CoverPlayerComponent implements OnInit {
    private timerId: number = 0;

    public constructor(
        public appearanceService: AppearanceServiceBase,
        private navigationService: NavigationServiceBase,
        private _bottomSheet: MatBottomSheet,
    ) {}

    public controlsVisibility: string = 'visible';

    public playbackQueueIsVisible: boolean = false;

    public ngOnInit(): void {
        document.addEventListener('mousemove', () => {
            this.resetTimer();
        });

        document.addEventListener('mousedown', () => {
            this.resetTimer();
        });

        this.resetTimer();
    }

    private resetTimer(): void {
        clearTimeout(this.timerId);

        this.controlsVisibility = 'visible';

        this.timerId = window.setTimeout(() => {
            this.controlsVisibility = 'hidden';
        }, 5000);
    }

    public openPlaybackQueue(): void {
        const ref = this._bottomSheet.open(CoverPlayerPlaybackQueueComponent);
        this.navigationService.refreshPlaybackQueueList();
        this.playbackQueueIsVisible = true;
        ref.backdropClick().subscribe(() => {
            this.playbackQueueIsVisible = false;
        });
    }

    public openVolumeControl(): void {
        this._bottomSheet.open(CoverPlayerVolumeControlComponent);
    }
}
