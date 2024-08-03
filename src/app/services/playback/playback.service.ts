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
import { ProgressUpdater } from './progress-updater';
import { Queue } from './queue';
import { PlaybackServiceBase } from './playback.service.base';
import { TrackServiceBase } from '../track/track.service.base';
import { PlaylistServiceBase } from '../playlist/playlist.service.base';
import { AudioPlayerBase } from './audio-player.base';
import { SettingsBase } from '../../common/settings/settings.base';
import { NotificationServiceBase } from '../notification/notification.service.base';
import { TrackSorter } from '../../common/sorting/track-sorter';
import { QueuePersister } from './queue-persister';

@Injectable()
export class PlaybackService implements PlaybackServiceBase {
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
    private subscription: Subscription = new Subscription();

    public constructor(
        private trackService: TrackServiceBase,
        private playlistService: PlaylistServiceBase,
        private notificationService: NotificationServiceBase,
        private queuePersister: QueuePersister,
        private _audioPlayer: AudioPlayerBase,
        private trackSorter: TrackSorter,
        private queue: Queue,
        private progressUpdater: ProgressUpdater,
        private mathExtensions: MathExtensions,
        private settings: SettingsBase,
        private logger: Logger,
    ) {
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

    public get hasPlaybackQueue(): boolean {
        return this.queue.tracks != undefined && this.queue.tracks.length > 0;
    }

    public get audioPlayer(): AudioPlayerBase {
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

    public enqueueAndPlayTracks(tracksToEnqueue: TrackModel[]): void {
        if (tracksToEnqueue.length === 0) {
            return;
        }

        this.queue.setTracks(tracksToEnqueue, this.isShuffled);

        // Play first track in queue (will be a random track if queue is shuffled)
        const firstTrack: TrackModel | undefined = this.queue.getFirstTrack();

        if (firstTrack != undefined) {
            this.play(firstTrack, false);
        }
    }

    public enqueueAndPlayTracksStartingFromGivenTrack(tracksToEnqueue: TrackModel[], trackToPlay: TrackModel): void {
        if (tracksToEnqueue.length === 0) {
            return;
        }

        if (trackToPlay == undefined) {
            return;
        }

        const enqueuedTracks: TrackModel[] = this.queue.setTracks(tracksToEnqueue, this.isShuffled);
        const enqueuedTrackToPlay: TrackModel = enqueuedTracks.filter((x) => x.path === trackToPlay.path)[0];
        this.play(enqueuedTrackToPlay, false);
    }

    public enqueueAndPlayArtist(artistToPlay: ArtistModel, artistType: ArtistType): void {
        const tracksForArtists: TrackModels = this.trackService.getTracksForArtists([artistToPlay.displayName], artistType);
        const orderedTracks: TrackModel[] = this.trackSorter.sortByAlbum(tracksForArtists.tracks);
        this.enqueueAndPlayTracks(orderedTracks);
    }

    public enqueueAndPlayGenre(genreToPlay: GenreModel): void {
        const tracksForGenre: TrackModels = this.trackService.getTracksForGenres([genreToPlay.displayName]);
        const orderedTracks: TrackModel[] = this.trackSorter.sortByAlbum(tracksForGenre.tracks);
        this.enqueueAndPlayTracks(orderedTracks);
    }

    public enqueueAndPlayAlbum(albumToPlay: AlbumModel): void {
        const tracksForAlbum: TrackModels = this.trackService.getTracksForAlbums([albumToPlay.albumKey]);
        const orderedTracks: TrackModel[] = this.trackSorter.sortByAlbum(tracksForAlbum.tracks);
        this.enqueueAndPlayTracks(orderedTracks);
    }

    public async enqueueAndPlayPlaylistAsync(playlistToPlay: PlaylistModel): Promise<void> {
        const tracksForPlaylist: TrackModels = await this.playlistService.getTracksAsync([playlistToPlay]);
        this.enqueueAndPlayTracks(tracksForPlaylist.tracks);
    }

    public async addTracksToQueueAsync(tracksToAdd: TrackModel[]): Promise<void> {
        if (tracksToAdd.length === 0) {
            return;
        }

        this.queue.addTracks(tracksToAdd);
        await this.notifyOfTracksAddedToPlaybackQueueAsync(tracksToAdd.length);
    }

    public async addArtistToQueueAsync(artistToAdd: ArtistModel, artistType: ArtistType): Promise<void> {
        const tracksForArtists: TrackModels = this.trackService.getTracksForArtists([artistToAdd.displayName], artistType);
        const orderedTracks: TrackModel[] = this.trackSorter.sortByAlbum(tracksForArtists.tracks);
        await this.addTracksToQueueAsync(orderedTracks);
    }

    public async addGenreToQueueAsync(genreToAdd: GenreModel): Promise<void> {
        if (genreToAdd == undefined) {
            return;
        }

        const tracksForGenre: TrackModels = this.trackService.getTracksForGenres([genreToAdd.displayName]);
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

    public playQueuedTrack(trackToPlay: TrackModel): void {
        this.play(trackToPlay, false);
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
        this._canPause = false;
        this._canResume = true;
        this.progressUpdater.pauseUpdatingProgress();
        this.playbackPaused.next();

        if (this.currentTrack != undefined) {
            this.logger.info(`Pausing '${this.currentTrack.path}'`, 'PlaybackService', 'pause');
        }
    }

    public resume(): void {
        if (!this.isPlaying) {
            const firstTrack: TrackModel | undefined = this.queue.getFirstTrack();

            if (firstTrack != undefined) {
                this.play(this.queue.getFirstTrack()!, false);
                return;
            }

            return;
        }

        this.audioPlayer.resume();

        this._canPause = true;
        this._canResume = false;
        this.progressUpdater.startUpdatingProgress();
        this.playbackResumed.next();

        if (this.currentTrack != undefined) {
            this.logger.info(`Resuming '${this.currentTrack.path}'`, 'PlaybackService', 'resume');
        }
    }

    public playPrevious(): void {
        let trackToPlay: TrackModel | undefined;

        if (this.currentTrack != undefined && this.audioPlayer.progressSeconds > 3) {
            trackToPlay = this.currentTrack;
        } else {
            const allowWrapAround: boolean = this.loopMode === LoopMode.All;
            trackToPlay = this.queue.getPreviousTrack(this.currentTrack, allowWrapAround);
        }

        if (trackToPlay != undefined) {
            this.play(trackToPlay, true);

            return;
        }

        this.stop();
    }

    public playNext(): void {
        this.increaseCountersForCurrentTrackBasedOnProgress();

        const allowWrapAround: boolean = this.loopMode === LoopMode.All;
        const trackToPlay: TrackModel | undefined = this.queue.getNextTrack(this.currentTrack, allowWrapAround);

        if (trackToPlay != undefined) {
            this.play(trackToPlay, false);

            return;
        }

        this.stop();
    }

    public skipByFractionOfTotalSeconds(fractionOfTotalSeconds: number): void {
        const seconds: number = fractionOfTotalSeconds * this.audioPlayer.totalSeconds;
        this.audioPlayer.skipToSeconds(seconds);
        this._progress = this.progressUpdater.getCurrentProgress();
        this.playbackSkipped.next();
    }

    public togglePlayback(): void {
        if (this.canPause) {
            this.pause();
        } else {
            this.resume();
        }
    }

    public stopIfPlaying(track: TrackModel): void {
        if (this.currentTrack != undefined && this.currentTrack.path === track.path) {
            if (this.queue.numberOfTracks === 1) {
                this.stop();
            } else {
                this.playNext();
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

    private play(trackToPlay: TrackModel, isPlayingPreviousTrack: boolean): void {
        this.audioPlayer.stop();
        this.audioPlayer.play(trackToPlay.path);
        this.currentTrack = trackToPlay;
        this._isPlaying = true;
        this._canPause = true;
        this._canResume = false;
        this.progressUpdater.startUpdatingProgress();
        this.playbackStarted.next(new PlaybackStarted(trackToPlay, isPlayingPreviousTrack));

        this.logger.info(`Playing '${this.currentTrack.path}'`, 'PlaybackService', 'play');
    }

    private stop(): void {
        this.audioPlayer.stop();
        this._isPlaying = false;
        this._canPause = false;
        this._canResume = true;
        this.progressUpdater.stopUpdatingProgress();

        if (this.currentTrack != undefined) {
            this.logger.info(`Stopping '${this.currentTrack.path}'`, 'PlaybackService', 'stop');
        }

        this.currentTrack = undefined;
        this.playbackStopped.next();
    }

    private playbackFinishedHandler(): void {
        if (this.currentTrack != undefined) {
            this.logger.info(`Track finished: '${this.currentTrack.path}'`, 'PlaybackService', 'playbackFinishedHandler');
        }

        this.increasePlayCountAndDateLastPlayedForCurrentTrack();

        if (this.loopMode === LoopMode.One) {
            if (this.currentTrack != undefined) {
                this.play(this.currentTrack, false);
            }

            return;
        }

        const allowWrapAround: boolean = this.loopMode === LoopMode.All;
        const trackToPlay: TrackModel | undefined = this.queue.getNextTrack(this.currentTrack, allowWrapAround);

        if (trackToPlay != undefined) {
            this.play(trackToPlay, false);

            return;
        }

        this.stop();
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
                this.playbackFinishedHandler();
            }),
        );

        this.subscription.add(
            this.progressUpdater.progressChanged$.subscribe((playbackProgress: PlaybackProgress) => {
                this._progress = playbackProgress;
                this.progressChanged.next(playbackProgress);
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

    public initialize() {
        if (this.settings.rememberPlaybackControlsAfterRestart) {
            if (this.settings.playbackControlsLoop !== 0) {
                this._loopMode = this.settings.playbackControlsLoop === 1 ? LoopMode.One : LoopMode.All;
            }

            if (this.settings.playbackControlsShuffle === 1) {
                this._isShuffled = true;
            }
        }

        this.restoreQueue();
    }

    public async saveQueueAsync(): Promise<void> {}

    private restoreQueue(): void {}
}
