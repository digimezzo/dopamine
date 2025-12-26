import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppearanceServiceBase } from '../../../services/appearance/appearance.service.base';
import { NavigationServiceBase } from '../../../services/navigation/navigation.service.base';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { enterLeftToRight, enterRightToLeft } from '../../animations/animations';
import { SettingsBase } from '../../../common/settings/settings.base';
import { AnimatedPage } from '../animated-page';
import { AlbumServiceBase } from '../../../services/album/album-service.base';
import { AlbumModel } from '../../../services/album/album-model';

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
        trigger('albumFadeIn', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(0.8)' }),
                animate('0.6s ease-out', style({ opacity: 1, transform: 'scale(1)' })),
            ]),
        ]),
    ],
})
export class AlbumCloudComponent extends AnimatedPage implements OnInit {
    private timerId: number = 0;
    public mostPlayedAlbums: AlbumModel[] = [];
    public animationDelays: number[] = [];

    public constructor(
        public appearanceService: AppearanceServiceBase,
        private navigationService: NavigationServiceBase,
        private settings: SettingsBase,
        private albumService: AlbumServiceBase,
    ) {
        super();
    }

    public controlsVisibility: string = 'visible';

    public ngOnInit(): void {
        this.loadMostPlayedAlbums();
        this.generateRandomDelays();

        document.addEventListener('mousemove', () => {
            this.resetTimer();
        });

        document.addEventListener('mousedown', () => {
            this.resetTimer();
        });

        this.resetTimer();
    }

    private loadMostPlayedAlbums(): void {
        this.mostPlayedAlbums = this.albumService.getMostPlayedAlbums(12);
    }

    private generateRandomDelays(): void {
        this.animationDelays = [];
        for (let i = 0; i < 12; i++) {
            // Generate random delay between 0 and 0.6 seconds
            const delay = Math.random() * 0.6;
            this.animationDelays.push(delay);
        }
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

    public onAlbumClick(album: AlbumModel | undefined): void {
        if (!album) {
            return;
        }
        // TODO: Add function to play album here
    }
}
