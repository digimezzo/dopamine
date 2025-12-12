import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Logger } from '../../common/logger';
import { MathExtensions } from '../../common/math-extensions';
import { AlbumModel } from '../album/album-model';
import { ArtistModel } from '../artist/artist-model';
import { ArtistType } from '../artist/artist-type';
import { GenreModel } from '../genre/genre-model';
import { PlaylistModel } from '../playlist/playlist-model';
import { TrackModel } from '../track/track-model';
import { TrackModels } from '../track/track-models';
import { LoopMode } from './loop-mode';
import { PlaybackProgress } from './playback-progress';
import { PlaybackStarted } from './playback-started';
import { Queue } from './queue';
import { TrackServiceBase } from '../track/track.service.base';
import { PlaylistServiceBase } from '../playlist/playlist.service.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { NotificationServiceBase } from '../notification/notification.service.base';
import { TrackSorter } from '../../common/sorting/track-sorter';
import { QueuePersister } from './queue-persister';
import { QueueRestoreInfo } from './queue-restore-info';
import { AudioPlayerFactory } from './audio-player/audio-player.factory';
import { IAudioPlayer } from './audio-player/i-audio-player';
import { MediaSessionService } from '../media-session/media-session.service';
import { Track } from '../../data/entities/track';
import { FileFormats } from '../../common/application/file-formats';
import { DialogServiceBase } from '../dialog/dialog.service.base';
import { FileAccessBase } from '../../common/io/file-access.base';

@Injectable({ providedIn: 'root' })
export class PlaybackService {
    private progressChanged: Subject<PlaybackProgress> = new Subject();
    private playbackStarted: Subject<PlaybackStarted> = new Subject();
    private playbackPaused: Subject<void> = new Subject();
    private playbackResumed: Subject<void> = new Subject();
    private playbackStopped: Subject<void> = new Subject();
    private playbackSkipped: Subject<void> = new Subject();
    private _progress: PlaybackProgress = new PlaybackProgress(0, 0);
    private _volume: number = 0;
    private _loopMode: LoopMode = LoopMode.None;
    private _isShuffled: boolean = false;
    private _isPlaying: boolean = false;
    private _canPause: boolean = false;
    private _canResume: boolean = true;
    private _volumeBeforeMute: number = 0;
    private _shouldReportProgress: boolean = false;
    private _progressInterval: number = 0;
    private subscription: Subscription = new Subscription();
    private _audioPlayer: IAudioPlayer;
    private _preloadTimeoutId: NodeJS.Timeout | number | undefined;

    public constructor(
        private audioPlayerFactory: AudioPlayerFactory,
        private trackService: TrackServiceBase,
        private playlistService: PlaylistServiceBase,
        private notificationService: NotificationServiceBase,
        private dialogService: DialogServiceBase,
        private mediaSessionService: MediaSessionService,
        private queuePersister: QueuePersister,
        private fileAccess: FileAccessBase,
        private trackSorter: TrackSorter,
        private queue: Queue,
        private mathExtensions: MathExtensions,
        private settings: SettingsBase,
        private logger: Logger,
    ) {
        this._audioPlayer = this.audioPlayerFactory.create();
        this.initializeSubscriptions();
        this.applyVolumeFromSettings();
    }

    public get playbackQueue(): TrackModels {
        const trackModels: TrackModels = new TrackModels();

        if (this.queue.tracks != undefined) {
            // Add tracks to playback queue in playback order so that the user can see what is coming next in the queue
            for (const track of this.queue.tracksInPlaybackOrder) {
                trackModels.addTrack(track);
            }
        }

        return trackModels;
    }

    public get audioPlayer(): IAudioPlayer {
        return this._audioPlayer;
    }

    public get volume(): number {
        return this._volume;
    }

    public set volume(v: number) {
        this.applyVolume(v);
    }

    public get progress(): PlaybackProgress {
        return this._progress;
    }

    public get loopMode(): LoopMode {
        return this._loopMode;
    }

    public get isPlaying(): boolean {
        return this._isPlaying;
    }

    public get isShuffled(): boolean {
        return this._isShuffled;
    }

    public get canPause(): boolean {
        return this._canPause;
    }

    public get canResume(): boolean {
        return this._canResume;
    }

