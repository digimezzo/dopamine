export abstract class AudioVisualizerServiceBase {
    public abstract showAudioVisualizer: boolean;
    public abstract audioVisualizerStyles: string[];
    public abstract selectedAudioVisualizerStyle: string;
    public abstract audioVisualizerFrameRates: number[];
    public abstract selectedAudioVisualizerFrameRate: number;
}
