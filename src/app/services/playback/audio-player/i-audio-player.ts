import { Observable } from 'rxjs';
import { AudioChangedEvent } from './audio-changed-event';
import { TrackModel } from '../../track/track-model';

export interface IAudioPlayer {
    audioChanged$: Observable<AudioChangedEvent>;
    playbackFinished$: Observable<void>;
    playingPreloadedTrack$: Observable<TrackModel>;
    progressSeconds: number;
    totalSeconds: number;
    analyser: AnalyserNode;
    isPaused: boolean;
    play(track: TrackModel): void;
    startPaused(track: TrackModel, skipSeconds: number): void;
    stop(): void;
    pause(): void;
    resume(): void;
    setVolume(volume: number): void;
    skipToSeconds(seconds: number): void;
    preloadNext(track: TrackModel): void;
    getAudio(): HTMLAudioElement | undefined;
}