    public currentTrack: TrackModel | undefined;

    public progressChanged$: Observable<PlaybackProgress> = this.progressChanged.asObservable();
    public playbackStarted$: Observable<PlaybackStarted> = this.playbackStarted.asObservable();
    public playbackPaused$: Observable<void> = this.playbackPaused.asObservable();
    public playbackResumed$: Observable<void> = this.playbackResumed.asObservable();
    public playbackStopped$: Observable<void> = this.playbackStopped.asObservable();
    public playbackSkipped$: Observable<void> = this.playbackSkipped.asObservable();

    public async enqueueAndPlayTracksAsync(tracksToEnqueue: TrackModel[]): Promise<void> {
        if (tracksToEnqueue.length === 0) {
            return;
        }

        this.queue.setTracks(tracksToEnqueue, this.isShuffled);

        // Play first track in queue (will be a random track if queue is shuffled)
        const firstTrack: TrackModel | undefined = this.queue.getFirstTrack();

        if (firstTrack != undefined) {
            await this.stopAndPlayAsync(firstTrack, false);
        }
    }

    public async enqueueAndPlayTracksStartingFromGivenTrackAsync(tracksToEnqueue: TrackModel[], trackToPlay: TrackModel): Promise<void> {
        if (tracksToEnqueue.length === 0) {
            return;
        }

        if (trackToPlay == undefined) {
            return;
        }

        const enqueuedTracks: TrackModel[] = this.queue.setTracks(tracksToEnqueue, this.isShuffled);
        const enqueuedTrackToPlay: TrackModel = enqueuedTracks.filter((x) => x.path === trackToPlay.path)[0];
        await this.stopAndPlayAsync(enqueuedTrackToPlay, false);
    }

    public async enqueueAndPlayArtistAsync(artistToPlay: ArtistModel, artistType: ArtistType): Promise<void> {
        const tracksForArtists: TrackModels = this.trackService.getTracksForArtists([artistToPlay], artistType);
        const orderedTracks: TrackModel[] = this.trackSorter.sortByAlbum(tracksForArtists.tracks);
        await this.enqueueAndPlayTracksAsync(orderedTracks);
    }

    public async enqueueAndPlayGenreAsync(genreToPlay: GenreModel): Promise<void> {
        const tracksForGenre: TrackModels = this.trackService.getTracksForGenres([genreToPlay.name]);
        const orderedTracks: TrackModel[] = this.trackSorter.sortByAlbum(tracksForGenre.tracks);
        await this.enqueueAndPlayTracksAsync(orderedTracks);
    }

    public async enqueueAndPlayAlbumAsync(albumToPlay: AlbumModel): Promise<void> {
        const tracksForAlbum: TrackModels = this.trackService.getTracksForAlbums([albumToPlay.albumKey]);
        const orderedTracks: TrackModel[] = this.trackSorter.sortByAlbum(tracksForAlbum.tracks);
        await this.enqueueAndPlayTracksAsync(orderedTracks);
    }

    public async enqueueAndPlayPlaylistAsync(playlistToPlay: PlaylistModel): Promise<void> {
        const tracksForPlaylist: TrackModels = await this.playlistService.getTracksAsync([playlistToPlay]);
        await this.enqueueAndPlayTracksAsync(tracksForPlaylist.tracks);
    }

    public async addTracksToQueueAsync(tracksToAdd: TrackModel[]): Promise<void> {
        if (tracksToAdd.length === 0) {
            return;
        }

        this.queue.addTracks(tracksToAdd);
        await this.notifyOfTracksAddedToPlaybackQueueAsync(tracksToAdd.length);
    }

    public async addArtistToQueueAsync(artistToAdd: ArtistModel, artistType: ArtistType): Promise<void> {
        const tracksForArtists: TrackModels = this.trackService.getTracksForArtists([artistToAdd], artistType);
        const orderedTracks: TrackModel[] = this.trackSorter.sortByAlbum(tracksForArtists.tracks);
        await this.addTracksToQueueAsync(orderedTracks);
    }

