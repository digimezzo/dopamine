import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageProcessor } from '../../common/image-processor';
import { Logger } from '../../common/logger';
import { FileMetadata } from '../../common/metadata/file-metadata';
import { FileMetadataFactory } from '../../common/metadata/file-metadata-factory';
import { Scheduler } from '../../common/scheduler/scheduler';
import { AlbumArtworkGetter } from '../../services/indexing/album-artwork-getter';
import { BasePlaybackService } from '../../services/playback/base-playback.service';
import { PlaybackStarted } from '../../services/playback/playback-started';
import { TrackModel } from '../../services/track/track-model';

@Component({
    selector: 'app-playback-cover-art',
    host: { style: 'display: block' },
    templateUrl: './playback-cover-art.component.html',
    styleUrls: ['./playback-cover-art.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('contentAnimation', [
            state(
                'down',
                style({
                    transform: 'translateY(0px)',
                })
            ),
            state(
                'animated-down',
                style({
                    transform: 'translateY(0px)',
                })
            ),
            state(
                'up',
                style({
                    transform: 'translateY(-100%)',
                })
            ),
            state(
                'animated-up',
                style({
                    transform: 'translateY(-100%)',
                })
            ),
            transition('down => animated-up', animate('350ms ease-out')),
            transition('up => animated-down', animate('350ms ease-out')),
        ]),
    ],
})
export class PlaybackCoverArtComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();

    constructor(
        private playbackService: BasePlaybackService,
        private fileMetadataFactory: FileMetadataFactory,
        private albumArtworkGetter: AlbumArtworkGetter,
        private imageProcessor: ImageProcessor,
        private scheduler: Scheduler,
        private logger: Logger
    ) {}

    public contentAnimation: string = 'down';

    public topImageUrl: string = '';
    public bottomImageUrl: string = '';

    private currentImageUrl: string = '';

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public async ngOnInit(): Promise<void> {
        await this.switchDown(this.playbackService.currentTrack, false);

        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe(async (playbackStarted: PlaybackStarted) => {
                if (playbackStarted.isPlayingPreviousTrack) {
                    await this.switchDown(playbackStarted.currentTrack, true);
                } else {
                    await this.switchUp(playbackStarted.currentTrack);
                }
            })
        );
    }

    private async switchUp(track: TrackModel): Promise<void> {
        if (track == undefined) {
            return;
        }

        const newImage: string = await this.createImageUrlAsync(track);

        if (this.contentAnimation !== 'down') {
            this.topImageUrl = this.currentImageUrl;

            this.contentAnimation = 'down';
            await this.scheduler.sleepAsync(100);
        }

        this.bottomImageUrl = newImage;
        this.currentImageUrl = newImage;
        this.contentAnimation = 'animated-up';
        await this.scheduler.sleepAsync(350);
    }

    private async switchDown(track: TrackModel, performAnimation: boolean): Promise<void> {
        if (track == undefined) {
            return;
        }

        const newImage: string = await this.createImageUrlAsync(track);

        if (performAnimation) {
            if (this.contentAnimation !== 'up') {
                this.bottomImageUrl = this.currentImageUrl;

                this.contentAnimation = 'up';
                await this.scheduler.sleepAsync(100);
            }
        }

        this.topImageUrl = newImage;
        this.currentImageUrl = newImage;

        if (performAnimation) {
            this.contentAnimation = 'animated-down';
            await this.scheduler.sleepAsync(350);
        } else {
            this.contentAnimation = 'down';
        }
    }

    private async createImageUrlAsync(track: TrackModel): Promise<string> {
        try {
            const fileMetaData: FileMetadata = await this.fileMetadataFactory.createReadOnlyAsync(track.path);
            const coverArt: Buffer = await this.albumArtworkGetter.getAlbumArtworkAsync(fileMetaData, false);

            if (coverArt !== undefined) {
                return this.imageProcessor.convertBufferToImageUrl(coverArt);
            }
        } catch (error) {
            this.logger.error(
                `Could not create image URL for track with path=${track.path}`,
                'PlaybackCoverArtComponent',
                'createImageUrlAsync'
            );
        }

        return '';
    }
}
