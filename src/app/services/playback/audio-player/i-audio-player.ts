import { Observable } from 'rxjs';

export interface IAudioPlayer {
    audioChanged$: Observable<HTMLAudioElement>;
    playbackFinished$: Observable<void>;
    progressSeconds: number;
    totalSeconds: number;
    play(audioFilePath: string): void;
    stop(): void;
    pause(): void;
    resume(): void;
    setVolume(volume: number): void;
    skipToSeconds(seconds: number): void;
    preloadNextTrack(audioFilePath: string): void;
}