    public async addGenreToQueueAsync(genreToAdd: GenreModel): Promise<void> {
        if (genreToAdd == undefined) {
            return;
        }

        const tracksForGenre: TrackModels = this.trackService.getTracksForGenres([genreToAdd.name]);
        const orderedTracks: TrackModel[] = this.trackSorter.sortByAlbum(tracksForGenre.tracks);
        await this.addTracksToQueueAsync(orderedTracks);
    }

    public async addAlbumToQueueAsync(albumToAdd: AlbumModel): Promise<void> {
        const tracksForAlbum: TrackModels = this.trackService.getTracksForAlbums([albumToAdd.albumKey]);
        const orderedTracks: TrackModel[] = this.trackSorter.sortByAlbum(tracksForAlbum.tracks);
        await this.addTracksToQueueAsync(orderedTracks);
    }

    public async addPlaylistToQueueAsync(playlistToAdd: PlaylistModel): Promise<void> {
        if (playlistToAdd == undefined) {
            return;
        }

        const tracksForPlaylist: TrackModels = await this.playlistService.getTracksAsync([playlistToAdd]);
        await this.addTracksToQueueAsync(tracksForPlaylist.tracks);
    }

    public removeFromQueue(tracksToRemove: TrackModel[]): void {
        if (tracksToRemove.length === 0) {
            return;
        }

        this.queue.removeTracks(tracksToRemove);
    }

    public async playQueuedTrackAsync(trackToPlay: TrackModel): Promise<void> {
        await this.stopAndPlayAsync(trackToPlay, false);
    }

    public toggleLoopMode(): void {
        const oldLoopMode: LoopMode = this._loopMode;

        if (this._loopMode === LoopMode.None) {
            this._loopMode = LoopMode.All;
            this.settings.playbackControlsLoop = 2;
        } else if (this._loopMode === LoopMode.All) {
            this._loopMode = LoopMode.One;
            this.settings.playbackControlsLoop = 1;
        } else {
            this._loopMode = LoopMode.None;
            this.settings.playbackControlsLoop = 0;
        }

        this.logger.info(`Toggled loopMode from ${oldLoopMode} to ${this._loopMode}`, 'PlaybackService', 'toggleLoopMode');
    }

    public toggleIsShuffled(): void {
        this._isShuffled = !this._isShuffled;

        if (this._isShuffled) {
            this.queue.shuffle();
            this.settings.playbackControlsShuffle = 1;
        } else {
            this.queue.unShuffle();
            this.settings.playbackControlsShuffle = 0;
        }

        this.logger.info(`Toggled isShuffled from ${!this._isShuffled} to ${this._isShuffled}`, 'PlaybackService', 'toggleIsShuffled');
    }

    public forceShuffled(): void {
        this._isShuffled = true;
        this.queue.shuffle();

        this.logger.info(`Forced isShuffled`, 'PlaybackService', 'forceShuffled');
    }

    public pause(): void {
        this.audioPlayer.pause();
        this.postPause();
    }

    private postPause() {
        this._canPause = false;
        this._canResume = true;
        this.pauseUpdatingProgress();
        this.playbackPaused.next();

        if (this.currentTrack != undefined) {
            this.logger.info(`Pausing '${this.currentTrack.path}'`, 'PlaybackService', 'pause');
        }
    }

    public async resumeAsync(): Promise<void> {
        if (!this.isPlaying) {
            const firstTrack: TrackModel | undefined = this.queue.getFirstTrack();

            if (firstTrack != undefined) {
                await this.stopAndPlayAsync(this.queue.getFirstTrack()!, false);
                return;
            }

            return;
        }

        await this.audioPlayer.resumeAsync();

        this._canPause = true;
        this._canResume = false;
        this.startUpdatingProgress();
        this.playbackResumed.next();

        if (this.currentTrack != undefined) {
            this.logger.info(`Resuming '${this.currentTrack.path}'`, 'PlaybackService', 'resume');
        }
    }

    public async playPreviousAsync(): Promise<void> {
        let trackToPlay: TrackModel | undefined;

        if (this.currentTrack != undefined && this.audioPlayer.progressSeconds > 3) {
            trackToPlay = this.currentTrack;
        } else {
            const allowWrapAround: boolean = this.loopMode === LoopMode.All;
            trackToPlay = this.queue.getPreviousTrack(this.currentTrack, allowWrapAround);
        }

        if (trackToPlay != undefined) {
            await this.stopAndPlayAsync(trackToPlay, true);

            return;
        }

        this.stop();
    }

