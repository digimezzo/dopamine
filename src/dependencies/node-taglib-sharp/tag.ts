import {IPicture} from "./picture";
import {Guards} from "./utils";

/**
 * Indicates the tag types used by a file.
 */
export enum TagTypes {
    /**
     * @summary No tag types.
     */
    None = 0x00000000,

    /**
     * @summary Xiph Vorbis Comment
     */
    Xiph = 0x00000001,

    /**
     * @summary ID3v1 Tag
     */
    Id3v1 = 0x00000002,

    /**
     * @summary ID3v2 Tag
     */
    Id3v2 = 0x00000004,

    /**
     * @summary APE Tag
     */
    Ape = 0x00000008,

    /**
     * @summary Apple's ILST Tag Format
     */
    Apple = 0x00000010,

    /**
     * @summary ASF Tag
     */
    Asf = 0x00000020,

    /**
     * @summary Standard RIFF INFO List Tag
     */
    RiffInfo = 0x00000040,

    /**
     * @summary RIFF Movie ID List Tag
     */
    MovieId = 0x00000080,

    /**
     * @summary DivX Tag
     */
    DivX = 0x00000100,

    /**
     * @summary FLAC Metadata Block Pictures
     */
    FlacPictures = 0x00000200,

    /**
     * @summary TIFF IFD Tag
     */
    TiffIFD = 0x00000400,

    /**
     * @summary XMP Tag
     */
    XMP = 0x00000800,

    /**
     * @summary Jpeg Comment Tag
     */
    JpegComment = 0x00001000,

    /**
     * @summary Gif Comment Tag
     */
    GifComment = 0x00002000,

    /**
     * @summary native PNG keywords
     */
    Png = 0x00004000,

    /**
     * @summary IPTC-IIM tag
     */
    IPTCIIM = 0x00008000,

    /**
     * @summary Audible Metadata Blocks Tag
     */
    AudibleMetadata = 0x00010000,

    /**
     * @summary Matroska native tag
     */
    Matroska = 0x00020000,

    /**
     * @summary All tag types.
     */
    AllTags = 0xFFFFFFFF
}

/**
 * Abstract class that provides generic access to standard tag features. All tag types will extend
 * this class.
 * Because not every tag type supports the same features, it may be useful to check that the value
 * is stored by re-reading the property after it is set.
 */
export abstract class Tag {
    /**
     * Gets the tag types contained in the current instance. A bit wise combined {@link TagTypes}
     * containing the tag types contained in the current instance.
     * @remarks For a standard tag, the value should be intuitive. For example, Id3v2Tag objects have
     *     a value of {@link TagTypes.Id3v2}. However, for CombinedTag type objects, they may
     *     contain multiple or no types.
     */
    public abstract tagTypes: TagTypes;

    /**
     * Gets the size of the tag in bytes on disk as it was read from disk.
     */
    public abstract get sizeOnDisk(): number;

