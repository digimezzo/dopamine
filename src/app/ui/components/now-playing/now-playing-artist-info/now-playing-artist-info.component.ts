import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { ArtistInformation } from '../../../../services/artist-information/artist-information';
import { PlaybackStarted } from '../../../../services/playback/playback-started';
import { TrackModel } from '../../../../services/track/track-model';
import { PlaybackService } from '../../../../services/playback/playback.service';
import { ArtistInformationServiceBase } from '../../../../services/artist-information/artist-information.service.base';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { StringUtils } from '../../../../common/utils/string-utils';

@Component({
    selector: 'app-now-playing-artist-info',
    host: { style: 'display: block; width: 100%; height: 100%;' },
    templateUrl: './now-playing-artist-info.component.html',
    styleUrls: ['./now-playing-artist-info.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NowPlayingArtistInfoComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();
    private previousArtistName: string = '';
    private _artist: ArtistInformation = ArtistInformation.empty();
    private _isBusy: boolean = false;

    public constructor(
        private playbackService: PlaybackService,
        private artistInformationService: ArtistInformationServiceBase,
        public settings: SettingsBase,
    ) {}

    public get isBusy(): boolean {
        return this._isBusy;
    }

    public get artist(): ArtistInformation {
        return this._artist;
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
            this._artist = ArtistInformation.empty();
            return;
        }

        if (!StringUtils.isNullOrWhiteSpace(track.rawFirstArtist) && this.previousArtistName === track.rawFirstArtist) {
            return;
        }

        this.previousArtistName = track.rawFirstArtist;

        this._artist = this.artistInformationService.getQuickArtistInformation(track);

        this._isBusy = true;
        this._artist = await this.artistInformationService.getArtistInformationAsync(track);
        this._isBusy = false;
    }
}
