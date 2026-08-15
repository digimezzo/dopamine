export class EqualizerPresets {
    // Manual preset key. Selected automatically when the user tweaks a band by hand.
    public static readonly manual: string = 'manual';

    // 10-band gains (dB) matching AudioEqualizer.frequencies: 32, 64, 125, 250, 500, 1k, 2k, 4k, 8k, 16k.
    public static readonly presets: { [name: string]: number[] } = {
        flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        acoustic: [5, 5, 4, 1, 2, 2, 4, 4, 3, 2],
        'bass-boost': [7, 6, 5, 3, 1, 0, 0, 0, 0, 0],
        'bass-reducer': [-7, -6, -5, -3, -1, 0, 0, 0, 0, 0],
        classical: [5, 4, 3, 2, -1, -1, 0, 2, 3, 4],
        dance: [4, 7, 5, 0, 2, 3, 5, 4, 3, 0],
        electronic: [5, 4, 1, 0, -2, 2, 1, 1, 4, 5],
        'hip-hop': [6, 5, 2, 3, -1, -1, 1, 0, 2, 3],
        jazz: [4, 3, 1, 2, -1, -1, 0, 1, 3, 4],
        pop: [-1, 0, 2, 4, 5, 4, 2, 0, -1, -1],
        rock: [6, 5, 3, 1, -1, -1, 1, 3, 4, 5],
        'treble-boost': [0, 0, 0, 0, 0, 1, 3, 5, 6, 7],
        'treble-reducer': [0, 0, 0, 0, 0, -1, -3, -5, -6, -7],
        vocal: [-2, -3, -2, 2, 5, 5, 4, 3, 0, -2],
    };
}
