import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageProcessor } from '../../core/image-processor';
import { Logger } from '../../core/logger';
import { Scheduler } from '../../core/scheduler/scheduler';
import { FileMetadata } from '../../metadata/file-metadata';
import { FileMetadataFactory } from '../../metadata/file-metadata-factory';
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

    public topImageUrl: string;
    public bottomImageUrl: string;

    private currentImageUrl: string;

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public async ngOnInit(): Promise<void> {
        if (this.playbackService.currentTrack != undefined) {
            const newImage: string = await this.createImageUrlAsync(this.playbackService.currentTrack);

            if (this.contentAnimation !== 'down') {
                this.contentAnimation = 'down';
            }

            this.topImageUrl = newImage;
            this.currentImageUrl = newImage;
        }

        this.subscription.add(
            this.playbackService.playbackStarted$.subscribe(async (playbackStarted: PlaybackStarted) => {
                const newImage: string = await this.createImageUrlAsync(playbackStarted.currentTrack);

                if (playbackStarted.isPlayingPreviousTrack) {
                    if (this.contentAnimation !== 'up') {
                        this.contentAnimation = 'up';
                        this.bottomImageUrl = this.currentImageUrl;
                        await this.scheduler.sleepAsync(100);
                    }

                    this.topImageUrl = newImage;
                    this.contentAnimation = 'animated-down';
                } else {
                    if (this.contentAnimation !== 'down') {
                        this.contentAnimation = 'down';
                        this.topImageUrl = this.currentImageUrl;
                        await this.scheduler.sleepAsync(100);
                    }

                    this.bottomImageUrl = newImage;
                    this.contentAnimation = 'animated-up';
                }

                this.currentImageUrl = newImage;
                await this.scheduler.sleepAsync(350);
            })
        );
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

        return undefined;
    }
}
