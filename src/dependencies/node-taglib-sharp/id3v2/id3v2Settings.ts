import {StringType} from "../byteVector";
import {Guards} from "../utils";

export default class Id3v2Settings {
    private static _defaultEncoding: StringType = StringType.UTF8;
    private static _defaultVersion: number = 3;
    private static _forceDefaultEncoding: boolean = false;
    private static _forceDefaultVersion: boolean = false;
    private static _strictFramesForVersion: boolean = false;
    private static _useNonstandardV2V3GenreSeparators: boolean = true;
    private static _useNonstandardV2V3NumericGenres: boolean = true;
    private static _useNumericGenres: boolean = true;

    // noinspection JSUnusedLocalSymbols
    /**
     * Private constructor to prevent inadvertent construction
     */
    private constructor() { /* private to prevent construction */ }

    /**
     * Gets the encoding to use when creating new frames.
     */
    public static get defaultEncoding(): StringType { return this._defaultEncoding; }
    /**
     * Sets the encoding to use when creating new frames.
     * @param value Encoding to use when creating new frames
     */
    public static set defaultEncoding(value: StringType) { this._defaultEncoding = value; }

    /**
     * Gets the default version to use when creating new tags.
     * If {@link forceDefaultEncoding} is `true` then all tags will be rendered with this version.
     */
    public static get defaultVersion(): number { return Id3v2Settings._defaultVersion; }
    /**
     * Sets the default version to use when creating new tags.
     * If {@link forceDefaultEncoding} is `true` then all tags will be rendered with this version.
     * @param value ID3v2 version to use. Must be 2, 3, or 4. The default for this library is 3
     */
    public static set defaultVersion(value: number) {
        Guards.byte(value, "value");
        Guards.betweenInclusive(value, 2, 4, "value");
        Id3v2Settings._defaultVersion = value;
    }

    /**
     * Size of an ID3v2 footer in bytes
     */
    public static get footerSize(): number { return 10; }

    /**
     * Gets whether or not to render all frames with the default encoding rather than their
     * original encoding.
     */
    public static get forceDefaultEncoding(): boolean { return Id3v2Settings._forceDefaultEncoding; }
    /**
     * Sets whether or not to render all frames with the default encoding rather than their
     * original encoding.
     * @param value If `true` frames will be rendered using {@link defaultEncoding} rather than
     *     their original encoding.
     */
    public static set forceDefaultEncoding(value: boolean) { Id3v2Settings._forceDefaultEncoding = value; }

    /**
     * Gets whether or not to save all tags in the default version rather than their original
     * version.
     */
    public static get forceDefaultVersion(): boolean { return this._forceDefaultVersion; }
    /**
     * Sets whether or not to save all tags in the default version rather than their original
     * version.
     * @param value If `true`, tags will be saved in the version defined in {@link defaultVersion}
     *     rather than their original format, with the exception of tags with footers which will
     *     always be saved in version 4
     */
    public static set forceDefaultVersion(value: boolean) { this._forceDefaultVersion = value; }

    /**
     * Size of an ID3v2 header in bytes
     */
    public static get headerSize(): number { return 10; }

    /**
     * Gets whether or not to use ID3v1 style numeric genres when possible.
     * If `true`, the library will try looking up the numeric genre code when storing the value.
     * for ID3v2.2 and ID3v2.3 "Rock" would be stored as "(17)" and for ID3v2.4, it would be
     * stored as "17".
     */
    public static get useNumericGenres(): boolean { return this._useNumericGenres; }
    /**
     * Sets whether or not to use ID3v1 style numeric genres when possible.
     * If `true`, the library will try looking up the numeric genre code when storing the value.
     * for ID3v2.2 and ID3v2.3 "Rock" would be stored as "(17)" and for ID3v2.4, it would be
     * stored as "17".
     * @param value Whether or not to use genres with numeric values when values when possible
     */
    public static set useNumericGenres(value: boolean) { this._useNumericGenres = value; }

