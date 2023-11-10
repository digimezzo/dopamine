import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Scheduler } from '../../../../common/scheduling/scheduler';
import { StringUtils } from '../../../../common/utils/string-utils';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { ArtistInformation } from '../../../../services/artist-information/artist-information';
import { PlaybackStarted } from '../../../../services/playback/playback-started';
import { TrackModel } from '../../../../services/track/track-model';
import { PlaybackServiceBase } from '../../../../services/playback/playback.service.base';
import { ArtistInformationServiceBase } from '../../../../services/artist-information/artist-information.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';

@Component({
    selector: 'app-now-playing-artist-info',
    host: { style: 'display: block' },
    templateUrl: './now-playing-artist-info.component.html',
    styleUrls: ['./now-playing-artist-info.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('contentAnimation', [
            state('fade-out', style({ opacity: 0 })),
            state('fade-in', style({ opacity: 1 })),
            transition('fade-in => fade-out', animate('150ms ease-out')),
            transition('fade-out => fade-in', animate('500ms ease-out')),
        ]),
    ],
})
export class NowPlayingArtistInfoComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();
    private previousArtistName: string = '';
    private _artist: ArtistInformation = ArtistInformation.empty();
    private _contentAnimation: string = 'fade-out';

    public constructor(
        private playbackService: PlaybackServiceBase,
        private artistInformationService: ArtistInformationServiceBase,
        private scheduler: Scheduler,
        public settings: SettingsBase,
    ) {}

    public get artist(): ArtistInformation {
        return this._artist;
    }

    public get contentAnimation(): string {
        return this._contentAnimation;
    }

    public async ngOnInit(): Promise<void> {
        this.initializeSubscriptions();
        await this.showArtistInfoAsync(this.playbackService.currentTrack);
    }

    public ngOnDestroy(): void {
        this.destroySubscriptions();
    }

    private initializeSubscriptions(): void {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) =>
                PromiseUtils.noAwait(this.showArtistInfoAsync(playbackStarted.currentTrack)),
            ),
        );
    }

    private destroySubscriptions(): void {
        this.subscription.unsubscribe();
    }

    private async showArtistInfoAsync(track: TrackModel | undefined): Promise<void> {
        if (track == undefined) {
            if (this._contentAnimation !== 'fade-out') {
                this._contentAnimation = 'fade-out';
                await this.scheduler.sleepAsync(150);
            }
            this._artist = ArtistInformation.empty();
            return;
        }

        if (this.previousArtistName === track.rawFirstArtist) {
            return;
        }

        this.previousArtistName = track.rawFirstArtist;

        if (this._contentAnimation !== 'fade-out') {
            this._contentAnimation = 'fade-out';
            await this.scheduler.sleepAsync(150);
        }

        this._artist = await this.artistInformationService.getArtistInformationAsync(track);

        if (StringUtils.isNullOrWhiteSpace(this.artist.imageUrl)) {
            // Makes sure that the content is shown when there is no image
            this._contentAnimation = 'fade-in';
            await this.scheduler.sleepAsync(250);
        }
    }

    public async imageIsLoadedAsync(): Promise<void> {
        this._contentAnimation = 'fade-in';
        await this.scheduler.sleepAsync(250);
    }
}
