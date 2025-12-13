import { Observable } from 'rxjs';
import { TrackModel } from '../../track/track-model';

export interface IAudioPlayer {
    playbackFinished$: Observable<void>;
    playbackFailed$: Observable<string>;
    playingPreloadedTrack$: Observable<TrackModel>;
    progressSeconds: number;
    totalSeconds: number;
    analyser: AnalyserNode;
    isPaused: boolean;
    playAsync(track: TrackModel): Promise<void>;
    startPausedAsync(track: TrackModel, skipSeconds: number): Promise<void>;
    stop(): void;
    pause(): void;
    resumeAsync(): Promise<void>;
    setVolume(volume: number): void;
    skipToSecondsAsync(seconds: number): Promise<void>;
    preloadNext(track: TrackModel): void;
    getAudio(): HTMLAudioElement | undefined;
}
