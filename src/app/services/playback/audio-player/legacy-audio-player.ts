import { Observable, Subject } from 'rxjs';
import { Logger } from '../../../common/logger';
import { MathExtensions } from '../../../common/math-extensions';
import { PromiseUtils } from '../../../common/utils/promise-utils';
import { StringUtils } from '../../../common/utils/string-utils';
import { IAudioPlayer } from './i-audio-player';
import { AudioChangedEvent } from './audio-changed-event';
import { TrackModel } from '../../track/track-model';

export class LegacyAudioPlayer implements IAudioPlayer {
    private _audio: HTMLAudioElement;
    private _audioChanged: Subject<AudioChangedEvent> = new Subject();
    private _playbackFinished: Subject<void> = new Subject();
    private _playingPreloadedTrack: Subject<TrackModel> = new Subject();
    private _audioContext: AudioContext;
    private _analyser: AnalyserNode;
    private _isPaused: boolean = false;

    public constructor(
        private mathExtensions: MathExtensions,
        private logger: Logger,
    ) {
        this._audio = new Audio();
        this._audioContext = new AudioContext();

        this._analyser = this._audioContext.createAnalyser();
        this._analyser.fftSize = 128;

        this.connectVisualizer();

        try {
            // This fails during unit tests because setSinkId() does not exist on HTMLAudioElement
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this._audio.setSinkId('default');
        } catch (e: unknown) {
            // Suppress this error, but log it, in case it happens in production.
            this.logger.error(e, 'Could not perform setSinkId()', 'AudioPlayer', 'constructor');
        }

        this._audio.defaultPlaybackRate = 1;
        this._audio.playbackRate = 1;
        this._audio.volume = 1;
        this._audio.muted = false;
    }

    public audioChanged$: Observable<AudioChangedEvent> = this._audioChanged.asObservable();
    public playbackFinished$: Observable<void> = this._playbackFinished.asObservable();
    public playingPreloadedTrack$: Observable<TrackModel> = this._playingPreloadedTrack.asObservable();

    public get analyser(): AnalyserNode {
        return this._analyser;
    }

    public get isPaused(): boolean {
        return this._isPaused;
    }

    public get progressSeconds(): number {
        if (isNaN(this._audio.currentTime)) {
            return 0;
        }

        return this._audio.currentTime;
    }

    public get totalSeconds(): number {
        if (isNaN(this._audio.duration)) {
            return 0;
        }

        return this._audio.duration;
    }

    public play(track: TrackModel): void {
        const playableAudioFilePath: string = this.replaceUnplayableCharacters(track.path);

        // This is a workaround to fix flickering of OS media controls when switching track from the media controls
        const tempAudio: HTMLAudioElement = new Audio();
        tempAudio.volume = this._audio.volume;
        tempAudio.src = 'file:///' + playableAudioFilePath;
        tempAudio.muted = this._audio.muted;
        tempAudio.defaultPlaybackRate = this._audio.defaultPlaybackRate;
        tempAudio.playbackRate = this._audio.playbackRate;

        this._audio.onended = () => {};
        this._audio = tempAudio;

        this.connectVisualizer();

        this._audio.play();
        this._audio.onended = () => this._playbackFinished.next();

        this._audioChanged.next(new AudioChangedEvent(this._audio));
    }

    public startPaused(track: TrackModel, skipSeconds: number): void {
        this.play(track);
        this.pause();
        this.skipToSeconds(skipSeconds);
    }

    public stop(): void {
        this._audio.currentTime = 0;
        this._audio.pause();
    }

    public pause(): void {
        this._isPaused = true;
        this._audio.pause();
    }

    public resume(): void {
        PromiseUtils.noAwait(this._audio.play());
        this._isPaused = false;
    }

    public setVolume(linearVolume: number): void {
        // log(0) is undefined. So we provide a minimum of 0.01.
        this._audio.volume = linearVolume > 0 ? this.mathExtensions.linearToLogarithmic(linearVolume, 0.01, 1) : 0;
    }

    public skipToSeconds(seconds: number): void {
        this._audio.currentTime = seconds;
    }

    private replaceUnplayableCharacters(audioFilePath: string): string {
        // HTMLAudioElement doesn't play paths which contain # and ?, so we escape them.
        let playableAudioFilePath: string = StringUtils.replaceAll(audioFilePath, '#', '%23');
        playableAudioFilePath = StringUtils.replaceAll(playableAudioFilePath, '?', '%3F');
        return playableAudioFilePath;
    }

    public preloadNext(track: TrackModel): void {
        // Not implemented as not supported by legacy audio player.
    }

    public getAudio(): HTMLAudioElement | undefined {
        return this._audio;
    }

    private connectVisualizer(): void {
        const mediaElementSource: MediaElementAudioSourceNode = this._audioContext.createMediaElementSource(this._audio);
        this._analyser.connect(this._audioContext.destination);
        mediaElementSource!.connect(this._analyser);
    }
}