    public async playNextAsync(): Promise<void> {
        this.increaseCountersForCurrentTrackBasedOnProgress();

        const allowWrapAround: boolean = this.loopMode === LoopMode.All;
        const trackToPlay: TrackModel | undefined = this.queue.getNextTrack(this.currentTrack, allowWrapAround);

        if (trackToPlay != undefined) {
            await this.stopAndPlayAsync(trackToPlay, false);

            return;
        }

        this.stop();
    }

    public async skipByFractionOfTotalSecondsAsync(fractionOfTotalSeconds: number): Promise<void> {
        const seconds: number = fractionOfTotalSeconds * this.audioPlayer.totalSeconds;
        await this.audioPlayer.skipToSecondsAsync(seconds);
        this._progress = this.getCurrentProgress();
        this.playbackSkipped.next();
    }

    private async skipToSecondsAsync(seconds: number): Promise<void> {
        await this.audioPlayer.skipToSecondsAsync(seconds);
        this._progress = this.getCurrentProgress();
        this.playbackSkipped.next();
    }

    public async togglePlaybackAsync(): Promise<void> {
        if (this.canPause) {
            this.pause();
        } else {
            await this.resumeAsync();
        }
    }

    public async stopIfPlayingAsync(track: TrackModel): Promise<void> {
        if (this.currentTrack != undefined && this.currentTrack.path === track.path) {
            if (this.queue.numberOfTracks === 1) {
                this.stop();
            } else {
                await this.playNextAsync();
            }
        }
    }

    public toggleMute(): void {
        if (this._volume === 0) {
            this.applyVolume(this._volumeBeforeMute > 0 ? this._volumeBeforeMute : 0.5);
        } else {
            this._volumeBeforeMute = this._volume;
            this.applyVolume(0);
        }
    }

    private async stopAndPlayAsync(trackToPlay: TrackModel, isPlayingPreviousTrack: boolean): Promise<void> {
        this.audioPlayer.stop();
        this.logger.info(`Stopping '${this.currentTrack?.path ?? ''}'`, 'PlaybackService', 'stopAndPlay');

        await this.playAsync(trackToPlay, isPlayingPreviousTrack);
    }

    private async playAsync(trackToPlay: TrackModel, isPlayingPreviousTrack: boolean): Promise<void> {
        await this.audioPlayer.playAsync(trackToPlay);
        this.postPlay(trackToPlay, isPlayingPreviousTrack);
    }

    private postPlay(trackToPlay: TrackModel, isPlayingPreviousTrack: boolean): void {
        this.currentTrack = trackToPlay;
        this._isPlaying = true;
        this._canPause = true;
        this._canResume = false;

        this.mediaSessionService.setMetadataAsync(trackToPlay);

        this.startUpdatingProgress();
        this.playbackStarted.next(new PlaybackStarted(trackToPlay, isPlayingPreviousTrack));

        this.logger.info(`Playing '${this.currentTrack.path}'`, 'PlaybackService', 'play');

        this.preloadNextTrackAfterDelay();
    }

    private preloadNextTrackAfterDelay(): void {
        const nextTrack: TrackModel | undefined = this.queue.getNextTrack(this.currentTrack, this.loopMode === LoopMode.All);

        if (nextTrack) {
            if (this._preloadTimeoutId) {
                clearTimeout(this._preloadTimeoutId);
            }
            this._preloadTimeoutId = setTimeout(() => {
                if (this.currentTrack === undefined) {
                    return;
                }
                this._audioPlayer.preloadNext(nextTrack);
                this.logger.info(`Preloaded '${nextTrack.path}'`, 'PlaybackService', 'preloadNextTrackAfterDelay');
            }, 2000);
        }
    }

    private stop(): void {
        this.audioPlayer.stop();
        this._isPlaying = false;
        this._canPause = false;
        this._canResume = true;
        this.stopUpdatingProgress();

        if (this.currentTrack != undefined) {
            this.logger.info(`Stopping '${this.currentTrack.path}'`, 'PlaybackService', 'stop');
        }

        this.currentTrack = undefined;
        this.playbackStopped.next();
    }

