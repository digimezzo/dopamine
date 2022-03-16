import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Logger } from '../../common/logger';
import { MathExtensions } from '../../common/math-extensions';
import { TrackOrdering } from '../../common/ordering/track-ordering';
import { BaseSettings } from '../../common/settings/base-settings';
import { AlbumModel } from '../album/album-model';
import { ArtistModel } from '../artist/artist-model';
import { ArtistType } from '../artist/artist-type';
import { GenreModel } from '../genre/genre-model';
import { BasePlaylistService } from '../playlist/base-playlist.service';
import { PlaylistModel } from '../playlist/playlist-model';
import { BaseTrackService } from '../track/base-track.service';
import { TrackModel } from '../track/track-model';
import { TrackModels } from '../track/track-models';
import { BaseAudioPlayer } from './base-audio-player';
import { BasePlaybackService } from './base-playback.service';
import { LoopMode } from './loop-mode';
import { PlaybackProgress } from './playback-progress';
import { PlaybackStarted } from './playback-started';
import { ProgressUpdater } from './progress-updater';
import { Queue } from './queue';

@Injectable()
export class PlaybackService implements BasePlaybackService {
    constructor(
        private trackService: BaseTrackService,
        private playlistService: BasePlaylistService,
        private audioPlayer: BaseAudioPlayer,
        private trackOrdering: TrackOrdering,
        private queue: Queue,
        private progressUpdater: ProgressUpdater,
        private mathExtensions: MathExtensions,
        private settings: BaseSettings,
        private logger: Logger
    ) {
        this.initializeSubscriptions();
        this.applyVolumeFromSettings();
    }

    public get playbackQueue(): TrackModels {
        const trackModels: TrackModels = new TrackModels();

        if (this.queue.tracks != undefined) {
            for (const track of this.queue.tracks) {
                trackModels.addTrack(track);
            }
        }

        return trackModels;
    }

    public get volume(): number {
        return this._volume;
    }

