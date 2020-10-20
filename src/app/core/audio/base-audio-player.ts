export abstract class BaseAudioPlayer {
    public abstract play(audioFilePath: string): void;
    public abstract stop(): void;
    public abstract pause(): void;
    public abstract resume(): void;
    public abstract setVolume(volume: number): void;
    public abstract mute(): void;
    public abstract unMute(): void;
}