    /**
     * Gets the title for the media described by the current instance.
     * @remarks The title is most commonly the name of the song, episode or a movie title. For example
     *     "Time Won't Me Go" (a song by The Bravery), "Three Stories" (an episode of House MD), or
     *     "Fear and Loathing In Las Vegas" (a movie).
     * @returns Title of the media described by the current instance or `undefined` if no value is
     *     present.
     */
    public get title(): string { return undefined; }
    /**
     * Sets the title for the media described by the current instance.
     * @remarks The title is most commonly the name of the song, episode or a movie title. For example
     *     "Time Won't Me Go" (a song by The Bravery), "Three Stories" (an episode of House MD), or
     *     "Fear and Loathing In Las Vegas" (a movie).
     * @param value Title of the media described by the current instance or `undefined` if no value
     *     is present.
     */
    public set title(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the sortable name for the title of the media described by the current instance.
     * @remarks Possibly used to sort compilations or episodic content.
     * @returns Sortable name of the media described by the current instance or `undefined` if no
     *     value is present
     */
    public get titleSort(): string { return undefined; }
    /**
     * Sets the sortable name for the title of the media described by the current instance.
     * @remarks Possibly used to sort compilations or episodic content.
     * @param value Sortable name of the media described by the current instance or `undefined` if
     *     no value is present
     */
    public set titleSort(value: string) { /* no-op in abstract case */ }

    /**
     * Gets a description, one-line. It represents the tagline of the vide/music.
     * @remarks This field gives a nice/short precision to the title, which is typically below the
     *     title on the front cover of the media. For example for "Ocean's 13", this would be
     *     "Revenge is a funny thing".
     * @returns Subtitle of the media represented by the current instance or `undefined` if no
     *     value is present
     */
    public get subtitle(): string { return undefined; }
    /**
     * Sets a description, one-line. It represents the tagline of the vide/music.
     * @remarks This field gives a nice/short precision to the title, which is typically below the
     *     title on the front cover of the media. For example for "Ocean's 13", this would be
     *     "Revenge is a funny thing".
     * @param value Subtitle of the media represented by the current instance or `undefined` if no
     *     value is present
     */
    public set subtitle(value: string) { /* no-op in abstract case */ }

    /**
     * Gets a short description of the media. For music, this could be the comment that the artist
     * made of his/her work. For a video, this should be a short summary of the story/plot, but
     * generally no spoliers. This should give the impression of what to expect in the media.
     * @remarks This is especially relevant for a movie. For example, for "Fear and Loathing in Las
     *     Vegas", this could be "An oddball journalist and his psychopathic lawyer travel to Las
     *     Vegas for a series of psychedelic escapades."
     * @returns Description of the media represented by the current instance or `undefined` if no
     *     value is present
     */
    public get description(): string { return undefined; }
    /**
     * Sets a short description of the media. For music, this could be the comment that the artist
     * made of his/her work. For a video, this should be a short summary of the story/plot, but
     * generally no spoliers. This should give the impression of what to expect in the media.
     * @remarks This is especially relevant for a movie. For example, for "Fear and Loathing in Las
     *     Vegas", this could be "An oddball journalist and his psychopathic lawyer travel to Las
     *     Vegas for a series of psychedelic escapades."
     * @param value Description of the media represented by the current instance or `undefined` if
     *     no value is present
     */
    public set description(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the performers or artists who performed in the media described by the current instance.
     * @remarks This field is most commonly called "Artists" in audio media or "Actors" in video
     *     media, and should be used to represent each artist/actor appearing in the media. It can
     *     be simple in the form of "Above & Beyond" or more complicated in the form of
     *     "Jono Grant, Tony McGuinness, Paavo Siljamäki", depending on the preferences of the
     *     user and the degree to which they organize their media collection.
     *     As the preference of the user may vary, applications should avoid limiting the user in
     *     what constitutes the performers field - especially with regards to number of performers.
     * @returns Performers who performed in the media described by the current instance or an empty
     *     array if no value is present.
     */
    public get performers(): string[] { return []; }
    /**
     * Sets the performers or artists who performed in the media described by the current instance.
     * @remarks This field is most commonly called "Artists" in audio media or "Actors" in video
     *     media, and should be used to represent each artist/actor appearing in the media. It can
     *     be simple in the form of "Above & Beyond" or more complicated in the form of
     *     "Jono Grant, Tony McGuinness, Paavo Siljamäki", depending on the preferences of the
     *     user and the degree to which they organize their media collection.
     *     As the preference of the user may vary, applications should avoid limiting the user in
     *     what constitutes the performers field - especially with regards to number of performers.
     * @param value Performers who performed in the media described by the current instance or an
     *     empty array if no value is present.
     */
    public set performers(value: string[]) { /* no-op in abstract case */ }

    /**
     * Gets the sortable names of the performers or artists who performed in the media described by
     * the current instance.
     * @remarks This is used to provide more control over how the media is sorted. Typical uses are to
     *     skip articles or sort by last name. For example, "The Pillows" might be sorted as
     *     "Pillows, The".
     * @see performers
     * @returns Sortable names for the performers who performed in the media described by the
     *     current instance, or an empty array if no value is present.
     */
    public get performersSort(): string[] { return []; }
    /**
     * Gets the sortable names of the performers or artists who performed in the media described by
     * the current instance.
     * @remarks This is used to provide more control over how the media is sorted. Typical uses are to
     *     skip articles or sort by last name. For example, "The Pillows" might be sorted as
     *     "Pillows, The".
     * @see performers
     * @param value Sortable names for the performers who performed in the media described by the
     *     current instance, or an empty array if no value is present.
     */
    public set performersSort(value: string[]) { /* no-op in abstract case */ }

    /**
     * Gets the characters portrayed by an actor for a video or instruments played by a musician
     * for music. This must match the {@link performers} array (for each person, correspond one/more
     * role). Several roles for the same artist/actor can be separated with semicolons. For
     * example: "Bass; Backing Vocals; Vibraphone".
     * @remarks It is highly important to match each role to the performers. This means that an entry
     *     in the {@link performersRole} array is `undefined` to maintain the relationship between
     *     `performers[i]` and `performersRole[i]`.
     * @returns Array containing the roles played by the performers in the media described by the
     *     current instance, or an empty array if no value is present.
     */
    public get performersRole(): string[] { return[]; }
    /**
     * Sets the characters portrayed by an actor for a video or instruments played by a musician
     * for music. This must match the {@link performers} array (for each person, correspond one/more
     * role). Several roles for the same artist/actor can be separated with semicolons. For
     * example: "Bass; Backing Vocals; Vibraphone".
     * @remarks It is highly important to match each role to the performers. This means that an entry
     *     in the {@link performersRole} array is `undefined` to maintain the relationship between
     *     `performers[i]` and `performersRole[i]`.
     * @param value Array containing the roles played by the performers in the media described by
     *     the current instance, or an empty array if no value is present.
     */
    public set performersRole(value: string[]) { /* no-op in abstract case */ }

    /**
     * Gets the band or artist who is credited credited in the creation of the entire album or
     * collection containing the media described by the current instance.
     * @remarks This field is typically optional but aids in the sorting of compilations or albums
     *     with multiple artist. For example, if an album has several artists, sorting by artist
     *     will split up albums by the same artist. Having a single album artist for an entire
     *     album solves this problem.
     *     As this value is to be used as a sorting key, it should be used with less variation
     *     than {@link performers}. Where performers can be broken into multiple artists, it is
     *     best to stick to a single name. Eg, "Super8 & Tab"
     * @returns Band or artist credited with the creation of the entire album or collection
     *     containing the media described by the current instance or an empty array if no value is
     *     present
     */
    public get albumArtists(): string[] { return[]; }
    /**
     * Sets the bands or artists who is credited credited in the creation of the entire album or
     * collection containing the media described by the current instance.
     * @remarks This field is typically optional but aids in the sorting of compilations or albums
     *     with multiple artist. For example, if an album has several artists, sorting by artist
     *     will split up albums by the same artist. Having a single album artist for an entire
     *     album solves this problem.
     *     As this value is to be used as a sorting key, it should be used with less variation
     *     than {@link performers}. Where performers can be broken into multiple artists, it is
     *     best to stick to a single name. Eg, "Super8 & Tab"
     * @param value Band or artist credited with the creation of the entire album or collection
     *     containing the media described by the current instance or an empty array if no value is
     *     present
     */
    public set albumArtists(value: string[]) { /* no-op in abstract case */ }

    /**
     * Gets the sortable names of the bands/artists who are credited with creating the entire
     * album or collection containing the media described by the current instance.
     * @see albumArtists
     * @remarks This is used to provide more control over how the media is sorted. Typical uses are to
     *     skip articles or sort by last by last name. For example "Ben Folds" might be sorted as
     *     "Folds, Ben".
     *     As this value is to be used as a sorting key, it should be used with less variation than
     *     {@link performers}. Where {@link performers} can be broken into multiple performers, it is
     *     best to stick to a single album artist. Eg, "Van Buuren, Armin"
     * @returns Sortable names for the bands/artists are credited with the creation of the entire
     *     album or collection containing the media described by the current instance, or an empty
     *     array if no value is present.
     */
    public get albumArtistsSort(): string[] { return[]; }
    /**
     * Sets the sortable names of the bands/artists who are credited with creating the entire
     * album or collection containing the media described by the current instance.
     * @see albumArtists
     * @remarks This is used to provide more control over how the media is sorted. Typical uses are to
     *     skip articles or sort by last by last name. For example "Ben Folds" might be sorted as
     *     "Folds, Ben".
     *     As this value is to be used as a sorting key, it should be used with less variation than
     *     {@link performers}. Where {@link performers} can be broken into multiple performers, it is
     *     best to stick to a single album artist. Eg, "Van Buuren, Armin"
     * @param value Sortable names for the bands/artists are credited with the creation of the
     *     entire album or collection containing the media described by the current instance, or an
     *     empty array if no value is present.
     */
    public set albumArtistsSort(value: string[]) { /* no-op in abstract case */ }

    /**
     * Gets the composers of the media represented by the current instance.
     * @remarks This field represents the composers, song writers, script writers, or persons who
     *     claim authorship of the media.
     * @returns Composers of the media represented by the current instance of an empty array if no
     *     value is present.
     */
    public get composers(): string[] { return[]; }
    /**
     * Sets the composers of the media represented by the current instance.
     * @remarks This field represents the composers, song writers, script writers, or persons who
     *     claim authorship of the media.
     * @param value Composers of the media represented by the current instance of an empty array if
     *     no value is present.
     */
    public set composers(value: string[]) { /* no-op in abstract case */ }

    /**
     * Gets the sortable names of the composers of the media represented by the current instance.
     * @see composers
     * @remarks This field is typically optional but aids in the sorting of compilations or albums
     *     with multiple composers.
     * @returns Sortable names for the composers of the media represented by the current instance
     *     or an empty array if no value is present.
     */
    public get composersSort(): string[] { return[]; }
    /**
     * Sets the sortable names of the composers of the media represented by the current instance.
     * @see composers
     * @remarks This field is typically optional but aids in the sorting of compilations or albums
     *     with multiple composers.
     * @param value Sortable names for the composers of the media represented by the current
     *     instance or an empty array if no value is present.
     */
    public set composersSort(value: string[]) { /* no-op in abstract case */ }

    /**
     * Gets the album of the media represented by the current instance. For video media, this
     * represents the collection the video belongs to.
     * @remarks This field represents the name of the album the media belongs to. In the case of a
     *     boxed set, it should be the name of the entire set rather than the individual disc. In
     *     the case of a series, this should be the name of the series, rather than the season of a
     *     series.
     *     For example, "Kintsugi" (an album by Death Cab for Cutie), "The Complete Red Green Show"
     *     (a boxed set of TV episodes), or "Shark Tank" (a series with several seasons).
     * @returns Album of the media represented by the current instance or `undefined` if no value
     *     is present
     */
    public get album(): string { return undefined; }
    /**
     * Sets the album of the media represented by the current instance. For video media, this
     * represents the collection the video belongs to.
     * @remarks This field represents the name of the album the media belongs to. In the case of a
     *     boxed set, it should be the name of the entire set rather than the individual disc. In
     *     the case of a series, this should be the name of the series, rather than the season of a
     *     series.
     *     For example, "Kintsugi" (an album by Death Cab for Cutie), "The Complete Red Green Show"
     *     (a boxed set of TV episodes), or "Shark Tank" (a series with several seasons).
     * @param value of the media represented by the current instance or `undefined` if no value
     *     is present
     */
    public set album(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the sortable name of the album title of the media represented by the current instance.
     * @see album
     * @remarks This field is typically optional but aids in sort of compilations or albums with
     *     similar titles.
     * @returns Sortable name for the album title of the media or `undefined` if the value is not
     *     present
     */
    public get albumSort(): string { return undefined; }
    /**
     * Sets the sortable name of the album title of the media represented by the current instance.
     * @see album
     * @remarks This field is typically optional but aids in sort of compilations or albums with
     *     similar titles.
     * @param value Sortable name for the album title of the media or `undefined` if the value is
     *     not present
     */
    public set albumSort(value: string) { /* no-op in abstract case */ }

    /**
     * Gets a user comment on the media represented by the current instance.
     * @remarks This field should be used to store user notes and comments. There is no constraint on
     *     what text can be stored here, but it should not contain programmatic data.
     *     Because this field contains notes the the user might think of while consuming the media,
     *     it may be useful for an application to make this field easily accessible, perhaps even
     *     including it in the main interface.
     * @returns User comments on the media represented by the current instance or `undefined` if
     *     the value is not present
     */
    public get comment(): string { return undefined; }
    /**
     * Sets a user comment on the media represented by the current instance.
     * @remarks This field should be used to store user notes and comments. There is no constraint on
     *     what text can be stored here, but it should not contain programmatic data.
     *     Because this field contains notes the the user might think of while consuming the media,
     *     it may be useful for an application to make this field easily accessible, perhaps even
     *     including it in the main interface.
     * @param value User comments on the media represented by the current instance or `undefined`
     *     if the value is not present
     */
    public set comment(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the genres of the media represented by the current instance.
     * @remarks This field represents genres that apply to the song, album, or video. This is often
     *     used for filtering media.
     *     A list of common audio genres as popularized by ID3v1 is stored in `genres.ts`.
     *     Additionally, `genres.ts` contains video genres as used by DivX.
     * @returns Genres of the media represented by the current instance or an empty array if no
     *     value is present.
     */
    public get genres(): string[] { return undefined; }
    /**
     * Sets the genres of the media represented by the current instance.
     * @remarks This field represents genres that apply to the song, album, or video. This is often
     *     used for filtering media.
     *     A list of common audio genres as popularized by ID3v1 is stored in `genres.ts.
     *     Additionally, `genres.ts` contains video genres as used by DivX.
     * @param value Genres of the media represented by the current instance or an empty array if no
     *     value is present.
     */
    public set genres(value: string[]) { /* no-op in abstract case */ }

    /**
     * Gets the year that the media represented by the current instance was recorded.
     * @remarks Years greater than 9999 cannot be stored by most tagging formats and will be cleared
     *     if a higher value is set. Some tagging formats store higher precision dates which will
     *     be truncated when this property is set. Format specific implementations are necessary to
     *     access the higher precision values.
     * @returns Year that the media represented by the current instance was created or `0` if no
     *     value is present.
     */
    public get year(): number { return 0; }
    /**
     * Sets the year that the media represented by the current instance was recorded.
     * @remarks Years greater than 9999 cannot be stored by most tagging formats and will be cleared
     *     if a higher value is set. Some tagging formats store higher precision dates which will
     *     be truncated when this property is set. Format specific implementations are necessary to
     *     access the higher precision values.
     * @param value Year that the media represented by the current instance was created or `0` if no
     *     value is present.
     */
    public set year(value: number) { /* no-op in abstract case */ }

    /**
     * Gets the position of the media represented by the current instance in its containing album
     * or season (for a series).
     * @remarks This value should be the same as is listed on the album cover and no more than
     *     {@link trackCount}, if {@link trackCount} is non-zero.
     *     Most tagging formats store this as a string. To help sorting, a two-digit zero-padded
     *     value is used in the resulting tag.
     *     For a series, this property represents the episodes in a season of the series.
     * @returns Position of the media represented by the current instance in its containing album
     *     or `0` if not specified.
     */
    public get track(): number { return 0; }
    /**
     * Sets the position of the media represented by the current instance in its containing album
     * or season (for a series).
     * @remarks This value should be the same as is listed on the album cover and no more than
     *     {@link trackCount}, if {@link trackCount} is non-zero.
     *     Most tagging formats store this as a string. To help sorting, a two-digit zero-padded
     *     value is used in the resulting tag.
     *     For a series, this property represents the episodes in a season of the series.
     * @param value Position of the media represented by the current instance in its containing
     *     album or `0` if not specified.
     */
    public set track(value: number) { /* no-op in abstract case */ }

    /**
     * Gets the number of tracks in the album or the number of episodes in a series of the media
     * represented by the current instance.
     * @remarks If non-zero, this value should be equal to or greater than {@link track}. If
     *     {@link track} is `0`, this value should also be `0`.
     * @returns Number of tracks in the album or number of episodes in a series of the media
     *     represented by the current instance or `0` if not specified.
     */
    public get trackCount(): number { return 0; }
    /**
     * Sets the number of tracks in the album or the number of episodes in a series of the media
     * represented by the current instance.
     * @remarks If non-zero, this value should be equal to or greater than {@link track}. If
     *     {@link track} is `0`, this value should also be `0`.
     * @param value Number of tracks in the album or number of episodes in a series of the media
     *     represented by the current instance or `0` if not specified.
     */
    public set trackCount(value: number) { /* no-op in abstract case */ }

    /**
     * Gets the number of the disc containing the media represented by the current instance in the
     * boxed set. For a series, this represents the season number.
     * @remarks This value should be the same as the number that appears on the disc. For example, if
     *     the disc is the first of three, the value should be `1`. It should be no more than
     *     {@link discCount} if {@link discCount} is non-zero.
     * @returns Number of the disc or season of the media represented by the current instance in a
     *     boxed set.
     */
    public get disc(): number { return 0; }
    /**
     * Sets the number of the disc containing the media represented by the current instance in the
     * boxed set. For a series, this represents the season number.
     * @remarks This value should be the same as the number that appears on the disc. For example, if
     *     the disc is the first of three, the value should be `1`. It should be no more than
     *     {@link discCount} if {@link discCount} is non-zero.
     * @param value Number of the disc or season of the media represented by the current instance
     *     in a boxed set.
     */
    public set disc(value: number) { /* no-op in abstract case */ }

    /**
     * Gets the number of discs or seasons in the boxed set containing the media represented by the
     * current instance.
     * @remarks If non-zero, this should be at least equal to {@link disc}. If {@link disc} is zero,
     *     this value should also be zero.
     * @returns Number of discs or seasons in the boxed set containing the media represented by the
     *     current instance or `0` if not specified.
     */
    public get discCount(): number { return 0; }
    /**
     * Sets the number of discs or seasons in the boxed set containing the media represented by the
     * current instance.
     * @remarks If non-zero, this should be at least equal to {@link disc}. If {@link disc} is zero,
     *     this value should also be zero.
     * @param value Number of discs or seasons in the boxed set containing the media represented by
     *     the current instance or `0` if not specified.
     */
    public set discCount(value: number) { /* no-op in abstract case */ }

    /**
     * Gets the lyrics or script of the media represented by the current instance.
     * @remarks This field contains a plain text representation of the lyrics or scripts with line
     *     breaks and whitespace being the only formatting marks.
     *     Some formats support more advanced lyrics, like synchronized lyrics, but those must be
     *     accessed using format-specific implementations.
     * @returns Lyrics or script of the media represented by the current instance or `undefined` if
     *     no value is present
     */
    public get lyrics(): string { return undefined; }
    /**
     * Sets the lyrics or script of the media represented by the current instance.
     * @remarks This field contains a plain text representation of the lyrics or scripts with line
     *     breaks and whitespace being the only formatting marks.
     *     Some formats support more advanced lyrics, like synchronized lyrics, but those must be
     *     accessed using format-specific implementations.
     * @param value Lyrics or script of the media represented by the current instance or
     *     `undefined` if no value is present
     */
    public set lyrics(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the grouping on the album which the media in the current instance belongs to.
     * @remarks This field contains a non-physical group to which the track belongs. In classical
     *     music this could be a movement. It could also be parts of a series like "Introduction",
     *     "Closing Remarks", etc.
     * @returns Grouping on the album which the media in the current instance belongs to or
     *     `undefined` if no value is present.
     */
    public get grouping(): string { return undefined; }
    /**
     * Sets the grouping on the album which the media in the current instance belongs to.
     * @remarks This field contains a non-physical group to which the track belongs. In classical
     *     music this could be a movement. It could also be parts of a series like "Introduction",
     *     "Closing Remarks", etc.
     * @param value Grouping on the album which the media in the current instance belongs to or
     *     `undefined` if no value is present.
     */
    public set grouping(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the number of beats per minute in the audio of the media represented by the current
     * instance.
     * @remarks This field is useful for DJ's who are trying to beat match tracks. It should be
     *     calculated from the audio or pulled from a database.
     * @returns Beats per minute of the audio in the media represented by the current instance, or
     *     `0` if not specified
     */
    public get beatsPerMinute(): number { return 0; }
    /**
     * Sets the number of beats per minute in the audio of the media represented by the current
     * instance.
     * @remarks This field is useful for DJ's who are trying to beat match tracks. It should be
     *     calculated from the audio or pulled from a database.
     * @param value Beats per minute of the audio in the media represented by the current instance,
     *     or `0` if not specified
     */
    public set beatsPerMinute(value: number) { /* no-op in abstract case */ }

    /**
     * Gets the conductor or director of the media represented by the current instance.
     * @remarks This field is most useful for organizing classical music and movies.
     * @returns Conductor or director of the media represented by the current instance or
     *     `undefined` if no value present.
     */
    public get conductor(): string { return undefined; }
    /**
     * Sets the conductor or director of the media represented by the current instance.
     * @remarks This field is most useful for organizing classical music and movies.
     * @param value Conductor or director of the media represented by the current instance or
     *     `undefined` if no value present.
     */
    public set conductor(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the copyright information for the media represented by the current instance.
     * @remarks This field should be used for storing copyright information. It may be useful to show
     *     this information somewhere in the program while the media is playing.
     *     Players should not support editing this field, but media creation tools should
     *     definitely allow modification.
     * @returns Copyright information for the media represented by the current instance or
     *     `undefined` if no value is present.
     */
    public get copyright(): string { return undefined; }
    /**
     * Sets the copyright information for the media represented by the current instance.
     * @remarks This field should be used for storing copyright information. It may be useful to show
     *     this information somewhere in the program while the media is playing.
     *     Players should not support editing this field, but media creation tools should
     *     definitely allow modification.
     * @param value Copyright information for the media represented by the current instance or
     *     `undefined` if no value is present.
     */
    public set copyright(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the date and time at which the tag has been written.
     * @returns Date/time at which the tag has been written, or `undefined` if no value is present
     */
    public get dateTagged(): Date|undefined { return undefined; }
    /**
     * Sets the date and time at which the tag has been written.
     * @param value Date/time at which the tag has been written, or `undefined` if no value is
     *     present
     */
    public set dateTagged(value: Date|undefined) { /* no-op in abstract case */ }

    /**
     * Gets the MusicBrainz artist ID of the media represented by the current instance.
     * @remarks This field represents the MusicBrainz ArtistID, and is used to uniquely identify a
     *     particular artist of the track.
     * @returns MusicBrainz ArtistID of the media represented by the current instance or
     *     `undefined` if no value is present
     */
    public get musicBrainzArtistId(): string { return undefined; }
    /**
     * Sets the MusicBrainz artist ID of the media represented by the current instance.
     * @remarks This field represents the MusicBrainz ArtistID, and is used to uniquely identify a
     *     particular artist of the track.
     * @param value MusicBrainz ArtistID of the media represented by the current instance or
     *     `undefined` if no value is present
     */
    public set musicBrainzArtistId(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the MusicBrainz release group ID of the media represented by the current instance.
     * @remarks This field represents the MusicBrainz ReleaseGroupID and is used to uniquely identify
     *     a particular release group to which this track belongs.
     * @returns MusicBrainz ReleaseGroupID of the media represented by the current instance or
     *     `undefined` if no value is present
     */
    public get musicBrainzReleaseGroupId(): string { return undefined; }
    /**
     * Sets the MusicBrainz release group ID of the media represented by the current instance.
     * @remarks This field represents the MusicBrainz ReleaseGroupID and is used to uniquely identify
     *     a particular release group to which this track belongs.
     * @param value MusicBrainz ReleaseGroupID of the media represented by the current instance or
     *     `undefined` if no value is present
     */
    public set musicBrainzReleaseGroupId(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the MusicBrainz release ID of the media represented by the current instance.
     * @remarks This field represents the MusicBrains ReleaseID and is used to uniquely identify a
     *     particular release to which this track belongs.
     * @returns MusicBrainz ReleaseID of the media represented by the current instance or
     *     `undefined` if no value is present
     */
    public get musicBrainzReleaseId(): string { return undefined; }
    /**
     * Sets the MusicBrainz release ID of the media represented by the current instance.
     * @remarks This field represents the MusicBrains ReleaseID and is used to uniquely identify a
     *     particular release to which this track belongs.
     * @param value MusicBrainz ReleaseID of the media represented by the current instance or
     *     `undefined` if no value is present
     */
    public set musicBrainzReleaseId(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the MusicBrainz release artist ID of the media represented by the current instance.
     * @remarks This field represents the MusicBrainz ReleaseArtistID, and is used to uniquely
     *     identify a particular album artist credited with the album.
     * @returns MusicBrainz ReleaseArtistID of the media represented by the current instance or
     *     `undefined` if no value is present
     */
    public get musicBrainzReleaseArtistId(): string { return undefined; }
    /**
     * Sets the MusicBrainz release artist ID of the media represented by the current instance.
     * @remarks This field represents the MusicBrainz ReleaseArtistID, and is used to uniquely
     *     identify a particular album artist credited with the album.
     * @param value MusicBrainz ReleaseArtistID of the media represented by the current instance or
     *     `undefined` if no value is present
     */
    public set musicBrainzReleaseArtistId(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the MusicBrainz track ID of the media represented by the media represented by the
     * current instance.
     * @remarks This field represents the MusicBrainz TrackID and is used to uniquely identify a
     *     particular track.
     * @returns MusicBrainz TrackID of the media represented by the current instance or `undefined`
     *     if no value is present
     */
    public get musicBrainzTrackId(): string { return undefined; }
    /**
     * Sets the MusicBrainz track ID of the media represented by the media represented by the
     * current instance.
     * @remarks This field represents the MusicBrainz TrackID and is used to uniquely identify a
     *     particular track.
     * @param value MusicBrainz TrackID of the media represented by the current instance or
     *     `undefined` if no value is present
     */
    public set musicBrainzTrackId(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the MusicBrainz disc ID of the media represented by the current instance.
     * @remarks This field represents the MusicBrainz DiscID and is used to uniquely identify the
     *     particular released media associated with this track.
     * @returns MusicBrainz DiscID of the media represented by the current instance or `undefined`
     *     if no value is present
     */
    public get musicBrainzDiscId(): string { return undefined; }
    /**
     * Sets the MusicBrainz disc ID of the media represented by the current instance.
     * @remarks This field represents the MusicBrainz DiscID and is used to uniquely identify the
     *     particular released media associated with this track.
     * @param value MusicBrainz DiscID of the media represented by the current instance or
     *     `undefined` if no value is present
     */
    public set musicBrainzDiscId(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the MusicIP PUID of the media represented by the current instance.
     * @remarks This field represents the MusicIP PUID, an acoustic fingerprint identifier. It
     *     identifies wht this track "sounds like".
     * @returns MusicIP PUID of the media represented by the current instance or `undefined` if no
     *     value is present
     */
    public get musicIpId(): string { return undefined; }
    /**
     * Sets the MusicIP PUID of the media represented by the current instance.
     * @remarks This field represents the MusicIP PUID, an acoustic fingerprint identifier. It
     *     identifies wht this track "sounds like".
     * @param value MusicIP PUID of the media represented by the current instance or `undefined`
     *     if no value is present
     */
    public set musicIpId(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the Amazon ID of the media represented by the current instance.
     * @remarks This field represents the AmazonID, also called the ASIN, and is used to uniquely
     *     identify the particular track or album in the Amazon catalog.
     * @returns Amazon ID of the media represented by the current instance or `undefined` if no
     *     value is present
     */
    public get amazonId(): string { return undefined; }
    /**
     * Sets the Amazon ID of the media represented by the current instance.
     * @remarks This field represents the AmazonID, also called the ASIN, and is used to uniquely
     *     identify the particular track or album in the Amazon catalog.
     * @param value Amazon ID of the media represented by the current instance or `undefined` if no
     *     value is present
     */
    public set amazonId(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the MusicBrainz release status of the media represented by the current instance.
     * @remarks This field represents the MusicBrainz ReleaseStatus used to describe how 'official' a
     *     release is. Common statuses are: `Official`, `Promotion`, `Bootleg`, `Pseudo-release`.
     * @returns MusicBrainz ReleaseStatus of the media represented by the current instance or
     *     `undefined` if no value is present
     */
    public get musicBrainzReleaseStatus(): string { return undefined; }
    /**
     * Sets the MusicBrainz release status of the media represented by the current instance.
     * @remarks This field represents the MusicBrainz ReleaseStatus used to describe how 'official' a
     *     release is. Common statuses are: `Official`, `Promotion`, `Bootleg`, `Pseudo-release`.
     * @param value MusicBrainz ReleaseStatus of the media represented by the current instance or
     *     `undefined` if no value is present
     */
    public set musicBrainzReleaseStatus(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the MusicBrainz release type of the media represented by the current instance.
     * @remarks This field represents the MusicBrainz ReleaseType that describes what kind of release
     *     a release is. Common types are: `Single`, `Album`, `EP`, `Compilation`, `Soundtrack,
     *     `SpokenWord`, `Interview`, `Audiobook`, `Live`, `Remix`, and `Other`. Careful thought
     *     must be given when using this field to decide if a particular track "is a compilation".
     * @returns MusicBrainz ReleaseType of the media represented by the current instance or
     *     `undefined` if no value is present
     */
    public get musicBrainzReleaseType(): string { return undefined; }
    /**
     * Sets the MusicBrainz release type of the media represented by the current instance.
     * @remarks This field represents the MusicBrainz ReleaseType that describes what kind of release
     *     a release is. Common types are: `Single`, `Album`, `EP`, `Compilation`, `Soundtrack,
     *     `SpokenWord`, `Interview`, `Audiobook`, `Live`, `Remix`, and `Other`. Careful thought
     *     must be given when using this field to decide if a particular track "is a compilation".
     * @param value MusicBrainz ReleaseType of the media represented by the current instance or
     *     `undefined` if no value is present
     */
    public set musicBrainzReleaseType(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the MusicBrainz release country of the media represented by the current instance.
     * @remarks This field represents the MusicBrainz ReleaseCountry which describes the country in
     *     which an album was released. Note that the release country of an album is not
     *     necessarily the country in which it was produced. The label itself will typically be
     *     more relevant. Eg, a release on "Foo Records UK" that has "Made in Austria" printed on
     *     it will likely be a UK release.
     * @returns MusicBrainz ReleaseCountry of the media represented by the current instance or
     *     `undefined` if no value is present
     */
    public get musicBrainzReleaseCountry(): string { return undefined; }
    /**
     * Sets the MusicBrainz release country of the media represented by the current instance.
     * @remarks This field represents the MusicBrainz ReleaseCountry which describes the country in
     *     which an album was released. Note that the release country of an album is not
     *     necessarily the country in which it was produced. The label itself will typically be
     *     more relevant. Eg, a release on "Foo Records UK" that has "Made in Austria" printed on
     *     it will likely be a UK release.
     * @param value MusicBrainz ReleaseCountry of the media represented by the current instance or
     *     `undefined` if no value is present
     */
    public set musicBrainzReleaseCountry(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the ReplayGain track gain in dB.
     * @returns Track gain as per ReplayGain specifications, in dB, or `NaN` if no value is set
     */
    public get replayGainTrackGain(): number { return NaN; }
    /**
     * Sets the ReplayGain track gain in dB.
     * @param value Track gain as per ReplayGain specifications, in dB, or `NaN` if no value is set
     */
    public set replayGainTrackGain(value: number) { /* no-op in abstract case */ }

    /**
     * Gets the ReplayGain track peak sample.
     * @returns Track peak as per the ReplayGain specifications, or `NaN` if no value is set
     */
    public get replayGainTrackPeak(): number { return NaN; }
    /**
     * Sets the ReplayGain track peak sample.
     * @param value Track peak as per the ReplayGain specifications, or `NaN` if no value is set
     */
    public set replayGainTrackPeak(value: number) { /* no-op in abstract case */ }

    /**
     * Gets the ReplayGain album gain in dB.
     * @returns Album gain as per the ReplayGain specifications, in dB, or `NaN` if no value is set
     */
    public get replayGainAlbumGain(): number { return NaN; }
    /**
     * Sets the ReplayGain album gain in dB.
     * @param value Album gain as per the ReplayGain specifications, in dB, or `NaN` if no value is
     *     set
     */
    public set replayGainAlbumGain(value: number) { /* no-op in abstract case */ }

    /**
     * Gets the ReplayGain album peak sample.
     * @returns Album peak as per the ReplayGain specifications, or `NaN` if no value is set
     */
    public get replayGainAlbumPeak(): number { return NaN; }
    /**
     * Sets the ReplayGain album peak sample.
     * @param value Album peak as per the ReplayGain specifications, or `NaN` if no value is set
     */
    public set replayGainAlbumPeak(value: number) { /* no-op in abstract case */ }

    /**
     * Gets the initial key of the track.
     * @returns Initial key of the track or `undefined` if no value is set
     */
    public get initialKey(): string { return undefined; }
    /**
     * Sets the initial key of the track.
     * @param value Initial key of the track or `undefined` if no value is set
     */
    public set initialKey(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the remixer of the track.
     * @returns Remixer of the track or `undefined` if no value is set
     */
    public get remixedBy(): string { return undefined; }
    /**
     * Sets the remixer of the track.
     * @param value Remixer of the track or `undefined` if no value is set
     */
    public set remixedBy(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the publisher of the track.
     * @returns Publisher of the track or `undefined` if no value is set
     */
    public get publisher(): string { return undefined; }
    /**
     * Sets the publisher of the track.
     * @param value Publisher of the track or `undefined` if no value is set
     */
    public set publisher(value: string) { /* no-op in abstract case */ }

    /**
     * Gets the ISRC (International Standard Recording Code) of the track.
     * @returns the ISRC of the track or `undefined` if no value is set
     */
    public get isrc(): string { return undefined; }
    /**
     * Sets the ISRC (International Standard Recording Code) of the track.
     * @param value the ISRC of the track or `undefined` if no value is set
     */
    public set isrc(value: string) { /* no-op in abstract case */ }

    /**
     * Gets a collection of pictures associated with the media represented by the current instance.
     * @remarks Typically, this value is used to store an album cover or icon to use for the file, but
     *     it is capable of holding any type of image or file, including pictures of the band, the
     *     recording studio, the concert, etc.
     * @returns Array containing a collection of pictures associated with the media represented by
     *     the current instance or an empty array if no pictures are present.
     */
    public get pictures(): IPicture[] { return []; }
    /**
     * Sets a collection of pictures associated with the media represented by the current instance.
     * @remarks Typically, this value is used to store an album cover or icon to use for the file, but
     *     it is capable of holding any type of image or file, including pictures of the band, the
     *     recording studio, the concert, etc.
     * @param value Array containing a collection of pictures associated with the media represented by
     *     the current instance or an empty array if no pictures are present.
     */
    public set pictures(value: IPicture[]) { /* no-op in abstract case */ }

    /**
     * Gets whether or not the album described by the current instance is a compilation.
     */
    public get isCompilation(): boolean { return false; }

    /**
     * Gets whether or not the album described by the current instance is a compilation.
     * @param value Whether or not the album described by the current instance is a compilation
     */
    public set isCompilation(value: boolean) { /* no-op in abstract case */ }

    /**
     * Gets the first value contained in {@link albumArtists}.
     */
    public get firstAlbumArtist(): string { return Tag.firstInGroup(this.albumArtists); }

    /**
     * Gets the first value contained in {@link albumArtistsSort}
     */
    public get firstAlbumArtistSort(): string { return Tag.firstInGroup(this.albumArtists); }

    /**
     * Gets the first value contained in {@link performers}
     */
    public get firstPerformer(): string { return Tag.firstInGroup(this.performers); }

    /**
     * Gets the first value contained in {@link performersSort}
     */
    public get firstPerformerSort(): string { return Tag.firstInGroup(this.performersSort); }

    /**
     * Gets the first value contained in {@link composers}
     */
    public get firstComposer(): string { return Tag.firstInGroup(this.composers); }

    /**
     * Gets the first value contained in {@link composersSort}
     */
    public get firstComposerSort(): string { return Tag.firstInGroup(this.composersSort); }

    /**
     * Gets the first value contained in {@link genres}
     */
    public get firstGenre(): string { return Tag.firstInGroup(this.genres); }

    /**
     * Gets a semicolon and space separated string containing the values in {@link albumArtists}
     */
    public get joinedAlbumArtists(): string { return Tag.joinGroup(this.albumArtists); }

    /**
     * Gets a semicolon and space separated string containing the values in {@link performers}
     */
    public get joinedPerformers(): string { return Tag.joinGroup(this.performers); }

    /**
     * Gets a semicolon and space separated string containing the values in {@link performersSort}
     */
    public get joinedPerformersSort(): string { return Tag.joinGroup(this.performersSort); }

    /**
     * Gets a semicolon and space separated string containing the values in {@link composers}
     */
    public get joinedComposers(): string { return Tag.joinGroup(this.composers); }

    /**
     * Gets a semicolon and space separated string containing the values in {@link genres}
     */
    public get joinedGenres(): string { return Tag.joinGroup(this.genres); }

    /**
     * Gets whether or not the current instance is empty.
     * @remarks In the default implementation, this checks the values supported by {@link Tag}, but it
     *     may be extended by child classes to support other values.
     * @returns `true` if the current instance does not contain any values. `false` otherwise
     */
    public get isEmpty(): boolean {
        return Tag.isFalsyOrLikeEmpty(this.title) &&
            Tag.isFalsyOrLikeEmpty(this.grouping) &&
            Tag.isFalsyOrLikeEmpty(this.albumArtists) &&
            Tag.isFalsyOrLikeEmpty(this.performers) &&
            Tag.isFalsyOrLikeEmpty(this.composers) &&
            Tag.isFalsyOrLikeEmpty(this.conductor) &&
            Tag.isFalsyOrLikeEmpty(this.copyright) &&
            Tag.isFalsyOrLikeEmpty(this.album) &&
            Tag.isFalsyOrLikeEmpty(this.comment) &&
            Tag.isFalsyOrLikeEmpty(this.genres) &&
            this.year === 0 &&
            this.beatsPerMinute === 0 &&
            this.track === 0 &&
            this.trackCount === 0 &&
            this.disc === 0 &&
            this.discCount === 0;
    }

    public static tagTypeFlagsToArray(tagTypes: TagTypes): TagTypes[] {
        const output = [];
        for (const tagType of Object.values(TagTypes)) {
            if (typeof tagType === "string") {
                continue;
            }

            if ((tagTypes & tagType) === tagType) {
                output.push(tagType);
            }
        }

        return output;
    }

    /**
     * Gets the first string in an array.
     * @param group Array of strings to get the first string from.
     * @returns First string contained in `group` or `undefined` if the array is
     *     `undefined` or empty
     * @protected
     */
    protected static firstInGroup(group: string[]): string {
        return !group || group.length === 0
            ? undefined
            : group[0];
    }

    /**
     * Joins an array of string into a single, semicolon and space separated string.
     * @param group Array of string to join
     * @returns A semicolon and space separated string containing the values from `group`
     *     or undefined if the array is `undefined` or empty.
     * @protected
     */
    protected static joinGroup(group: string[]): string {
        return !group || group.length === 0
            ? undefined
            : group.join("; ");
    }

    /**
     * Clears all values stored in the current instance.
     * @remarks The clearing procedure is format specific and should clear all values.
     */
    public abstract clear(): void;

    /**
     * Set the tags that represent the tagger software (node-taglib-sharp) itself.
     * @remarks This is typically a method to call just before saving a tag.
     */
    public setInfoTag(): void {
        this.dateTagged = new Date();
    }

    /**
     * Copies the values from the current instance to another {@link Tag}, optionally overwriting
     *     existing values.
     * @remarks This method only copies the most basic values when copying between different tag
     *     formats. However, if `target` is of the same type as the current instance,
     *     more advanced copying may be done. For example if both `this` and `target` are
     *     {@link Id3v2Tag}, all frames will be copied to the target.
     * @param target Target tag to copy values to
     * @param overwrite Whether or not to copy values over existing ones
     */
    public copyTo(target: Tag, overwrite: boolean): void {
        Guards.truthy(target, "target");
        // @TODO: Allow for overwriting existing values or all values

        if (overwrite || Tag.isFalsyOrLikeEmpty(target.title)) { target.title = this.title; }
        if (overwrite || Tag.isFalsyOrLikeEmpty(target.subtitle)) { target.subtitle = this.subtitle; }
        if (overwrite || Tag.isFalsyOrLikeEmpty(target.description)) { target.description = this.description; }
        if (overwrite || Tag.isFalsyOrLikeEmpty(target.albumArtists)) { target.albumArtists = this.albumArtists; }
        if (overwrite || Tag.isFalsyOrLikeEmpty(target.performers)) { target.performers = this.performers; }
        if (overwrite || Tag.isFalsyOrLikeEmpty(target.performersRole)) { target.performersRole = this.performersRole; }
        if (overwrite || Tag.isFalsyOrLikeEmpty(target.composers)) { target.composers = this.composers; }
        if (overwrite || Tag.isFalsyOrLikeEmpty(target.album)) { target.album = this.album; }
        if (overwrite || Tag.isFalsyOrLikeEmpty(target.comment)) { target.comment = this.comment; }
        if (overwrite || Tag.isFalsyOrLikeEmpty(target.genres)) { target.genres = this.genres; }
        if (overwrite || target.year === 0) { target.year = this.year; }
        if (overwrite || target.track === 0) { target.track = this.track; }
        if (overwrite || target.trackCount === 0) { target.trackCount = this.trackCount; }
        if (overwrite || target.disc === 0) { target.disc = this.disc; }
        if (overwrite || target.discCount === 0) { target.discCount = this.discCount; }
        if (overwrite || target.beatsPerMinute === 0) { target.beatsPerMinute = this.beatsPerMinute; }
        if (overwrite || Tag.isFalsyOrLikeEmpty(target.initialKey)) { target.initialKey = this.initialKey; }
        if (overwrite || Tag.isFalsyOrLikeEmpty(target.publisher)) { target.publisher = this.publisher; }
        if (overwrite || Tag.isFalsyOrLikeEmpty(target.isrc)) { target.isrc = this.isrc; }
        if (overwrite || Tag.isFalsyOrLikeEmpty(target.remixedBy)) { target.remixedBy = this.remixedBy; }
        if (overwrite || Tag.isFalsyOrLikeEmpty(target.grouping)) { target.grouping = this.grouping; }
        if (overwrite || Tag.isFalsyOrLikeEmpty(target.conductor)) { target.conductor = this.conductor; }
        if (overwrite || Tag.isFalsyOrLikeEmpty(target.copyright)) { target.copyright = this.copyright; }
        if (overwrite || !target.dateTagged) { target.dateTagged = this.dateTagged; }
    }

    /**
     * Checks if a value is falsy or empty.
     * @param value Object to check
     * @returns If `value` is a string, `true` is returned if the value is falsy or all
     *     whitespace, `false` is returned otherwise. If `value` is an array of strings,
     *     the array must be falsy or all elements must be falsy or whitespace to return `true`.
     * @protected
     */
    protected static isFalsyOrLikeEmpty(value: string|string[]): boolean {
        // This should match `undefined`, `null`, and `""`
        if (!value) { return true; }

        // Handle pure whitespace string scenario
        if (typeof(value) === "string") {
            return value.trim().length === 0;
        }

        // Handle array scenario
        for (const s of value) {
            // If one of the values in the array is not falsy, break out
            if (!Tag.isFalsyOrLikeEmpty(s)) {
                return false;
            }
        }

        // All elements of the array are falsy
        return true;
    }
}
