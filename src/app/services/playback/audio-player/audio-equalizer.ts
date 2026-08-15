/**
 * Builds a chain of BiquadFilterNodes that can be inserted into an audio graph to
 * provide a classic graphic equalizer. The first band is a low-shelf filter, the last
 * band is a high-shelf filter and all bands in between are peaking filters.
 */
export class AudioEqualizer {
    // Classic ISO 10-band graphic equalizer center frequencies (Hz).
    public static readonly frequencies: number[] = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

    private readonly _input: GainNode;
    private readonly _output: GainNode;
    private readonly _filters: BiquadFilterNode[] = [];

    public constructor(private audioContext: AudioContext) {
        this._input = audioContext.createGain();
        this._output = audioContext.createGain();

        let previousNode: AudioNode = this._input;

        for (let i = 0; i < AudioEqualizer.frequencies.length; i++) {
            const filter: BiquadFilterNode = audioContext.createBiquadFilter();

            if (i === 0) {
                filter.type = 'lowshelf';
            } else if (i === AudioEqualizer.frequencies.length - 1) {
                filter.type = 'highshelf';
            } else {
                filter.type = 'peaking';
                filter.Q.value = 1.4;
            }

            filter.frequency.value = AudioEqualizer.frequencies[i];
            filter.gain.value = 0;

            previousNode.connect(filter);
            previousNode = filter;

            this._filters.push(filter);
        }

        previousNode.connect(this._output);
    }

    public get input(): AudioNode {
        return this._input;
    }

    public get output(): AudioNode {
        return this._output;
    }

    public setGains(gainsInDecibels: number[]): void {
        for (let i = 0; i < this._filters.length; i++) {
            const gain: number = gainsInDecibels[i] ?? 0;
            this._filters[i].gain.setValueAtTime(gain, this.audioContext.currentTime);
        }
    }
}
