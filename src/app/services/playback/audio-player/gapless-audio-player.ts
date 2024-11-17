import { Observable } from 'rxjs';
import { AudioChangedEvent } from './audio-changed-event';
import { IAudioPlayer } from './i-audio-player';
import { MathExtensions } from '../../../common/math-extensions';
import { Logger } from '../../../common/logger';

export class GaplessAudioPlayer implements IAudioPlayer {
    public constructor(
        private mathExtensions: MathExtensions,
        private logger: Logger,
    ) {}

    audioChanged$: Observable<AudioChangedEvent>;
    playbackFinished$: Observable<void>;
    progressSeconds: number;
    totalSeconds: number;
    play(audioFilePath: string): void {
        throw new Error('Method not implemented.');
    }
    stop(): void {
        throw new Error('Method not implemented.');
    }
    pause(): void {
        throw new Error('Method not implemented.');
    }
    resume(): void {
        throw new Error('Method not implemented.');
    }
    setVolume(volume: number): void {
        throw new Error('Method not implemented.');
    }
    skipToSeconds(seconds: number): void {
        throw new Error('Method not implemented.');
    }
    preloadNextTrack(audioFilePath: string): void {
        throw new Error('Method not implemented.');
    }
}