    private async playbackFinishedHandlerAsync(): Promise<void> {
        if (this.currentTrack != undefined) {
            this.logger.info(`Track finished: '${this.currentTrack.path}'`, 'PlaybackService', 'playbackFinishedHandler');
        }

        this.increasePlayCountAndDateLastPlayedForCurrentTrack();

        if (this.loopMode === LoopMode.One) {
            if (this.currentTrack != undefined) {
                await this.playAsync(this.currentTrack, false);
            }

            return;
        }

        const allowWrapAround: boolean = this.loopMode === LoopMode.All;
        const trackToPlay: TrackModel | undefined = this.queue.getNextTrack(this.currentTrack, allowWrapAround);

        if (trackToPlay != undefined) {
            await this.playAsync(trackToPlay, false);

            return;
        }

        this.stop();
    }

    private async playbackFailedHandlerAsync(audioFilePath: string): Promise<void> {
        const extension: string = this.fileAccess.getFileExtension(audioFilePath);

        if (extension === FileFormats.m4a) {
            await this.dialogService.cannotPlayM4aFileAsync();
        } else {
            await this.dialogService.cannotPlayAudioFileAsync();
        }

        this.stop();
    }

    private playingPreloadedTrackHandler(preloadedTrack: TrackModel): void {
        this.increasePlayCountAndDateLastPlayedForCurrentTrack();

        this.postPlay(preloadedTrack, false);
    }

    private increaseCountersForCurrentTrackBasedOnProgress(): void {
        if (this.progress == undefined) {
            this.logger.warn('Progress was undefined', 'PlaybackService', 'increaseCountersForCurrentTrackBasedOnProgress');

            return;
        }

        if (this.progress.progressPercent <= 80) {
            this.increaseSkipCountForCurrentTrack();
        } else {
            this.increasePlayCountAndDateLastPlayedForCurrentTrack();
        }
    }

    private increasePlayCountAndDateLastPlayedForCurrentTrack(): void {
        if (this.currentTrack == undefined) {
            this.logger.warn('CurrentTrack is undefined', 'PlaybackService', 'increasePlayCountAndDateLastPlayedForCurrentTrack');

            return;
        }

        this.currentTrack.increasePlayCountAndDateLastPlayed();
        this.trackService.savePlayCountAndDateLastPlayed(this.currentTrack);
    }

    private increaseSkipCountForCurrentTrack(): void {
        if (this.currentTrack == undefined) {
            this.logger.warn('CurrentTrack is undefined', 'PlaybackService', 'increaseSkipCountForCurrentTrack');

            return;
        }

        this.currentTrack.increaseSkipCount();
        this.trackService.saveSkipCount(this.currentTrack);
    }

    private initializeSubscriptions(): void {
        this.subscription.add(
            this.audioPlayer.playbackFinished$.subscribe(() => {
                void this.playbackFinishedHandlerAsync();
            }),
        );

        this.subscription.add(
            this.audioPlayer.playbackFailed$.subscribe((audioFilePath: string) => {
                void this.playbackFailedHandlerAsync(audioFilePath);
            }),
        );
        this.subscription.add(
            this.audioPlayer.playingPreloadedTrack$.subscribe((preloadedTrack: TrackModel) => {
                this.playingPreloadedTrackHandler(preloadedTrack);
            }),
        );

        this.subscription.add(
            this.mediaSessionService.playEvent$.subscribe(() => {
                void this.togglePlaybackAsync();
            }),
        );

        this.subscription.add(
            this.mediaSessionService.pauseEvent$.subscribe(() => {
                void this.togglePlaybackAsync();
            }),
        );

        this.subscription.add(
            this.mediaSessionService.previousTrackEvent$.subscribe(() => {
                void this.playPreviousAsync();
            }),
        );

        this.subscription.add(
            this.mediaSessionService.nextTrackEvent$.subscribe(() => {
                void this.playNextAsync();
            }),
        );
    }

    private applyVolumeFromSettings(): void {
        this._volume = this.settings.volume;
        this.audioPlayer.setVolume(this._volume);
    }

