import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Guards } from '../../../common/guards';
import { BaseSettings } from '../../../common/settings/base-settings';
import { Strings } from '../../../common/strings';
import { ArtistInformation } from '../../../services/artist-information/artist-information';
import { BaseArtistInformationService } from '../../../services/artist-information/base-artist-information.service';
import { BasePlaybackService } from '../../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../../services/playback/playback-started';
import { TrackModel } from '../../../services/track/track-model';

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
    private _contentAnimation: string = 'fade-in';

    public constructor(
        private playbackService: BasePlaybackService,
        private artistInformationService: BaseArtistInformationService,
        public settings: BaseSettings
    ) {}

    public get artist(): ArtistInformation {
        return this._artist;
    }

    public get contentAnimation(): string {
        return this._contentAnimation;
    }

    public ngOnInit(): void {
        this.initializeSubscriptions();
        this.showArtistInfoAsync(this.playbackService.currentTrack);
    }

    public ngOnDestroy(): void {
        this.destroySubscriptions();
    }

    private initializeSubscriptions(): void {
        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe(
                async (playbackStarted: PlaybackStarted) => await this.showArtistInfoAsync(playbackStarted.currentTrack)
            )
        );
    }

    private destroySubscriptions(): void {
        this.subscription.unsubscribe();
    }

    private async showArtistInfoAsync(track: TrackModel | undefined): Promise<void> {
        if (!Guards.isDefined(track)) {
            this._artist = ArtistInformation.empty();

            return;
        }

        if (this.previousArtistName === track!.rawFirstArtist) {
            return;
        }

        this.previousArtistName = track!.rawFirstArtist;

        this._contentAnimation = 'fade-out';
        this._artist = await this.artistInformationService.getArtistInformationAsync(track!);

        if (Strings.isNullOrWhiteSpace(this.artist.imageUrl)) {
            // Makes sure that the content is shown when there is no image
            this._contentAnimation = 'fade-in';
        }
    }

    public imageIsLoaded(): void {
        this._contentAnimation = 'fade-in';
    }
}