    public set volume(v: number) {
        const volumeToSet: number = this.mathExtensions.clamp(v, 0, 1);
        this._volume = volumeToSet;
        this.settings.volume = volumeToSet;
        this.audioPlayer.setVolume(volumeToSet);
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
    private progressChanged: Subject<PlaybackProgress> = new Subject();
    private playbackStarted: Subject<PlaybackStarted> = new Subject();
    private playbackPaused: Subject<void> = new Subject();
    private playbackResumed: Subject<void> = new Subject();
    private playbackStopped: Subject<void> = new Subject();
    private _progress: PlaybackProgress = new PlaybackProgress(0, 0);
    private _volume: number = 0;
    private _loopMode: LoopMode = LoopMode.None;
    private _isShuffled: boolean = false;
    private _isPlaying: boolean = false;
    private _canPause: boolean = false;
    private _canResume: boolean = true;
    private subscription: Subscription = new Subscription();

    public currentTrack: TrackModel;

    public progressChanged$: Observable<PlaybackProgress> = this.progressChanged.asObservable();
    public playbackStarted$: Observable<PlaybackStarted> = this.playbackStarted.asObservable();
    public playbackPaused$: Observable<void> = this.playbackPaused.asObservable();
    public playbackResumed$: Observable<void> = this.playbackResumed.asObservable();
    public playbackStopped$: Observable<void> = this.playbackStopped.asObservable();

    public enqueueAndPlayTracks(tracksToEnqueue: TrackModel[], trackToPlay: TrackModel): void {
        if (tracksToEnqueue == undefined) {
            return;
        }

        if (tracksToEnqueue.length === 0) {
            return;
        }

        if (trackToPlay == undefined) {
            return;
        }

        this.queue.setTracks(tracksToEnqueue, this.isShuffled);
        this.play(trackToPlay, false);
    }

    public enqueueAndPlayArtist(artistToPlay: ArtistModel, artistType: ArtistType): void {
        if (artistToPlay == undefined) {
            return;
        }

        if (artistType == undefined) {
            return;
        }

        const tracksForArtists: TrackModels = this.trackService.getTracksForArtists([artistToPlay.displayName], artistType);
        const orderedTracks: TrackModel[] = this.trackOrdering.getTracksOrderedByAlbum(tracksForArtists.tracks);
        this.enqueueAndPlayTracks(orderedTracks, orderedTracks[0]);
    }

    public enqueueAndPlayGenre(genreToPlay: GenreModel): void {
        if (genreToPlay == undefined) {
            return;
        }

        const tracksForGenre: TrackModels = this.trackService.getTracksForGenres([genreToPlay.displayName]);
        const orderedTracks: TrackModel[] = this.trackOrdering.getTracksOrderedByAlbum(tracksForGenre.tracks);
        this.enqueueAndPlayTracks(orderedTracks, orderedTracks[0]);
    }

    public enqueueAndPlayAlbum(albumToPlay: AlbumModel): void {
        if (albumToPlay == undefined) {
            return;
        }

        const tracksForAlbum: TrackModels = this.trackService.getTracksForAlbums([albumToPlay.albumKey]);
        const orderedTracks: TrackModel[] = this.trackOrdering.getTracksOrderedByAlbum(tracksForAlbum.tracks);
        this.enqueueAndPlayTracks(orderedTracks, orderedTracks[0]);
    }

    public async enqueueAndPlayPlaylistAsync(playlistToPlay: PlaylistModel): Promise<void> {
        if (playlistToPlay == undefined) {
            return;
        }

        const tracksForPlaylist: TrackModels = await this.playlistService.getTracksAsync([playlistToPlay]);
        this.enqueueAndPlayTracks(tracksForPlaylist.tracks, tracksForPlaylist.tracks[0]);
    }

    public playQueuedTrack(trackToPlay: TrackModel): void {
        this.play(trackToPlay, false);
    }

    public toggleLoopMode(): void {
        const oldLoopMode: LoopMode = this._loopMode;

        if (this._loopMode === LoopMode.None) {
            this._loopMode = LoopMode.All;
        } else if (this._loopMode === LoopMode.All) {
            this._loopMode = LoopMode.One;
        } else if (this._loopMode === LoopMode.One) {
            this._loopMode = LoopMode.None;
        } else {
            this._loopMode = LoopMode.None;
        }

        this.logger.info(`Toggled loopMode from ${oldLoopMode} to ${this._loopMode}`, 'PlaybackService', 'toggleLoopMode');
    }

    public toggleIsShuffled(): void {
        this._isShuffled = !this._isShuffled;

        if (this._isShuffled) {
            this.queue.shuffle();
        } else {
            this.queue.unShuffle();
        }

        this.logger.info(`Toggled isShuffled from ${!this._isShuffled} to ${this._isShuffled}`, 'PlaybackService', 'toggleIsShuffled');
    }

    public pause(): void {
        this.audioPlayer.pause();
        this._canPause = false;
        this._canResume = true;
        this.progressUpdater.pauseUpdatingProgress();
        this.playbackPaused.next();

        this.logger.info(`Pausing '${this.currentTrack?.path}'`, 'PlaybackService', 'pause');
    }

    public resume(): void {
        if (!this.isPlaying) {
            return;
        }

        this.audioPlayer.resume();
        this._canPause = true;
        this._canResume = false;
        this.progressUpdater.startUpdatingProgress();
        this.playbackResumed.next();

        this.logger.info(`Resuming '${this.currentTrack?.path}'`, 'PlaybackService', 'resume');
    }

    public playPrevious(): void {
        let trackToPlay: TrackModel;

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
        const allowWrapAround: boolean = this.loopMode === LoopMode.All;
        const trackToPlay: TrackModel = this.queue.getNextTrack(this.currentTrack, allowWrapAround);

        if (trackToPlay != undefined) {
            this.play(trackToPlay, false);

            return;
        }

        this.stop();
    }

    public skipByFractionOfTotalSeconds(fractionOfTotalSeconds: number): void {
        const seconds: number = fractionOfTotalSeconds * this.audioPlayer.totalSeconds;
        this.audioPlayer.skipToSeconds(seconds);
    }

    public togglePlayback(): void {
        if (this.canPause) {
            this.pause();
        } else {
            this.resume();
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

        this.logger.info(`Playing '${this.currentTrack?.path}'`, 'PlaybackService', 'play');
    }

    private stop(): void {
        this.audioPlayer.stop();
        this._isPlaying = false;
        this._canPause = false;
        this._canResume = true;
        this.progressUpdater.stopUpdatingProgress();
        this.currentTrack = undefined;
        this.playbackStopped.next();

        this.logger.info(`Stopping '${this.currentTrack?.path}'`, 'PlaybackService', 'stop');
    }

    private playNextOnPlaybackFinished(): void {
        if (this.loopMode === LoopMode.One) {
            this.play(this.currentTrack, false);

            return;
        }

        const allowWrapAround: boolean = this.loopMode === LoopMode.All;
        const trackToPlay: TrackModel = this.queue.getNextTrack(this.currentTrack, allowWrapAround);

        if (trackToPlay != undefined) {
            this.play(trackToPlay, false);

            return;
        }

        this.stop();
    }

    private initializeSubscriptions(): void {
        this.subscription.add(
            this.audioPlayer.playbackFinished$.subscribe(() => {
                this.playNextOnPlaybackFinished();
            })
        );

        this.subscription.add(
            this.progressUpdater.progressChanged$.subscribe((playbackProgress: PlaybackProgress) => {
                this._progress = playbackProgress;
                this.progressChanged.next(playbackProgress);
            })
        );
    }

    private applyVolumeFromSettings(): void {
        this._volume = this.settings.volume;
        this.audioPlayer.setVolume(this._volume);
    }
}