    private applyVolume(volume: number): void {
        const volumeToSet: number = this.mathExtensions.clamp(volume, 0, 1);
        this._volume = volumeToSet;
        this.settings.volume = volumeToSet;
        this.audioPlayer.setVolume(volumeToSet);
    }

    private async notifyOfTracksAddedToPlaybackQueueAsync(numberOfAddedTracks: number): Promise<void> {
        if (numberOfAddedTracks === 1) {
            await this.notificationService.singleTrackAddedToPlaybackQueueAsync();
        } else {
            await this.notificationService.multipleTracksAddedToPlaybackQueueAsync(numberOfAddedTracks);
        }
    }

    public async RestoreQueueIfNeededAsync(restorePlaybackProgress: boolean): Promise<void> {
        if (this.settings.rememberPlaybackStateAfterRestart) {
            if (this.settings.playbackControlsLoop !== 0) {
                this._loopMode = this.settings.playbackControlsLoop === 1 ? LoopMode.One : LoopMode.All;
            }

            if (this.settings.playbackControlsShuffle === 1) {
                this._isShuffled = true;
            }

            await this.restoreQueueAsync(restorePlaybackProgress);
        }
    }

    public saveQueue(): void {
        if (this.settings.rememberPlaybackStateAfterRestart) {
            this.queuePersister.save(this.queue, this.currentTrack, this.progress.progressSeconds);
        }
    }

    private async startPausedAsync(track: TrackModel, skipSeconds: number): Promise<void> {
        this.logger.info(`Starting playback paused for track: ${track.path} at ${skipSeconds} seconds`, 'PlaybackService', 'startPaused');
        await this.audioPlayer.startPausedAsync(track, skipSeconds);
        this.postPlay(track, false);
        this.postPause();
        this.startUpdatingProgress();
    }

    private async restoreQueueAsync(restorePlaybackProgress: boolean): Promise<void> {
        // If already playing (e.g. from double-clicking files), do not restore queue.
        if (this.currentTrack) {
            this.logger.info('Playback already in progress, not restoring playback queue', 'PlaybackService', 'restoreQueue');
            return;
        }

        this.logger.info('Restoring playback queue', 'PlaybackService', 'restoreQueue');

        const info: QueueRestoreInfo = this.queuePersister.restore();
        this.queue.restoreTracks(info.tracks, info.playbackOrder);
        this.logger.info(`Restored ${info.tracks.length} tracks to playback queue`, 'PlaybackService', 'restoreQueue');

        if (restorePlaybackProgress && info.playingTrack) {
            this.logger.info(
                `Restoring playback to track: ${info.playingTrack.path} at ${info.progressSeconds} seconds`,
                'PlaybackService',
                'restoreQueue',
            );
            await this.startPausedAsync(info.playingTrack, info.progressSeconds);
        }
    }

    public getCurrentProgress(): PlaybackProgress {
        return new PlaybackProgress(this.audioPlayer.progressSeconds, this.audioPlayer.totalSeconds);
    }

    private reportProgress(): void {
        if (this._shouldReportProgress) {
            this._progress = this.getCurrentProgress();
            this.progressChanged.next(this._progress);
        }
    }

    private startUpdatingProgress(): void {
        this._shouldReportProgress = true;
        this.reportProgress();

        if (this._progressInterval === 0) {
            this._progressInterval = window.setInterval(() => {
                this.reportProgress();
            }, 500);
        }
    }

    public stopUpdatingProgress(): void {
        this.pauseUpdatingProgress();
        this._progress = new PlaybackProgress(0, 0);
        this.progressChanged.next(this._progress);
    }

    public pauseUpdatingProgress(): void {
        this._shouldReportProgress = false;
    }

    public updateQueueTracks(tracks: Track[]): void {
        const tracksInQueue: TrackModel[] = this.queue.tracks.filter((qt) => tracks.map((t) => t.path).includes(qt.path));

        for (const trackInQueue of tracksInQueue) {
            const trackToSet = tracks.find((t) => t.path === trackInQueue.path);

            if (trackToSet) {
                trackInQueue.setTrack(trackToSet);

                if (this.currentTrack && this.currentTrack.path === trackInQueue.path) {
                    this.currentTrack = trackInQueue;
                    // this.playbackStarted.next(new PlaybackStarted(trackInQueue, false));
                }
            }
        }
    }
}