    /**
     * Gets whether or not to use non-standard genre separators on ID3v2.2 and ID3v2.4.
     * If `true`, the TCO/TCON frame value will be separated by `;` and/or `/`, empty values will
     * be thrown out. If `false`, the TCO/TCON frame value will be returned as-is (after processing
     * standard, escaped numeric genres).
     * @remarks The official ID3v2 standard makes no mention of separators for genres, one of the
     *     inherent flaws fixed in ID3v2.4. However, various media players, as well as the original
     *     implementation of TagLib#, support using `;` and `/` to separate genres. In order to
     *     maintain compatibility, this functionality is preserved, but can be disabled by setting
     *     {@link useNonStandardV2V3GenreSeparators} to `false`.
     */
    public static get useNonStandardV2V3GenreSeparators(): boolean {
        return this._useNonstandardV2V3GenreSeparators;
    }
    /**
     * Sets whether or not to use non-standard genre separators on ID3v2.2 and ID3v2.3.
     * If `true`, the TCO/TCON frame value will be separated by `;` and/or `/`, empty values will
     * be thrown out. If `false`, the TCO/TCON frame value will be returned as-is (after processing
     * standard, escaped numeric genres).
     * @remarks The official ID3v2 standard makes no mention of separators for genres, one of the
     *     inherent flaws fixed in ID3v2.4. However, various media players, as well as the original
     *     implementation of TagLib#, support using `;` and `/` to separate genres. In order to
     *     maintain compatibility, this functionality is preserved, but can be disabled by setting
     *     {@link useNonStandardV2V3GenreSeparators} to `false`.
     */
    public static set useNonStandardV2V3GenreSeparators(value: boolean) {
        this._useNonstandardV2V3GenreSeparators = value;
    }

    /**
     * Gets whether or not to use non-standard numeric genre parsing on ID3v2.2 and ID3v2.3. If
     * `true`, a purely numeric TCO/TCON frame value will attempt to be parsed as a numeric genre.
     * If `false`, the TCO/TCON frame value will be returned without parsing purely numeric genres.
     * @remarks The official ID3v2.2/ID3v2.3 standard only supports numeric genres if they are
     *     escaped inside parenthesis (eg, `(12)`). However, the original implementation of TagLib#
     *     allowed ID3v2.2 and ID3v2.3 tags to parse unescaped numeric genres. In order to maintain
     *     compatibility, this functionality is preserved, but can be disabled by setting
     *     {@link useNonStandardV2V3NumericGenres} to `false`.
     */
    public static get useNonStandardV2V3NumericGenres(): boolean {
        return this._useNonstandardV2V3NumericGenres;
    }
    /**
     * Sets whether or not to use non-standard numeric genre parsing on ID3v2.2 and ID3v2.3. If
     * `true`, a purely numeric TCO/TCON frame value will attempt to be parsed as a numeric genre.
     * If `false`, the TCO/TCON frame value will be returned without parsing purely numeric genres.
     * @remarks The official ID3v2.2/ID3v2.3 standard only supports numeric genres if they are
     *     escaped inside parenthesis (eg, `(12)`). However, the original implementation of TagLib#
     *     allowed ID3v2.2 and ID3v2.3 tags to parse unescaped numeric genres. In order to maintain
     *     compatibility, this functionality is preserved, but can be disabled by setting
     *     {@link useNonStandardV2V3NumericGenres} to `false`.
     */
    public static set useNonStandardV2V3NumericGenres(value: boolean) {
        this._useNonstandardV2V3NumericGenres = value;
    }

    /**
     * Gets whether or not attempting to write a frame that is unsupported in the desired version
     * will throw an error.
     * If `true` writing a frame that is not supported in the desired version will throw an error
     * during the render process. If `false` if a frame is not supported in the desired version it
     * will be omitted from rendering and no error will be thrown.
     */
    public static get strictFrameForVersion(): boolean { return this._strictFramesForVersion; }
    /**
     * Sets whether or not attempting to write a frame that is unsupported in the desired version
     * will throw an error.
     * If `true` writing a frame that is not supported in the desired version will throw an error
     * during the render process. If `false` if a frame is not supported in the desired version it
     * will be omitted from rendering and no error will be thrown.
     */
    public static set strictFrameForVersion(value: boolean) { this._strictFramesForVersion = value; }

    // @TODO: Add flag for disabling iTunes-only frames
}
