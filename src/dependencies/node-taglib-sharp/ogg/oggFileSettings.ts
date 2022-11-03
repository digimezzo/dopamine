/**
 * This class contains settings related to Ogg file operations. Open files will need to be re-read
 * in order for changes to take effect.
 */
export default class OggFileSettings {
    private static _writeToAllComments = false;

    /**
     * Gets whether changes to Ogg tag fields should be written to all Xiph comments or just the
     * first Xiph comment in the file.
     * @remarks Ogg files are required to have one Xiph comment per stream. In files with multiple
     *     streams, this means there are multiple Xiph comments per file.
     */
    public static get writeToAllComments(): boolean { return this._writeToAllComments; }
    /**
     * Sets whether changes to Ogg tag fields should be written to all Xiph comments or just the
     * first Xiph comment in the file.
     * @remarks Ogg files are required to have one Xiph comment per stream. In files with multiple
     *     streams, this means there are multiple Xiph comments per file.
     */
    public static set writeToAllComments(value: boolean) { this._writeToAllComments = value; }
}
