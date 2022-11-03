/**
 * This class contains settings related to Xiph tagging. Open files will need to be re-opened in
 * order for changes to take effect.
 */
export default class XiphSettings {
    private static _useTempoToStoreBpm: boolean = true;

    // noinspection JSUnusedLocalSymbols
    /**
     * Private constructor to prevent inadvertent construction
     */
    private constructor() { /* private to prevent constructing instances */ }

    /**
     * Gets whether to use "TEMPO" field to store {@see XiphComment.bpm} property. If `true`
     * "TEMPO" will be used, if `false` "BPM" will be used.
     * @default `true`
     */
    public static get useTempoToStoreBpm(): boolean { return this._useTempoToStoreBpm; }
    /**
     * Sets whether to use "TEMPO" field to store {@see XiphComment.bpm} property. If `true`
     * "TEMPO" will be used, if `false` "BPM" will be used.
     */
    public static set useTempoToStoreBpm(value: boolean) { this._useTempoToStoreBpm = value; }
}
