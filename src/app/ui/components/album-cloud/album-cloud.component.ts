import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { enterLeftToRight, enterRightToLeft } from '../../animations/animations';
import { SettingsBase } from '../../../common/settings/settings.base';
import { AnimatedPage } from '../animated-page';

@Component({
    selector: 'app-album-cloud',
    host: { style: 'display: block' },
    templateUrl: './album-cloud.component.html',
    styleUrls: ['./album-cloud.component.scss'],
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
export class AlbumCloudComponent extends AnimatedPage implements OnInit {
    private timerId: number = 0;

    public constructor(
        public appearanceService: AppearanceServiceBase,
        private navigationService: NavigationServiceBase,
        private settings: SettingsBase,
    ) {
        super();
    }

    public controlsVisibility: string = 'visible';

    public ngOnInit(): void {
        document.addEventListener('mousemove', () => {
            this.resetTimer();
        });

        document.addEventListener('mousedown', () => {
            this.resetTimer();
        });

        this.resetTimer();
    }

    public async goBackToCollectionAsync(): Promise<void> {
        await this.navigationService.navigateToCollectionAsync();
    }

    private resetTimer(): void {
        clearTimeout(this.timerId);

        this.controlsVisibility = 'visible';

        if (this.settings.keepPlaybackControlsVisibleOnNowPlayingPage) {
            return;
        }

        this.timerId = window.setTimeout(() => {
            this.controlsVisibility = 'hidden';
        }, 5000);
    }
}
